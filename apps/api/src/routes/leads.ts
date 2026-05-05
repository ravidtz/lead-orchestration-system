import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import {
  leads, leadNotes, leadFollowUps, leadActivities,
  leadTags, tags, customers,
} from '@crm/db'
import {
  createLeadSchema, updateLeadSchema,
  createLeadNoteSchema, createLeadFollowUpSchema,
  leadQuerySchema,
} from '@crm/validators'
import { eq, and, isNull, ilike, inArray, gte, lte, desc, asc, sql } from 'drizzle-orm'
import { errors } from '../lib/errors'
import { requireScope } from '../middleware/require-role'
import { writeAudit } from '../middleware/audit'

const router = new Hono()

// ─── List leads ───────────────────────────────────────────────────────────────
router.get('/', requireScope('read'), zValidator('query', leadQuerySchema), async (c) => {
  const orgId = c.get('orgId')
  const q = c.req.valid('query')

  const conditions = [eq(leads.orgId, orgId), isNull(leads.deletedAt)]

  if (q.search) conditions.push(ilike(leads.firstName, `%${q.search}%`))
  if (q.status) conditions.push(inArray(leads.status, q.status.split(',')))
  if (q.priority) conditions.push(eq(leads.priority, q.priority))
  if (q.assignedTo) conditions.push(eq(leads.assignedTo, q.assignedTo))
  if (q.source) conditions.push(eq(leads.source, q.source))
  if (q.createdAfter) conditions.push(gte(leads.createdAt, new Date(q.createdAfter)))
  if (q.createdBefore) conditions.push(lte(leads.createdAt, new Date(q.createdBefore)))

  const orderFn = q.order === 'asc' ? asc : desc
  const orderCol = q.sort === 'firstName' ? leads.firstName
    : q.sort === 'status' ? leads.status
    : leads.createdAt

  const offset = (q.page - 1) * q.perPage

  const [data, [{ count }]] = await Promise.all([
    db.select().from(leads).where(and(...conditions))
      .orderBy(orderFn(orderCol))
      .limit(q.perPage).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(leads).where(and(...conditions)),
  ])

  return c.json({
    data,
    meta: { total: Number(count), page: q.page, perPage: q.perPage, totalPages: Math.ceil(Number(count) / q.perPage) },
  })
})

// ─── Create lead ──────────────────────────────────────────────────────────────
router.post('/', requireScope('write'), zValidator('json', createLeadSchema), async (c) => {
  const orgId = c.get('orgId')
  const userId = c.get('userId')
  const body = c.req.valid('json')
  const { tags: tagIds, ...leadData } = body

  const [lead] = await db.insert(leads).values({ ...leadData, orgId, createdBy: userId }).returning()

  if (tagIds?.length) {
    await db.insert(leadTags).values(tagIds.map(tagId => ({ leadId: lead!.id, tagId })))
  }

  await writeAudit({ orgId, actorId: userId, action: 'create', resourceType: 'lead', resourceId: lead!.id, after: lead })

  return c.json({ data: lead }, 201)
})

// ─── Get lead ─────────────────────────────────────────────────────────────────
router.get('/:id', requireScope('read'), async (c) => {
  const orgId = c.get('orgId')
  const [lead] = await db.select().from(leads)
    .where(and(eq(leads.id, c.req.param('id')), eq(leads.orgId, orgId), isNull(leads.deletedAt)))
    .limit(1)

  if (!lead) throw errors.notFound('Lead')
  return c.json({ data: lead })
})

// ─── Update lead ──────────────────────────────────────────────────────────────
router.patch('/:id', requireScope('write'), zValidator('json', updateLeadSchema), async (c) => {
  const orgId = c.get('orgId')
  const userId = c.get('userId')
  const id = c.req.param('id')
  const body = c.req.valid('json')

  const [existing] = await db.select().from(leads)
    .where(and(eq(leads.id, id), eq(leads.orgId, orgId), isNull(leads.deletedAt))).limit(1)
  if (!existing) throw errors.notFound('Lead')

  const [updated] = await db.update(leads)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .returning()

  await writeAudit({ orgId, actorId: userId, action: 'update', resourceType: 'lead', resourceId: id, before: existing, after: updated })

  return c.json({ data: updated })
})

// ─── Delete lead (soft) ───────────────────────────────────────────────────────
router.delete('/:id', async (c) => {
  const orgId = c.get('orgId')
  const role = c.get('role')
  if (!['admin', 'super_admin'].includes(role)) throw errors.forbidden()

  const id = c.req.param('id')
  const [existing] = await db.select().from(leads)
    .where(and(eq(leads.id, id), eq(leads.orgId, orgId), isNull(leads.deletedAt))).limit(1)
  if (!existing) throw errors.notFound('Lead')

  await db.update(leads).set({ deletedAt: new Date() }).where(eq(leads.id, id))
  await writeAudit({ orgId, actorId: c.get('userId'), action: 'delete', resourceType: 'lead', resourceId: id, before: existing })

  return c.body(null, 204)
})

// ─── Convert lead to customer ─────────────────────────────────────────────────
router.post('/:id/convert', async (c) => {
  const orgId = c.get('orgId')
  const userId = c.get('userId')
  const id = c.req.param('id')

  const [lead] = await db.select().from(leads)
    .where(and(eq(leads.id, id), eq(leads.orgId, orgId), isNull(leads.deletedAt))).limit(1)
  if (!lead) throw errors.notFound('Lead')
  if (lead.convertedTo) throw errors.conflict('Lead already converted')

  const [customer] = await db.insert(customers).values({
    orgId,
    leadId: lead.id,
    assignedTo: lead.assignedTo,
    firstName: lead.firstName,
    lastName: lead.lastName ?? undefined,
    email: lead.email ?? undefined,
    phone: lead.phone ?? undefined,
    company: lead.company ?? undefined,
    jobTitle: lead.jobTitle ?? undefined,
    customFields: lead.customFields as Record<string, unknown>,
    createdBy: userId,
  }).returning()

  await db.update(leads).set({ convertedTo: customer!.id, convertedAt: new Date() }).where(eq(leads.id, id))
  await writeAudit({ orgId, actorId: userId, action: 'convert', resourceType: 'lead', resourceId: id, after: { customerId: customer!.id } })

  return c.json({ data: customer }, 201)
})

// ─── Activity ─────────────────────────────────────────────────────────────────
router.get('/:id/activity', requireScope('read'), async (c) => {
  const data = await db.select().from(leadActivities)
    .where(eq(leadActivities.leadId, c.req.param('id')))
    .orderBy(desc(leadActivities.createdAt))
    .limit(50)
  return c.json({ data })
})

// ─── Notes ────────────────────────────────────────────────────────────────────
router.post('/:id/notes', zValidator('json', createLeadNoteSchema), async (c) => {
  const userId = c.get('userId')
  const body = c.req.valid('json')
  const [note] = await db.insert(leadNotes).values({
    leadId: c.req.param('id'), authorId: userId, content: body.content,
  }).returning()
  return c.json({ data: note }, 201)
})

router.patch('/:id/notes/:noteId', zValidator('json', createLeadNoteSchema), async (c) => {
  const userId = c.get('userId')
  const role = c.get('role')
  const { noteId } = c.req.param()
  const [note] = await db.select().from(leadNotes).where(eq(leadNotes.id, noteId)).limit(1)
  if (!note) throw errors.notFound('Note')
  if (note.authorId !== userId && !['admin', 'super_admin'].includes(role)) throw errors.forbidden()

  const [updated] = await db.update(leadNotes)
    .set({ content: c.req.valid('json').content, updatedAt: new Date() })
    .where(eq(leadNotes.id, noteId)).returning()
  return c.json({ data: updated })
})

router.delete('/:id/notes/:noteId', async (c) => {
  const userId = c.get('userId')
  const role = c.get('role')
  const { noteId } = c.req.param()
  const [note] = await db.select().from(leadNotes).where(eq(leadNotes.id, noteId)).limit(1)
  if (!note) throw errors.notFound('Note')
  if (note.authorId !== userId && !['admin', 'super_admin'].includes(role)) throw errors.forbidden()
  await db.delete(leadNotes).where(eq(leadNotes.id, noteId))
  return c.body(null, 204)
})

// ─── Follow-ups ───────────────────────────────────────────────────────────────
router.post('/:id/follow-ups', zValidator('json', createLeadFollowUpSchema), async (c) => {
  const userId = c.get('userId')
  const body = c.req.valid('json')
  const [fu] = await db.insert(leadFollowUps).values({
    leadId: c.req.param('id'),
    assignedTo: body.assignedTo ?? userId,
    title: body.title,
    dueAt: new Date(body.dueAt),
    createdBy: userId,
  }).returning()
  return c.json({ data: fu }, 201)
})

router.patch('/:id/follow-ups/:fuId', async (c) => {
  const body = await c.req.json()
  const [fu] = await db.update(leadFollowUps)
    .set({ ...body, ...(body.completedAt ? { completedAt: new Date(body.completedAt) } : {}) })
    .where(eq(leadFollowUps.id, c.req.param('fuId')))
    .returning()
  return c.json({ data: fu })
})

export default router

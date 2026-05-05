import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { customers, customerNotes, customerActivities } from '@crm/db'
import { updateCustomerSchema, customerQuerySchema } from '@crm/validators'
import { eq, and, isNull, ilike, desc, sql } from 'drizzle-orm'
import { errors } from '../lib/errors'
import { requireScope } from '../middleware/require-role'
import { writeAudit } from '../middleware/audit'

const router = new Hono()

router.get('/', requireScope('read'), zValidator('query', customerQuerySchema), async (c) => {
  const orgId = c.get('orgId')
  const q = c.req.valid('query')
  const offset = (q.page - 1) * q.perPage

  const conditions = [eq(customers.orgId, orgId), isNull(customers.deletedAt)]
  if (q.search) conditions.push(ilike(customers.firstName, `%${q.search}%`))
  if (q.status) conditions.push(eq(customers.status, q.status))
  if (q.tier) conditions.push(eq(customers.tier, q.tier))
  if (q.assignedTo) conditions.push(eq(customers.assignedTo, q.assignedTo))

  const [data, [{ count }]] = await Promise.all([
    db.select().from(customers).where(and(...conditions))
      .orderBy(desc(customers.createdAt)).limit(q.perPage).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(customers).where(and(...conditions)),
  ])

  return c.json({
    data,
    meta: { total: Number(count), page: q.page, perPage: q.perPage, totalPages: Math.ceil(Number(count) / q.perPage) },
  })
})

router.get('/:id', requireScope('read'), async (c) => {
  const orgId = c.get('orgId')
  const [customer] = await db.select().from(customers)
    .where(and(eq(customers.id, c.req.param('id')), eq(customers.orgId, orgId), isNull(customers.deletedAt)))
    .limit(1)
  if (!customer) throw errors.notFound('Customer')
  return c.json({ data: customer })
})

router.patch('/:id', requireScope('write'), zValidator('json', updateCustomerSchema), async (c) => {
  const orgId = c.get('orgId')
  const userId = c.get('userId')
  const id = c.req.param('id')
  const body = c.req.valid('json')

  const [existing] = await db.select().from(customers)
    .where(and(eq(customers.id, id), eq(customers.orgId, orgId), isNull(customers.deletedAt))).limit(1)
  if (!existing) throw errors.notFound('Customer')

  const [updated] = await db.update(customers)
    .set({ ...body, updatedAt: new Date() }).where(eq(customers.id, id)).returning()

  await writeAudit({ orgId, actorId: userId, action: 'update', resourceType: 'customer', resourceId: id, before: existing, after: updated })
  return c.json({ data: updated })
})

router.delete('/:id', async (c) => {
  const role = c.get('role')
  if (!['admin', 'super_admin'].includes(role)) throw errors.forbidden()
  const orgId = c.get('orgId')
  const id = c.req.param('id')

  const [existing] = await db.select().from(customers)
    .where(and(eq(customers.id, id), eq(customers.orgId, orgId), isNull(customers.deletedAt))).limit(1)
  if (!existing) throw errors.notFound('Customer')

  await db.update(customers).set({ deletedAt: new Date() }).where(eq(customers.id, id))
  return c.body(null, 204)
})

router.get('/:id/activity', requireScope('read'), async (c) => {
  const data = await db.select().from(customerActivities)
    .where(eq(customerActivities.customerId, c.req.param('id')))
    .orderBy(desc(customerActivities.createdAt)).limit(50)
  return c.json({ data })
})

router.post('/:id/notes', async (c) => {
  const body = await c.req.json()
  const [note] = await db.insert(customerNotes).values({
    customerId: c.req.param('id'), authorId: c.get('userId'), content: body.content,
  }).returning()
  return c.json({ data: note }, 201)
})

router.patch('/:id/notes/:noteId', async (c) => {
  const body = await c.req.json()
  const [note] = await db.update(customerNotes)
    .set({ content: body.content, updatedAt: new Date() })
    .where(eq(customerNotes.id, c.req.param('noteId'))).returning()
  return c.json({ data: note })
})

router.delete('/:id/notes/:noteId', async (c) => {
  await db.delete(customerNotes).where(eq(customerNotes.id, c.req.param('noteId')))
  return c.body(null, 204)
})

export default router

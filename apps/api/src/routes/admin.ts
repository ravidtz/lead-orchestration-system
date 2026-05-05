import { Hono } from 'hono'
import { db } from '../lib/db'
import { users, leads, customers, auditLogs } from '@crm/db'
import { eq, desc, sql, and, gte } from 'drizzle-orm'
import { requireRole } from '../middleware/require-role'
import { supabase } from '../lib/supabase'
import { errors } from '../lib/errors'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const router = new Hono()

router.use('*', requireRole('admin'))

router.get('/users', async (c) => {
  const orgId = c.get('orgId')
  const data = await db.select().from(users).where(eq(users.orgId, orgId)).orderBy(desc(users.createdAt))
  return c.json({ data })
})

router.post('/users/invite', zValidator('json', z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'agent', 'viewer']),
  fullName: z.string().optional(),
})), async (c) => {
  const orgId = c.get('orgId')
  const body = c.req.valid('json')
  const callerRole = c.get('role')

  if (body.role === 'admin' && callerRole !== 'super_admin') throw errors.forbidden()

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(body.email)
  if (error) throw errors.conflict('Email already exists or invite failed')

  const [user] = await db.insert(users).values({
    id: data.user.id,
    orgId,
    email: body.email,
    fullName: body.fullName ?? null,
    role: body.role,
  }).returning()

  return c.json({ data: user }, 201)
})

router.patch('/users/:id', zValidator('json', z.object({
  role: z.enum(['admin', 'agent', 'viewer']).optional(),
  isActive: z.boolean().optional(),
  fullName: z.string().optional(),
})), async (c) => {
  const orgId = c.get('orgId')
  const body = c.req.valid('json')

  const [updated] = await db.update(users)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(users.id, c.req.param('id')), eq(users.orgId, orgId)))
    .returning()

  if (!updated) throw errors.notFound('User')
  return c.json({ data: updated })
})

router.get('/analytics', async (c) => {
  const orgId = c.get('orgId')
  const from = c.req.query('from')
  const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [leadStats, customerStats] = await Promise.all([
    db.select({
      status: leads.status,
      count: sql<number>`count(*)`,
    }).from(leads).where(and(eq(leads.orgId, orgId), gte(leads.createdAt, fromDate))).groupBy(leads.status),

    db.select({
      status: customers.status,
      count: sql<number>`count(*)`,
    }).from(customers).where(and(eq(customers.orgId, orgId), gte(customers.createdAt, fromDate))).groupBy(customers.status),
  ])

  return c.json({ data: { leads: leadStats, customers: customerStats } })
})

router.get('/audit-logs', async (c) => {
  const orgId = c.get('orgId')
  const data = await db.select().from(auditLogs)
    .where(eq(auditLogs.orgId, orgId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(100)
  return c.json({ data })
})

export default router

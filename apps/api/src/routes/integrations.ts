import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { apiKeys, webhooks, webhookLogs } from '@crm/db'
import { createApiKeySchema, createWebhookSchema, updateWebhookSchema } from '@crm/validators'
import { eq, and, desc } from 'drizzle-orm'
import { requireRole } from '../middleware/require-role'
import { errors } from '../lib/errors'

const router = new Hono()

router.use('*', requireRole('admin'))

// ─── API Keys ─────────────────────────────────────────────────────────────────
router.get('/api-keys', async (c) => {
  const data = await db.select({
    id: apiKeys.id, name: apiKeys.name, keyPreview: apiKeys.keyPreview,
    scopes: apiKeys.scopes, lastUsedAt: apiKeys.lastUsedAt,
    expiresAt: apiKeys.expiresAt, isActive: apiKeys.isActive, createdAt: apiKeys.createdAt,
  }).from(apiKeys).where(eq(apiKeys.orgId, c.get('orgId'))).orderBy(desc(apiKeys.createdAt))
  return c.json({ data })
})

router.post('/api-keys', zValidator('json', createApiKeySchema), async (c) => {
  const orgId = c.get('orgId')
  const userId = c.get('userId')
  const body = c.req.valid('json')

  const rawKey = `crm_${crypto.randomUUID().replace(/-/g, '')}`
  const hash = await hashKey(rawKey)
  const preview = rawKey.slice(-4)

  const [key] = await db.insert(apiKeys).values({
    orgId, name: body.name, keyHash: hash, keyPreview: preview,
    scopes: body.scopes, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    createdBy: userId,
  }).returning()

  return c.json({ data: { ...key, keyHash: undefined }, key: rawKey }, 201)
})

router.delete('/api-keys/:id', async (c) => {
  const [key] = await db.select().from(apiKeys)
    .where(and(eq(apiKeys.id, c.req.param('id')), eq(apiKeys.orgId, c.get('orgId')))).limit(1)
  if (!key) throw errors.notFound('API key')
  await db.delete(apiKeys).where(eq(apiKeys.id, key.id))
  return c.body(null, 204)
})

// ─── Webhooks ─────────────────────────────────────────────────────────────────
router.get('/webhooks', async (c) => {
  const data = await db.select({
    id: webhooks.id, url: webhooks.url, events: webhooks.events,
    isActive: webhooks.isActive, createdAt: webhooks.createdAt,
  }).from(webhooks).where(eq(webhooks.orgId, c.get('orgId')))
  return c.json({ data })
})

router.post('/webhooks', zValidator('json', createWebhookSchema), async (c) => {
  const orgId = c.get('orgId')
  const body = c.req.valid('json')
  const secret = body.secret ?? crypto.randomUUID()

  const [webhook] = await db.insert(webhooks).values({
    orgId, url: body.url, events: body.events, secret,
    createdBy: c.get('userId'),
  }).returning()

  return c.json({ data: { ...webhook, secret } }, 201)
})

router.patch('/webhooks/:id', zValidator('json', updateWebhookSchema), async (c) => {
  const [wh] = await db.update(webhooks)
    .set(c.req.valid('json'))
    .where(and(eq(webhooks.id, c.req.param('id')), eq(webhooks.orgId, c.get('orgId'))))
    .returning()
  if (!wh) throw errors.notFound('Webhook')
  return c.json({ data: wh })
})

router.delete('/webhooks/:id', async (c) => {
  await db.delete(webhooks)
    .where(and(eq(webhooks.id, c.req.param('id')), eq(webhooks.orgId, c.get('orgId'))))
  return c.body(null, 204)
})

router.get('/webhook-logs', async (c) => {
  const data = await db.select().from(webhookLogs)
    .orderBy(desc(webhookLogs.attemptedAt)).limit(100)
  return c.json({ data })
})

router.post('/webhooks/:id/test', async (c) => {
  const [wh] = await db.select().from(webhooks)
    .where(and(eq(webhooks.id, c.req.param('id')), eq(webhooks.orgId, c.get('orgId')))).limit(1)
  if (!wh) throw errors.notFound('Webhook')

  const start = Date.now()
  try {
    const res = await fetch(wh.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Event': 'test' },
      body: JSON.stringify({ event: 'test', timestamp: Date.now() }),
    })
    return c.json({ statusCode: res.status, success: res.ok, durationMs: Date.now() - start })
  } catch {
    return c.json({ statusCode: null, success: false, durationMs: Date.now() - start })
  }
})

async function hashKey(key: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default router

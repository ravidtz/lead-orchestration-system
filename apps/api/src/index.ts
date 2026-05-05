import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { authMiddleware } from './middleware/auth'
import { handleError } from './lib/errors'
import authRouter from './routes/auth'
import leadsRouter from './routes/leads'
import customersRouter from './routes/customers'
import adminRouter from './routes/admin'
import integrationsRouter from './routes/integrations'

const app = new Hono()
const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

function resolveCorsOrigin(origin?: string) {
  if (!origin) return allowedOrigins[0] ?? ''
  if (allowedOrigins.includes(origin)) return origin

  if (process.env.NODE_ENV !== 'production') {
    try {
      const { hostname } = new URL(origin)
      if (hostname === 'localhost' || hostname === '127.0.0.1') return origin
    } catch {
      return ''
    }
  }

  return ''
}

// ─── Global middleware ────────────────────────────────────────────────────────
app.use('*', secureHeaders())
app.use('*', cors({
  origin: resolveCorsOrigin,
  allowHeaders: ['Authorization', 'Content-Type', 'X-API-Key'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}))
app.use('*', logger())

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok', ts: new Date().toISOString() }))

// ─── Public routes ────────────────────────────────────────────────────────────
app.route('/v1/auth', authRouter)

// ─── Auth middleware — applied explicitly per group, never on /v1/auth ────────
app.use('/v1/leads/*', authMiddleware)
app.use('/v1/customers/*', authMiddleware)
app.use('/v1/admin/*', authMiddleware)
app.use('/v1/integrations/*', authMiddleware)
app.use('/v1/conversations/*', authMiddleware)
app.use('/v1/voice/*', authMiddleware)

// ─── Protected routes ─────────────────────────────────────────────────────────
app.route('/v1/leads', leadsRouter)
app.route('/v1/customers', customersRouter)
app.route('/v1/admin', adminRouter)
app.route('/v1/integrations', integrationsRouter)

// ─── Error handler ────────────────────────────────────────────────────────────
app.onError((err, c) => handleError(err, c))
app.notFound((c) => c.json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404))

export default {
  port: Number(process.env.PORT ?? 3001),
  fetch: app.fetch,
}

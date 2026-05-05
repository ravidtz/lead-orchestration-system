import type { MiddlewareHandler } from 'hono'
import { createMiddleware } from 'hono/factory'
import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { apiKeys, users } from '@crm/db'
import { eq, and } from 'drizzle-orm'
import { errors } from '../lib/errors'

type AuthVariables = {
  userId: string
  orgId: string
  role: string
  authType: 'jwt' | 'api_key'
  scopes?: string[]
}

declare module 'hono' {
  interface ContextVariableMap extends AuthVariables {}
}

export const authMiddleware: MiddlewareHandler = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  const apiKeyHeader = c.req.header('X-API-Key')

  if (apiKeyHeader) {
    const hash = await hashKey(apiKeyHeader)
    const [key] = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.keyHash, hash), eq(apiKeys.isActive, true)))
      .limit(1)

    if (!key) throw errors.unauthorized()
    if (key.expiresAt && key.expiresAt < new Date()) throw errors.unauthorized()

    // Update last used (fire and forget)
    db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, key.id)).execute()

    c.set('orgId', key.orgId)
    c.set('authType', 'api_key')
    c.set('scopes', key.scopes ?? [])
    return next()
  }

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) throw errors.unauthorized()

    const [dbUser] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, user.id), eq(users.isActive, true)))
      .limit(1)

    if (!dbUser) throw errors.unauthorized()

    c.set('userId', dbUser.id)
    c.set('orgId', dbUser.orgId)
    c.set('role', dbUser.role)
    c.set('authType', 'jwt')
    return next()
  }

  throw errors.unauthorized()
})

async function hashKey(key: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

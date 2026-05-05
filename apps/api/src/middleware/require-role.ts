import { createMiddleware } from 'hono/factory'
import { errors } from '../lib/errors'

const ROLE_HIERARCHY = ['viewer', 'agent', 'admin', 'super_admin']

export function requireRole(minRole: string) {
  return createMiddleware(async (c, next) => {
    const role = c.get('role')
    if (!role) throw errors.forbidden()

    const userLevel = ROLE_HIERARCHY.indexOf(role)
    const requiredLevel = ROLE_HIERARCHY.indexOf(minRole)

    if (userLevel < requiredLevel) throw errors.forbidden()
    return next()
  })
}

export function requireScope(scope: string) {
  return createMiddleware(async (c, next) => {
    const authType = c.get('authType')
    if (authType === 'jwt') return next() // JWT users have full access per role

    const scopes = c.get('scopes') ?? []
    if (!scopes.includes(scope)) throw errors.forbidden()
    return next()
  })
}

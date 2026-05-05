import {
  pgTable, uuid, text, jsonb,
  timestamp, index,
} from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { users } from './users'

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(), // create | update | delete | login | invite | etc
  resourceType: text('resource_type').notNull(), // lead | customer | user | api_key | etc
  resourceId: uuid('resource_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('audit_logs_org_created_idx').on(t.orgId, t.createdAt),
  index('audit_logs_resource_idx').on(t.resourceType, t.resourceId),
])

export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert

import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // matches Supabase auth.users.id
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').unique().notNull(),
  fullName: text('full_name'),
  role: text('role').notNull().default('agent'), // super_admin | admin | agent | viewer
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

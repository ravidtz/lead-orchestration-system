import {
  pgTable, uuid, text, jsonb,
  timestamp, index,
} from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { users } from './users'
import { leads } from './leads'

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  jobTitle: text('job_title'),
  status: text('status').default('active').notNull(), // active | churned | paused
  tier: text('tier').default('standard').notNull(), // standard | vip | enterprise
  customFields: jsonb('custom_fields').default({}).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
}, (t) => [
  index('customers_org_status_idx').on(t.orgId, t.status),
  index('customers_org_assigned_idx').on(t.orgId, t.assignedTo),
  index('customers_email_idx').on(t.email),
])

export const customerNotes = pgTable('customer_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const customerActivities = pgTable('customer_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
  type: text('type').notNull(),
  payload: jsonb('payload').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('customer_activities_customer_created_idx').on(t.customerId, t.createdAt),
])

export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
export type CustomerNote = typeof customerNotes.$inferSelect
export type CustomerActivity = typeof customerActivities.$inferSelect

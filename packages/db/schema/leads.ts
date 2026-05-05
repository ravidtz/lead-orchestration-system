import {
  pgTable, uuid, text, integer, jsonb,
  timestamp, index,
} from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { users } from './users'

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  jobTitle: text('job_title'),
  source: text('source'), // web | referral | api | manual
  status: text('status').notNull().default('new'), // new | contacted | qualified | proposal | won | lost
  priority: text('priority').default('medium').notNull(), // low | medium | high
  score: integer('score').default(0).notNull(),
  notesCount: integer('notes_count').default(0).notNull(),
  convertedAt: timestamp('converted_at', { withTimezone: true }),
  convertedTo: uuid('converted_to'), // FK to customers — set after insert to avoid circular
  customFields: jsonb('custom_fields').default({}).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
}, (t) => [
  index('leads_org_status_idx').on(t.orgId, t.status),
  index('leads_org_assigned_idx').on(t.orgId, t.assignedTo),
  index('leads_org_created_idx').on(t.orgId, t.createdAt),
  index('leads_email_idx').on(t.email),
])

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const leadTags = pgTable('lead_tags', {
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
})

export const leadNotes = pgTable('lead_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('lead_notes_lead_idx').on(t.leadId),
])

export const leadFollowUps = pgTable('lead_follow_ups', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
}, (t) => [
  index('lead_follow_ups_lead_idx').on(t.leadId),
  index('lead_follow_ups_assigned_due_idx').on(t.assignedTo, t.dueAt),
])

export const leadActivities = pgTable('lead_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }),
  actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // created | status_changed | note_added | assigned | converted | field_updated
  payload: jsonb('payload').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('lead_activities_lead_created_idx').on(t.leadId, t.createdAt),
])

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type Tag = typeof tags.$inferSelect
export type LeadNote = typeof leadNotes.$inferSelect
export type LeadFollowUp = typeof leadFollowUps.$inferSelect
export type LeadActivity = typeof leadActivities.$inferSelect

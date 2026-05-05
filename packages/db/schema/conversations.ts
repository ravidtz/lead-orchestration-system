import {
  pgTable, uuid, text, boolean, integer, jsonb,
  timestamp, index,
} from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { users } from './users'

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  contactType: text('contact_type').notNull(), // lead | customer
  contactId: uuid('contact_id').notNull(),
  channel: text('channel').notNull(), // chat | voice
  status: text('status').default('open').notNull(), // open | pending_human | closed
  assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
  aiEnabled: boolean('ai_enabled').default(true).notNull(),
  systemPrompt: text('system_prompt'),
  messageCount: integer('message_count').default(0).notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
}, (t) => [
  index('conversations_org_status_idx').on(t.orgId, t.status),
  index('conversations_contact_idx').on(t.contactType, t.contactId),
])

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // user | assistant | system
  content: text('content').notNull(),
  tokensUsed: integer('tokens_used'),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('messages_conversation_created_idx').on(t.conversationId, t.createdAt),
])

export type Conversation = typeof conversations.$inferSelect
export type NewConversation = typeof conversations.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

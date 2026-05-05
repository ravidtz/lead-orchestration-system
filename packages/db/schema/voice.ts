import {
  pgTable, uuid, text, integer, real,
  timestamp, index,
} from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { conversations } from './conversations'

export const voiceCalls = pgTable('voice_calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'set null' }),
  contactType: text('contact_type'), // lead | customer
  contactId: uuid('contact_id'),
  twilioCallSid: text('twilio_call_sid').unique(),
  direction: text('direction'), // inbound | outbound
  fromNumber: text('from_number'),
  toNumber: text('to_number'),
  status: text('status').notNull().default('initiated'), // initiated | in_progress | completed | failed
  durationSec: integer('duration_sec'),
  summary: text('summary'),
  recordingUrl: text('recording_url'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('voice_calls_org_started_idx').on(t.orgId, t.startedAt),
])

export const callTranscripts = pgTable('call_transcripts', {
  id: uuid('id').primaryKey().defaultRandom(),
  callId: uuid('call_id').notNull().references(() => voiceCalls.id, { onDelete: 'cascade' }),
  speaker: text('speaker').notNull(), // user | assistant
  content: text('content').notNull(),
  startedMs: integer('started_ms'),
  confidence: real('confidence'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('call_transcripts_call_idx').on(t.callId),
])

export type VoiceCall = typeof voiceCalls.$inferSelect
export type CallTranscript = typeof callTranscripts.$inferSelect

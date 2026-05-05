// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'agent' | 'viewer'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
export type LeadPriority = 'low' | 'medium' | 'high'
export type CustomerStatus = 'active' | 'churned' | 'paused'
export type CustomerTier = 'standard' | 'vip' | 'enterprise'
export type ConversationChannel = 'chat' | 'voice'
export type ConversationStatus = 'open' | 'pending_human' | 'closed'
export type MessageRole = 'user' | 'assistant' | 'system'
export type CallDirection = 'inbound' | 'outbound'
export type CallStatus = 'initiated' | 'in_progress' | 'completed' | 'failed'
export type ApiKeyScope = 'read' | 'write' | 'webhook'
export type OrgPlan = 'free' | 'pro' | 'enterprise'

// ─── Shared response types ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}

// ─── Domain types (client-safe, no secrets) ───────────────────────────────────

export interface OrganizationDTO {
  id: string
  name: string
  slug: string
  plan: OrgPlan
}

export interface UserDTO {
  id: string
  orgId: string
  email: string
  fullName: string | null
  role: UserRole
  avatarUrl: string | null
  isActive: boolean
  createdAt: string
}

export interface TagDTO {
  id: string
  orgId: string
  name: string
  color: string | null
}

export interface LeadDTO {
  id: string
  orgId: string
  assignedTo: string | null
  firstName: string
  lastName: string | null
  email: string | null
  phone: string | null
  company: string | null
  jobTitle: string | null
  source: string | null
  status: LeadStatus
  priority: LeadPriority
  score: number
  notesCount: number
  convertedAt: string | null
  convertedTo: string | null
  customFields: Record<string, unknown>
  tags: TagDTO[]
  createdAt: string
  updatedAt: string
  createdBy: string | null
}

export interface CustomerDTO {
  id: string
  orgId: string
  leadId: string | null
  assignedTo: string | null
  firstName: string
  lastName: string | null
  email: string | null
  phone: string | null
  company: string | null
  jobTitle: string | null
  status: CustomerStatus
  tier: CustomerTier
  customFields: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ConversationDTO {
  id: string
  orgId: string
  contactType: 'lead' | 'customer'
  contactId: string
  channel: ConversationChannel
  status: ConversationStatus
  assignedTo: string | null
  aiEnabled: boolean
  messageCount: number
  startedAt: string
  closedAt: string | null
}

export interface MessageDTO {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  tokensUsed: number | null
  createdAt: string
}

export interface VoiceCallDTO {
  id: string
  orgId: string
  conversationId: string | null
  contactType: string | null
  contactId: string | null
  direction: CallDirection | null
  fromNumber: string | null
  toNumber: string | null
  status: CallStatus
  durationSec: number | null
  summary: string | null
  startedAt: string | null
  endedAt: string | null
}

export interface ApiKeyDTO {
  id: string
  orgId: string
  name: string
  keyPreview: string
  scopes: ApiKeyScope[]
  lastUsedAt: string | null
  expiresAt: string | null
  isActive: boolean
  createdAt: string
}

export interface WebhookDTO {
  id: string
  orgId: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: string
}

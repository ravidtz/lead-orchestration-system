import { z } from 'zod'

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const
const LEAD_PRIORITIES = ['low', 'medium', 'high'] as const

export const createLeadSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().min(7).max(20).optional(),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(200).optional(),
  source: z.string().max(50).optional(),
  status: z.enum(LEAD_STATUSES).default('new'),
  priority: z.enum(LEAD_PRIORITIES).default('medium'),
  assignedTo: z.string().uuid().optional(),
  customFields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  tags: z.array(z.string().uuid()).optional(),
})

export const updateLeadSchema = createLeadSchema.partial()

export const createLeadNoteSchema = z.object({
  content: z.string().min(1).max(10000),
})

export const createLeadFollowUpSchema = z.object({
  title: z.string().min(1).max(200),
  dueAt: z.string().datetime(),
  assignedTo: z.string().uuid().optional(),
})

export const leadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  source: z.string().optional(),
  tags: z.string().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>

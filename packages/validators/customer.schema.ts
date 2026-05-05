import { z } from 'zod'

const CUSTOMER_STATUSES = ['active', 'churned', 'paused'] as const
const CUSTOMER_TIERS = ['standard', 'vip', 'enterprise'] as const

export const updateCustomerSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().min(7).max(20).optional(),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(200).optional(),
  status: z.enum(CUSTOMER_STATUSES).optional(),
  tier: z.enum(CUSTOMER_TIERS).optional(),
  assignedTo: z.string().uuid().optional(),
  customFields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
})

export const customerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  status: z.enum(CUSTOMER_STATUSES).optional(),
  tier: z.enum(CUSTOMER_TIERS).optional(),
  assignedTo: z.string().uuid().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
})

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>

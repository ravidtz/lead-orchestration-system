import { z } from 'zod'

const API_KEY_SCOPES = ['read', 'write', 'webhook'] as const

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.enum(API_KEY_SCOPES)).min(1),
  expiresAt: z.string().datetime().optional(),
})

export const createWebhookSchema = z.object({
  url: z.string().url().startsWith('https://'),
  events: z.array(z.string()).min(1),
  secret: z.string().min(16).max(256).optional(),
})

export const updateWebhookSchema = z.object({
  url: z.string().url().startsWith('https://').optional(),
  events: z.array(z.string()).min(1).optional(),
  isActive: z.boolean().optional(),
})

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>
export type CreateWebhookInput = z.infer<typeof createWebhookSchema>

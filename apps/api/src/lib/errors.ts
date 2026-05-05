import type { Context } from 'hono'

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number,
    public fields?: Record<string, string>,
  ) {
    super(message)
  }
}

export const errors = {
  unauthorized: () => new AppError('UNAUTHORIZED', 'Authentication required', 401),
  forbidden: () => new AppError('FORBIDDEN', 'Insufficient permissions', 403),
  notFound: (resource = 'Resource') => new AppError('NOT_FOUND', `${resource} not found`, 404),
  conflict: (msg: string) => new AppError('CONFLICT', msg, 409),
  validation: (fields: Record<string, string>) =>
    new AppError('VALIDATION_ERROR', 'Validation failed', 400, fields),
  rateLimited: () => new AppError('RATE_LIMITED', 'Too many requests', 429),
  unprocessable: (msg: string) => new AppError('UNPROCESSABLE', msg, 422),
}

export function handleError(err: unknown, c: Context) {
  if (err instanceof AppError) {
    return c.json({ error: { code: err.code, message: err.message, fields: err.fields } }, err.status as any)
  }
  console.error('[handleError] Unhandled error:', err)
  if (err instanceof Error) {
    console.error('[handleError] message:', err.message)
    console.error('[handleError] stack:', err.stack)
  }
  return c.json({ error: { code: 'SERVER_ERROR', message: 'Unexpected error' } }, 500)
}

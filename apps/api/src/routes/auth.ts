import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { signUpSchema, signInSchema, resetPasswordSchema, resetPasswordConfirmSchema } from '@crm/validators'
import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { organizations, users } from '@crm/db'
import { errors } from '../lib/errors'

const auth = new Hono()

auth.post('/signup', zValidator('json', signUpSchema), async (c) => {
  const { email, password, fullName, orgName } = c.req.valid('json')

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    if (error.message.includes('already')) throw errors.conflict('Email already in use')
    throw error
  }

  const slug = orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const [org] = await db.insert(organizations).values({
    name: orgName,
    slug: `${slug}-${Date.now()}`,
  }).returning()

  await db.insert(users).values({
    id: data.user.id,
    orgId: org!.id,
    email,
    fullName,
    role: 'admin',
  })

  return c.json({ data: { userId: data.user.id, orgId: org!.id } }, 201)
})

auth.post('/signin', zValidator('json', signInSchema), async (c) => {
  const { email, password } = c.req.valid('json')

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw errors.unauthorized()

  return c.json({ data: { session: data.session, user: data.user } })
})

auth.post('/signout', async (c) => {
  const token = c.req.header('Authorization')?.slice(7)
  if (token) await supabase.auth.admin.signOut(token)
  return c.body(null, 204)
})

auth.post('/reset-password', zValidator('json', resetPasswordSchema), async (c) => {
  const { email } = c.req.valid('json')
  await supabase.auth.resetPasswordForEmail(email)
  return c.body(null, 204) // Always 204 — don't leak whether email exists
})

auth.post('/reset-password/confirm', zValidator('json', resetPasswordConfirmSchema), async (c) => {
  const { newPassword } = c.req.valid('json')
  const token = c.req.header('Authorization')?.slice(7)
  if (!token) throw errors.unauthorized()

  const { error } = await supabase.auth.admin.updateUserById(token, { password: newPassword })
  if (error) throw errors.unprocessable('Invalid or expired token')

  return c.body(null, 204)
})

export default auth

import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  fullName: z.string().min(1).max(100),
  orgName: z.string().min(1).max(100),
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(72),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>

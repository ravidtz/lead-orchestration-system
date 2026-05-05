'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, type SignUpInput } from '@crm/validators'
import { Button, Input } from '@/components/ui'
import { api } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit(data: SignUpInput) {
    setError(null)
    try {
      await api.post('/auth/signup', data)
      router.push('/signin?registered=1')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'שגיאה ברישום')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary">צור חשבון</h1>
          <p className="text-text-secondary mt-1">התחל לנהל את הלקוחות שלך</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="שם מלא" required {...register('fullName')} error={errors.fullName?.message} />
            <Input label="שם הארגון" required {...register('orgName')} error={errors.orgName?.message} />
            <Input label="אימייל" type="email" required {...register('email')} error={errors.email?.message} />
            <Input label="סיסמה" type="password" required {...register('password')} error={errors.password?.message} hint="לפחות 8 תווים" />
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full" loading={isSubmitting} size="lg">הרשם</Button>
          </form>

          <p className="mt-4 text-center text-sm text-text-secondary">
            יש לך חשבון?{' '}
            <Link href="/signin" className="text-accent hover:underline">התחבר</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

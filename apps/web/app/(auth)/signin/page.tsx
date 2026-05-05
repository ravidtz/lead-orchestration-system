'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, type SignInInput } from '@crm/validators'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LogIn, Mail, Lock, Sparkles, BarChart3, Users, MessageCircle } from 'lucide-react'

const RECENT_EMAILS_KEY = 'crm.recent-emails'
const MAX_RECENT_EMAILS = 5

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [recentEmails, setRecentEmails] = useState<string[]>([])
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false)
  const { register, setValue, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })
  const emailValue = watch('email', '')

  useEffect(() => {
    const storedEmails = window.localStorage.getItem(RECENT_EMAILS_KEY)
    if (!storedEmails) return

    try {
      const parsed = JSON.parse(storedEmails)
      if (Array.isArray(parsed)) {
        setRecentEmails(parsed.filter((value): value is string => typeof value === 'string'))
      }
    } catch {
      window.localStorage.removeItem(RECENT_EMAILS_KEY)
    }
  }, [])

  function storeRecentEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return

    setRecentEmails((currentEmails) => {
      const nextEmails = [normalizedEmail, ...currentEmails.filter((value) => value !== normalizedEmail)]
        .slice(0, MAX_RECENT_EMAILS)
      window.localStorage.setItem(RECENT_EMAILS_KEY, JSON.stringify(nextEmails))
      return nextEmails
    })
  }

  async function onSubmit(data: SignInInput) {
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword(data)
      if (error) { setError(`שגיאה: ${error.message}`); return }
      storeRecentEmail(data.email)
      router.push('/')
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? `שגיאה: ${e.message}` : 'שגיאת התחברות לא ידועה')
    }
  }

  const suggestedEmails = recentEmails.filter((email) =>
    emailValue.trim()
      ? email.includes(emailValue.trim().toLowerCase())
      : true,
  )
  const shouldShowEmailSuggestions = showEmailSuggestions && suggestedEmails.length > 0

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Ambient floating icons */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="animate-float absolute top-[15%] left-[10%] text-accent/20">
          <BarChart3 size={48} />
        </div>
        <div className="animate-float-delay absolute top-[20%] right-[12%] text-accent/15">
          <Users size={36} />
        </div>
        <div className="animate-float-slow absolute bottom-[25%] left-[15%] text-accent/10">
          <MessageCircle size={42} />
        </div>
        <div className="animate-float absolute bottom-[20%] right-[10%] text-accent/15">
          <Sparkles size={32} />
        </div>
        <div className="animate-pulse-glow absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="animate-pulse-glow absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent/20 border border-accent/30 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-gold">
            <Sparkles size={24} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">ברוך הבא</h1>
          <p className="text-text-secondary mt-1">התחבר לחשבון שלך</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-modal">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute top-[38px] right-3 text-text-disabled z-10" />
              <Input
                label="אימייל"
                type="email"
                required
                autoComplete="email"
                onFocus={() => setShowEmailSuggestions(true)}
                onBlur={() => setShowEmailSuggestions(false)}
                {...register('email')}
                error={errors.email?.message}
                className="pr-9"
              />
              {shouldShowEmailSuggestions && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-b-lg border border-border bg-surface shadow-modal">
                  {suggestedEmails.map((email) => (
                    <button
                      key={email}
                      type="button"
                      className="block w-full border-b border-border px-3 py-2 text-right text-sm text-text-primary transition-colors hover:bg-accent/10 last:border-b-0"
                      onMouseDown={(event) => {
                        event.preventDefault()
                        setValue('email', email, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
                        setShowEmailSuggestions(false)
                      }}
                    >
                      {email}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute top-[38px] right-3 text-text-disabled z-10" />
              <Input label="סיסמה" type="password" required {...register('password')} error={errors.password?.message} className="pr-9" />
            </div>
            {error && <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" className="w-full" loading={isSubmitting} size="lg">
              <LogIn size={18} />
              התחבר
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Link href="/reset-password" className="text-sm text-accent hover:underline block">שכחת סיסמה?</Link>
            <p className="text-sm text-text-secondary">
              אין לך חשבון?{' '}
              <Link href="/signup" className="text-accent hover:underline">הרשם</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
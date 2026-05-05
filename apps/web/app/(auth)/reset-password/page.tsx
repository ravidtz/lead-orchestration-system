'use client'
import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email)
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">איפוס סיסמה</h1>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6">
          {sent ? (
            <div className="text-center">
              <p className="text-success mb-4">נשלח קישור לאימייל שלך</p>
              <Link href="/signin" className="text-accent hover:underline text-sm">חזור להתחברות</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input label="אימייל" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
              <Button type="submit" className="w-full" loading={loading} size="lg">שלח קישור</Button>
              <p className="text-center text-sm">
                <Link href="/signin" className="text-accent hover:underline">חזור</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

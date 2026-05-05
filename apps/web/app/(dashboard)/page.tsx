import { PageShell, PageHeader } from '@/components/layout/page-shell'
import { Card } from '@/components/ui'
import { TrendingUp, Users, MessageCircle, BarChart3, Plus, UserPlus, Phone, Zap } from 'lucide-react'

const kpis = [
  { label: 'לידים חדשים',    value: '—', icon: TrendingUp,    color: 'text-accent' },
  { label: 'לקוחות פעילים', value: '—', icon: Users,          color: 'text-success' },
  { label: 'שיחות פתוחות',  value: '—', icon: MessageCircle, color: 'text-warning' },
  { label: 'שיעור המרה',    value: '—', icon: BarChart3,      color: 'text-danger' },
]

const quickActions = [
  { label: 'ליד חדש',    icon: UserPlus,       href: '/leads' },
  { label: 'שיחת צ\'את', icon: MessageCircle,  href: '/conversations/chat' },
  { label: 'שיחת קול',  icon: Phone,           href: '/conversations/voice' },
  { label: 'אוטומציה',  icon: Zap,             href: '/admin/integrations' },
]

export default function DashboardPage() {
  return (
    <PageShell className="relative overflow-hidden">
      {/* Ambient floating icons */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden -z-0">
        <div className="animate-float absolute top-[8%] left-[4%] text-accent/8">
          <BarChart3 size={80} />
        </div>
        <div className="animate-float-delay absolute top-[35%] left-[1%] text-accent/6">
          <Users size={64} />
        </div>
        <div className="animate-float-slow absolute bottom-[18%] right-[2%] text-accent/8">
          <TrendingUp size={72} />
        </div>
        <div className="animate-float absolute bottom-[40%] left-[7%] text-accent/5">
          <Zap size={52} />
        </div>
        <div className="animate-pulse-glow absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        <PageHeader
          title="לוח בקרה"
          subtitle="סקירה כללית של הפעילות שלך"
          action={
            <a href="/leads" className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-gold">
              <Plus size={16} />
              ליד חדש
            </a>
          }
        />

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="p-6 group hover:border-accent/40 transition-all hover:shadow-gold">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-text-secondary">{label}</p>
                <span className={`${color} opacity-50 group-hover:opacity-100 transition-opacity`}>
                  <Icon size={20} />
                </span>
              </div>
              <p className="text-3xl font-bold text-text-primary">{value}</p>
            </Card>
          ))}
        </div>

        {/* Activity + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="פעילות אחרונה">
              <div className="flex flex-col items-center justify-center py-10 text-text-disabled">
                <BarChart3 size={44} className="mb-3 opacity-25" />
                <p className="text-sm">עוד לא קיימת פעילות</p>
              </div>
            </Card>
          </div>
          <Card title="פעולות מהירות">
            <div className="space-y-1">
              {quickActions.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/10 hover:text-accent text-text-secondary transition-all text-sm group"
                >
                  <Icon size={16} className="group-hover:scale-110 transition-transform flex-shrink-0" />
                  {label}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
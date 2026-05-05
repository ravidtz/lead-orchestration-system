export const LEAD_STATUSES = [
  { value: 'new', label: 'חדש', color: 'blue' },
  { value: 'contacted', label: 'נוצר קשר', color: 'purple' },
  { value: 'qualified', label: 'מוסמך', color: 'yellow' },
  { value: 'proposal', label: 'הצעה', color: 'orange' },
  { value: 'won', label: 'נסגר', color: 'green' },
  { value: 'lost', label: 'אבוד', color: 'red' },
] as const

export const LEAD_PRIORITIES = [
  { value: 'low', label: 'נמוכה', color: 'gray' },
  { value: 'medium', label: 'בינונית', color: 'yellow' },
  { value: 'high', label: 'גבוהה', color: 'red' },
] as const

export const CUSTOMER_STATUSES = [
  { value: 'active', label: 'פעיל', color: 'green' },
  { value: 'churned', label: 'עזב', color: 'red' },
  { value: 'paused', label: 'מושהה', color: 'yellow' },
] as const

export const CUSTOMER_TIERS = [
  { value: 'standard', label: 'רגיל' },
  { value: 'vip', label: 'VIP' },
  { value: 'enterprise', label: 'ארגוני' },
] as const

export const USER_ROLES = [
  { value: 'admin', label: 'מנהל' },
  { value: 'agent', label: 'סוכן' },
  { value: 'viewer', label: 'צופה' },
] as const

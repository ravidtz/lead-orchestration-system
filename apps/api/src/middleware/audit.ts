import { db } from '../lib/db'
import { auditLogs } from '@crm/db'
import type { NewAuditLog } from '@crm/db'

export async function writeAudit(entry: Omit<NewAuditLog, 'id' | 'createdAt'>) {
  await db.insert(auditLogs).values(entry).execute()
}

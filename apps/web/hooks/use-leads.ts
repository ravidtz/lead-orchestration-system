import useSWR from 'swr'
import { api } from '@/lib/api-client'
import type { PaginatedResponse, LeadDTO } from '@crm/types'

export function useLeads(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return useSWR(
    `/leads?${query}`,
    (url: string) => api.get<PaginatedResponse<LeadDTO>>(url),
  )
}

export function useLead(id: string) {
  return useSWR(
    `/leads/${id}`,
    (url: string) => api.get<{ data: LeadDTO }>(url),
  )
}

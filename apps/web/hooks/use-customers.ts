import useSWR from 'swr'
import { api } from '@/lib/api-client'
import type { PaginatedResponse, CustomerDTO } from '@crm/types'

export function useCustomers(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  return useSWR(
    `/customers?${query}`,
    (url: string) => api.get<PaginatedResponse<CustomerDTO>>(url),
  )
}

export function useCustomer(id: string) {
  return useSWR(
    `/customers/${id}`,
    (url: string) => api.get<{ data: CustomerDTO }>(url),
  )
}

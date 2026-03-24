export type Company = {
  id: number
  name: string
  businessId?: number | null
  email: string
  industry?: string | null
}

export type Customer = {
  id: number
  name: string
  email?: string | null
  description?: string | null
  companyId: number
}


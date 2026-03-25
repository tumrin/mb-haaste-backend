import { sql } from 'drizzle-orm'

import { db } from '../db/index.ts'
import type { Customer } from '../db/schema.ts'

export async function findAllCustomers(companyId: number) {
  const customers = await db.execute<Customer>(sql`SELECT * FROM customer WHERE company_id = ${companyId}`)
  return customers.values().toArray()
}

export async function findCustomerById(id: number, companyId: number) {
const customers = await db.execute<Customer>(sql`SELECT * FROM customer WHERE id = ${id} AND company_id = ${companyId}`)
return customers.values().toArray().at(0)
}

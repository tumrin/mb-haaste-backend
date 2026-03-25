import { and, eq, sql } from 'drizzle-orm'

import { db } from '../db/index.ts'
import { type Customer, type CustomerInsert, type CustomerUpdate, customers_table } from '../db/schema.ts'

export async function findAllCustomers(companyId: number) {
  const customers = await db.execute<Customer>(sql`SELECT * FROM customer WHERE company_id = ${companyId}`)
  return customers.values().toArray()
}

export async function findCustomerById(id: number, companyId: number) {
  const customers = await db.execute<Customer>(sql`SELECT * FROM customer WHERE id = ${id} AND company_id = ${companyId}`)
  return customers.values().toArray().at(0)
}

export async function updateCustomerById(customer: CustomerUpdate, companyId: number): Promise<Customer | undefined> {
  return (await db.update(customers_table).set(customer).where(and(eq(customers_table.company_id, companyId), eq(customers_table.id, customer.id))).returning()).at(0)
}

export async function createCustomer(customer: CustomerInsert, companyId: number): Promise<Customer | undefined> {
  return (await db.insert(customers_table).values({ ...customer, company_id: companyId }).returning()).at(0)
}

export async function deleteCustomerById(id: number, companyId: number) {
  return (await db.delete(customers_table).where(and(eq(customers_table.company_id, companyId), eq(customers_table.id, id))).returning()).at(0)
}

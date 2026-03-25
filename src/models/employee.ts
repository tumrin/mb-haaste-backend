import { and, eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { employees_table, type Employee, type EmployeeInsert, type EmployeeUpdate } from '../db/schema.ts'

export async function findAllEmployees(companyId: number) {
  return await db.select().from(employees_table).where(eq(employees_table.company_id, companyId))
}

export async function updateEmployeeById(employee: EmployeeUpdate, companyId: number): Promise<Employee | undefined> {
  return (await db.update(employees_table).set(employee).where(and(eq(employees_table.company_id, companyId), eq(employees_table.id, employee.id))).returning()).at(0)
}

export async function createEmployee(employee: EmployeeInsert, companyId: number): Promise<Employee | undefined> {
  return (await db.insert(employees_table).values({ ...employee, company_id: companyId }).returning()).at(0)
}

export async function deleteEmployeeById(id: number, companyId: number) {
  return (await db.delete(employees_table).where(and(eq(employees_table.company_id, companyId), eq(employees_table.id, id))).returning()).at(0)
}

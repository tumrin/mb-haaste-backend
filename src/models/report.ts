import { and, countDistinct, desc, eq, gt, sql } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { customers_table, employees_table, state_table, task_table, task_to_employee_table } from '../db/schema.ts'

export async function generateReport(companyId: number) {
  const openTasks = db
    .select()
    .from(task_table)
    .innerJoin(state_table, eq(state_table.id, task_table.state))
    .innerJoin(task_to_employee_table, eq(task_to_employee_table.task_id, task_table.id))
    .innerJoin(employees_table, eq(employees_table.id, task_to_employee_table.employee_id))
    .where(and(eq(task_table.company_id, companyId), eq(state_table.name, 'Open'), eq(employees_table.active, true), gt(task_table.created_at, sql`now() - interval '30 days'`)))
    .as('open_tasks')

  return await db
    .select({
      customer: customers_table.name,
      count: countDistinct(openTasks.task_to_employee.task_id),
    })
    .from(customers_table)
    .leftJoin(openTasks, eq(openTasks.task.assigned, customers_table.id))
    .where(eq(customers_table.company_id, companyId))
    .groupBy(customers_table.id)
    .orderBy(desc(countDistinct(openTasks.task_to_employee.task_id)))
}

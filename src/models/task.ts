import { and, eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { type Task, type TaskInsert, type TaskToEmployee, customers_table, employees_table, state_table, task_table, task_to_employee_table } from '../db/schema.ts'
import { AlreadyExists, NotFound } from '../errorHandler.ts'

export async function findAllTasks(companyId: number) {
  return await db.select().from(task_table).where(eq(task_table.company_id, companyId))
}

export async function findEmployeeTasks(id: number, companyId: number) {
  return await db.select().from(task_table)
    .innerJoin(task_to_employee_table, eq(task_to_employee_table.task_id, task_table.id))
    .innerJoin(employees_table, eq(employees_table.id, task_to_employee_table.employee_id))
    .where(and(eq(employees_table.company_id, companyId), eq(task_to_employee_table.employee_id, id)))
}

export async function createTask(task: TaskInsert, companyId: number): Promise<Task | undefined> {
  const state_exists = (await db.select().from(state_table).where(and(eq(state_table.company_id, companyId), eq(state_table.id, task.state)))).at(0)
  if (!state_exists) {
    throw new NotFound('State does not exist in this company')
  }

  if (task.assigned) {
    const assigned = (await db.select().from(customers_table).where(and(eq(customers_table.company_id, companyId), eq(customers_table.id, task.assigned)))).at(0)
    if (!assigned) {
      throw new NotFound("Assigned customer not found")
    }
  }

  return (await db.insert(task_table).values({ ...task, company_id: companyId }).returning()).at(0)
}

export async function createEmployeeTask(employeeId: number, task: TaskInsert, companyId: number): Promise<Task | undefined> {
  const employee = (await db.select().from(employees_table).where(and(eq(employees_table.active, true), eq(employees_table.id, employeeId), eq(employees_table.company_id, companyId)))).at(0)
  if (!employee) {
    throw new NotFound('Employee not found')
  }

  let created = await createTask(task, companyId)
  if (!created) {
    throw Error('Failed to create task')
  }

  await assignEmployeeTask(created.id, employeeId, companyId)

  return created
}

export async function assignEmployeeTask(taskId: number, employeeId: number, companyId: number): Promise<TaskToEmployee | undefined> {
  const task = (await db.select().from(task_table).where(and(eq(task_table.id, taskId), eq(task_table.company_id, companyId)))).at(0)
  if (!task) {
    throw new NotFound("Task not found")
  }

  const employee = (await db.select().from(employees_table).where(and(eq(employees_table.id, employeeId), eq(employees_table.company_id, companyId), eq(employees_table.active, true)))).at(0)
  if (!employee) {
    throw new NotFound("Employee not found")
  }

  const assignedTask = (await db.select().from(task_to_employee_table).where(and(eq(task_to_employee_table.employee_id, employeeId), eq(task_to_employee_table.task_id, taskId)))).at(0)
  if (assignedTask) {
    throw new AlreadyExists("Task has already been assigned to this employee")
  }

  return (await db.insert(task_to_employee_table).values({ task_id: taskId, employee_id: employeeId }).returning()).at(0)
}

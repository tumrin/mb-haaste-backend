import { boolean, integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import z from 'zod'

export const company_table = pgTable('company', {
  id: serial().primaryKey(),
  name: text().notNull(),
  businessId: integer(),
  email: text().notNull(),
  industry: text(),
})

export type Company = typeof company_table.$inferSelect

export const customers_table = pgTable('customer', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text(),
  description: text(),
  company_id: integer().notNull().references(() => company_table.id, { onDelete: 'cascade' }),
})

export const CustomerUpdateSchema = createUpdateSchema(customers_table, { id: z.number() })
export const CustomerInsertSchema = createInsertSchema(customers_table).omit({ id: true, company_id: true })
export type Customer = typeof customers_table.$inferSelect
export type CustomerInsert = z.input<typeof CustomerInsertSchema>
export type CustomerUpdate = z.input<typeof CustomerUpdateSchema>

export const employees_table = pgTable('employee', {
  id: serial().primaryKey(),
  email: text(),
  description: text(),
  active: boolean().default(true).notNull(),
  company_id: integer()
    .notNull()
    .references(() => company_table.id, { onDelete: 'cascade' }),
})

export const EmployeeUpdateSchema = createUpdateSchema(employees_table, { id: z.number(), email: z.email().nullable().optional() })
export const EmployeeInsertSchema = createInsertSchema(employees_table, { email: z.email().optional().nullable() }).omit({ id: true, company_id: true })
export type Employee = typeof employees_table.$inferSelect
export type EmployeeInsert = z.input<typeof EmployeeInsertSchema>
export type EmployeeUpdate = z.input<typeof EmployeeUpdateSchema>

export const task_table = pgTable('task', {
  id: serial().primaryKey(),
  created_at: timestamp().notNull().defaultNow(),
  state: integer().notNull().references(() => state_table.id),
  company_id: integer().notNull().references(() => company_table.id, { onDelete: 'cascade' }),
  assigned: integer()
    .references(() => customers_table.id, { onDelete: 'set null' }),
})

export const TaskUpdateSchema = createUpdateSchema(task_table).required('id')
export const TaskInsertSchema = createInsertSchema(task_table).omit({ id: true, created_at: true, company_id: true })
export type Task = typeof task_table.$inferSelect
export type TaskInsert = z.infer<typeof TaskInsertSchema>

export const task_to_employee_table = pgTable('task_to_employee', {
  task_id: integer()
    .notNull()
    .references(() => task_table.id, { onDelete: 'cascade' }),
  employee_id: integer()
    .notNull()
    .references(() => employees_table.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.task_id, table.employee_id] })
])

export type TaskToEmployee = typeof task_to_employee_table.$inferSelect

export const state_table = pgTable('state', {
  id: serial().primaryKey(),
  name: text().notNull(),
  company_id: integer()
    .notNull()
    .references(() => company_table.id, { onDelete: 'cascade' }),
})

export const StateUpdateSchema = createUpdateSchema(state_table).required('id')
export const StateInsertSchema = createInsertSchema(state_table).omit({ id: true, company_id: true })
export type State = typeof state_table.$inferSelect
export type StateInsert = z.infer<typeof StateInsertSchema>

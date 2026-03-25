import { boolean, date, integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import type z from 'zod'

export const company_table = pgTable('company', {
  id: serial().unique(),
  name: text().notNull(),
  businessId: integer(),
  email: text().notNull(),
  industry: text(),
})

export type Company = typeof company_table.$inferSelect

export const customers_table = pgTable('customer', {
  id: serial().unique(),
  name: text().notNull(),
  email: text(),
  description: text(),
  company_id: integer().notNull(),
})

export const CustomerUpdateSchema = createUpdateSchema(customers_table, { id: z.number() })
export const CustomerInsertSchema = createInsertSchema(customers_table).omit({ id: true, company_id: true })
export type Customer = typeof customers_table.$inferSelect
export type CustomerInsert = z.input<typeof CustomerInsertSchema>
export type CustomerUpdate = z.input<typeof CustomerUpdateSchema>

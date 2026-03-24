import { sql } from 'drizzle-orm'

import { db } from '../db/index.ts'
import type { Company } from '../db/schema.ts'

export async function findAllCompanies(companyId: number) {
  const companies = await db.execute<Company>(sql`
  SELECT
    *
  FROM
    company
  WHERE
    id = ${companyId}
`)
  return companies.values().toArray()
}

export async function findCompanyById(id: number) {
  const companies = await db.execute<Company>(sql`
  SELECT
    *
  FROM
    company
  WHERE
    id = ${id}
`)
  return companies.values().toArray().at(0)
}

import { eq } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { state_table, type State, type StateInsert } from '../db/schema.ts'

export async function findAllStates(companyId: number) {
  return await db.select().from(state_table).where(eq(state_table.company_id, companyId))
}

export async function createState(state: StateInsert, companyId: number): Promise<State | undefined> {
  return (await db.insert(state_table).values({ ...state, company_id: companyId }).returning()).at(0)
}

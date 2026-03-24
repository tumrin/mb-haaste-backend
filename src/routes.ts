import { Router } from 'express'

import { findAllCompanies, findCompanyById } from './models/company.ts'
import { findAllCustomers, findCustomerById } from './models/customer.ts'
import { getCompanyId, setCompanyId } from './session.ts'
import { requireSession } from './session.ts'
import { NotImplemented } from './errorHandler.ts'

const router = Router()

router.get('/ping', (_req, res) => {
  console.log('ping')
  return res.send({ message: 'pong' })
})

// ---------SESSION SETUP---------
// Quick and dirty session management..
router.use((_req, res, next) => {
  const id = getCompanyId()
  if(id !== null) res.locals.companyId = id;
  next()
})

router.post('/login', (req, res) => {
  const companyId = Number(req.body.companyId)
  if(!companyId) return res.status(400).json({ message: 'companyId is required' })
  setCompanyId(companyId)
  res.locals.companyId = companyId
  return res.json({ message: 'Logged in', companyId })
})
// -------------------------------

// --------APPLICATION ROUTES-----------
router.get('/companies', requireSession, async (_req, res) => {
  const companies = await findAllCompanies(res.locals.companyId)
  return res.json(companies)
})

router.get('/companies/:id', requireSession, async (req, res) => {
  const row = await findCompanyById(res.locals.companyId)
  if(!row) return res.status(404).json({ message: 'Company not found' })
  return res.json(row)
})

router.get('/customers', requireSession, async (_req, res) => {
  const customers = await findAllCustomers(res.locals.companyId)
  return res.json(customers)
})

router.get('/customers/:id', requireSession, async (req, res) => {
  const id = Number(req.params.id)
  const row = await findCustomerById(id, res.locals.companyId)
  if(!row) return res.status(404).json({ message: 'Customer not found' })
  return res.json(row)
})


/**
/* MB-TODO: Implement `customer` create/update/delete endpoints.
/*  - How would you validate incoming response?
/*  - How would you decorate response data?
/* Example of "create" request:
 */
router.put('/customers', requireSession, async (_req, res) => {
  throw new NotImplemented()
})

/**
 * MB-TODO:
 * 1. Create a new migration file `npm run db:generate -- "employee-tasks"`
 * 2. Read the requirements and write SQL queries to create tables and relations:
 *    - Company can have many Employees
 *    - Employee can be only in one Company
 *    - Employees can be disabled
 *    - Employees can have many Tasks
 *    - Tasks can have many Employees
 *    - Tasks have State and time of creation
 *    - Task can be assigned to a single Customer
 *    - Customers can have many Tasks
 *    - Tasks have Company-specific States but at least following states: "Open", "Done", "In Progress"
 * 3. Implement at least these endpoints in `src/routes.ts`:
 *    - Employees: list, create, update, delete
 *    - States: list, create
 *    - Tasks: list, create
 *    - Employee's tasks: list, create
 * 4. Your boss needs following report immediatelly! Implement the following report endpoint:
 *    - "Important Report": list customers and count of their "Open" tasks which have been created within last 30 days and task's employee is not disabled. Sort results by count.
 */

export default router


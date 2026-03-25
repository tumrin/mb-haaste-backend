import { Router } from 'express'
import { CustomerInsertSchema, CustomerUpdateSchema, EmployeeInsertSchema, EmployeeUpdateSchema, StateInsertSchema, TaskInsertSchema } from './db/schema.ts'
import { NotFound } from './errorHandler.ts'
import { findAllCompanies, findCompanyById } from './models/company.ts'
import { createCustomer, deleteCustomerById, findAllCustomers, findCustomerById, updateCustomerById } from './models/customer.ts'
import { createEmployee, deleteEmployeeById, findAllEmployees, updateEmployeeById } from './models/employee.ts'
import { createState, findAllStates } from './models/state.ts'
import { assignEmployeeTask, createEmployeeTask, createTask, findAllTasks, findEmployeeTasks } from './models/task.ts'
import { getCompanyId, requireSession, setCompanyId } from './session.ts'

const router = Router()

router.get('/ping', (_req, res) => {
  console.log('ping')
  return res.send({ message: 'pong' })
})

// ---------SESSION SETUP---------
// Quick and dirty session management..
router.use((_req, res, next) => {
  const id = getCompanyId()
  if (id !== null) res.locals.companyId = id
  next()
})

router.post('/login', (req, res) => {
  const companyId = Number(req.body.companyId)
  if (!companyId) return res.status(400).json({ message: 'companyId is required' })
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

router.get('/companies/:id', requireSession, async (_req, res) => {
  const row = await findCompanyById(res.locals.companyId)
  if (!row) return res.status(404).json({ message: 'Company not found' })
  return res.json(row)
})

router.get('/customers', requireSession, async (_req, res) => {
  const customers = await findAllCustomers(res.locals.companyId)
  return res.json(customers)
})

router.get('/customers/:id', requireSession, async (req, res) => {
  const id = Number(req.params.id)
  const row = await findCustomerById(id, res.locals.companyId)
  if (!row) return res.status(404).json({ message: 'Customer not found' })
  return res.json(row)
})

/**
/* MB-TODO: Implement `customer` create/update/delete endpoints.
/*  - How would you validate incoming response?
/*  - How would you decorate response data?
/* Example of "create" request:
 */
router.post('/customers', requireSession, async (req, res) => {
  const customer = CustomerInsertSchema.parse(req.body)
  const row = await createCustomer(customer, res.locals.companyId)
  if (!row) throw Error('Failed to create customer')
  return res.json(row)
})

router.put('/customers', requireSession, async (req, res) => {
  const customer = CustomerUpdateSchema.parse(req.body)
  const row = await updateCustomerById(customer, res.locals.companyId)
  if (!row) throw new NotFound('Customer not found')
  return res.json(row)
})

router.delete('/customers/:id', requireSession, async (req, res) => {
  const id = Number(req.params.id)
  const row = await deleteCustomerById(id, res.locals.companyId)
  if (!row) throw new NotFound('Customer not found')
  return res.json(row)
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

// Employees
router.get('/employees', requireSession, async (_req, res) => {
  const rows = await findAllEmployees(res.locals.companyId)
  return res.json(rows)
})

router.post('/employees', requireSession, async (req, res) => {
  const employee = EmployeeInsertSchema.parse(req.body)
  const row = await createEmployee(employee, res.locals.companyId)
  if (!row) throw Error('Failed to create employee')
  return res.json(row)
})

router.put('/employees', requireSession, async (req, res) => {
  const employee = EmployeeUpdateSchema.parse(req.body)
  const row = await updateEmployeeById(employee, res.locals.companyId)
  if (!row) throw new NotFound('Employee not found')
  return res.json(row)
})

router.delete('/employees/:id', requireSession, async (req, res) => {
  const id = Number(req.params.id)
  const row = await deleteEmployeeById(id, res.locals.companyId)
  if (!row) throw new NotFound('Employee not found')
  return res.json(row)
})

// States
router.get('/states', requireSession, async (_req, res) => {
  const states = await findAllStates(res.locals.companyId)
  return res.json(states)
})

router.post('/states', requireSession, async (req, res) => {
  const state = StateInsertSchema.parse(req.body)
  const row = await createState(state, res.locals.companyId)
  if (!row) throw Error('Failed to create state')
  return res.json(row)
})

// Tasks
router.get('/tasks', requireSession, async (_req, res) => {
  const tasks = await findAllTasks(res.locals.companyId)
  return res.json(tasks)
})

router.post('/tasks', requireSession, async (req, res) => {
  const task = TaskInsertSchema.parse(req.body)
  const row = await createTask(task, res.locals.companyId)
  if (!row) throw Error('Failed to create task')
  return res.json(row)
})

router.get('/tasks/employee/:employeeId', requireSession, async (req, res) => {
  const id = Number(req.params.employeeId)
  const tasks = await findEmployeeTasks(id, res.locals.companyId)
  return res.json(tasks)
})

router.post('/tasks/employee/:employeeId/:taskId', requireSession, async (req, res) => {
  const taskId = Number(req.params.taskId)
  const employeeId = Number(req.params.employeeId)
  const row = await assignEmployeeTask(taskId, employeeId, res.locals.companyId)
  if (!row) throw Error('Failed to assign task')
  return res.json(row)
})

router.post('/tasks/employee/:employeeId', requireSession, async (req, res) => {
  const task = TaskInsertSchema.parse(req.body)
  const employeeId = Number(req.params.employeeId)
  const row = await createEmployeeTask(employeeId, task, res.locals.companyId)
  if (!row) throw Error('Failed to create task')
  return res.json(row)
})

})

export default router

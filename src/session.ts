import type { Request, Response, NextFunction } from 'express'

let companyId: number | null = null

export function getCompanyId() {
  return companyId
}

export function setCompanyId(id: number) {
  companyId = id
}


export function requireSession(req: Request, res: Response, next: NextFunction) {
  if(res.locals.companyId) return next()

  return res.status(401).json({
    message: 'No active session. Please log in first.',
    instructions: `POST ${req.baseUrl}/login with body: { "companyId": <number> }`,
  })
}

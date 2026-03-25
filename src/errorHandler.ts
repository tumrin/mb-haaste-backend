import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import config from './config.ts'

export class NotImplemented extends Error {
  status: number
  constructor(message?: string) {
    super(message || 'Not Implemented')
    this.name = 'NotImplemented'
    this.status = 501
  }
}
export class NotFound extends Error {
  status: number
  constructor(message?: string) {
    super(message || 'Not Found')
    this.name = 'NotFound'
    this.status = 404
  }
}

export class AlreadyExists extends Error {
  status: number
  constructor(message?: string) {
    super(message || 'Conflict')
    this.name = 'Conflict'
    this.status = 409
  }
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400)
    return res.send({ message: JSON.parse(err.message) })
  }
  res.status(err.status || 500)
  if (config.nodeEnv !== 'production' && res.statusCode >= 500) {
    console.error(err)
  }
  return res.send({ ...err.data, message: err.message })
}

export default errorHandler

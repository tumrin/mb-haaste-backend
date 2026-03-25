import config from './config.ts'
import type { ErrorRequestHandler } from 'express';

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

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  res.status(err.status || 500)
  if (config.nodeEnv !== 'production' && res.statusCode >= 500) {
    console.error(err)
  }
  return res.send({ ...err.data, message: err.message })
}

export default errorHandler

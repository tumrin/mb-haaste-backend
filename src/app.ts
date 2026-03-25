import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import errorHandler from './errorHandler.ts'
import router from './routes.ts'

const app = express()

// MB-TODO: What are middlewares in Express?
// Middlewares allow intercepting incoming requests and outgoing responses and running arbitary code based on their contents before passing them to the next handler.
// MB-TODO: What these middlewares do?
app.use(express.json()) // Allows reading request bodies with JSON content type
app.use(express.urlencoded({ extended: true })) // Allows reading request bodies with urlencoded content type
app.use(helmet()) // Sets security related headers to response
app.use(morgan('tiny')) // Logs incoming requests

app.use(router)

app.use(errorHandler) // Handles errors thrown in above middlewares

export default app

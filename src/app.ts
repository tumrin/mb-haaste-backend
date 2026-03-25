import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import errorHandler from './errorHandler.ts'
import router from './routes.ts'

const app = express()

// MB-TODO: What are middlewares in Express?
// MB-TODO: What these middlewares do?
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(morgan('tiny'))

app.use(router)

app.use(errorHandler)

export default app

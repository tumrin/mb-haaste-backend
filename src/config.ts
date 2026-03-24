import 'dotenv/config'

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV as string,
  dbUrl: process.env.DB_URL as string,
} as const

export default config

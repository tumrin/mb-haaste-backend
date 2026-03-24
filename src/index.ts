import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import app from './app.ts'
import config from './config.ts'
import { db } from './db/index.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Initialize database during startup.
await migrate(db, { migrationsFolder: join(__dirname, 'db/migrations') })

app.listen(config.port, () => {
  console.log(`Listening on ${config.port}`)
})

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const defaultDatabasePath = path.resolve(currentDirectory, '../../db.json')
const port = Number(process.env.PORT ?? 4000)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

export const env = {
  port,
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  databasePath: process.env.DATABASE_PATH ?? defaultDatabasePath,
}
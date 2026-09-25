import { randomUUID } from 'node:crypto'
import { readFile, rename, writeFile } from 'node:fs/promises'
import type { Database } from './database.types.js'

export interface DatabaseRepository {
  read(): Promise<Database>
  write(database: Database): Promise<void>
}

export class JsonFileRepository implements DatabaseRepository {
  constructor(private readonly databasePath: string) {}

  async read(): Promise<Database> {
    const raw = await readFile(this.databasePath, 'utf8')
    const database: unknown = JSON.parse(raw)

    if (!isDatabase(database)) {
      throw new Error('Database has an invalid structure')
    }

    return database
  }

  async write(database: Database) {
    const temporaryPath = `${this.databasePath}.${randomUUID()}.tmp`
    await writeFile(temporaryPath, JSON.stringify(database, null, 2), 'utf8')
    await rename(temporaryPath, this.databasePath)
  }
}

function isDatabase(value: unknown): value is Database {
  if (!value || typeof value !== 'object') {
    return false
  }

  const database = value as { products?: unknown; orders?: unknown }
  return Array.isArray(database.products) && Array.isArray(database.orders)
}
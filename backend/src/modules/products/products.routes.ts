import { Router } from 'express'
import type { DatabaseRepository } from '../../infrastructure/database/json-file.repository.js'

export function createProductsRouter(repository: DatabaseRepository) {
  const router = Router()

  router.get('/', async (_req, res) => {
    const database = await repository.read()
    res.json(database.products)
  })

  return router
}
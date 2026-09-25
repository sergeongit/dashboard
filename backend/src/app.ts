import cors from 'cors'
import express, { type Express } from 'express'
import { HttpError } from './shared/http-error.js'
import type { DatabaseRepository } from './infrastructure/database/json-file.repository.js'
import { createOrdersRouter } from './modules/orders/orders.routes.js'
import type { OrdersService } from './modules/orders/orders.service.js'
import { createProductsRouter } from './modules/products/products.routes.js'

interface CreateAppDependencies {
  frontendOrigin: string
  repository: DatabaseRepository
  ordersService: OrdersService
}

export function createApp({ frontendOrigin, repository, ordersService }: CreateAppDependencies): Express {
  const app = express()

  app.use(cors({ origin: frontendOrigin }))
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })
  app.use('/api/products', createProductsRouter(repository))
  app.use('/api/orders', createOrdersRouter(ordersService))

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' })
  })
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message })
      return
    }

    console.error('Unhandled request error', error)
    res.status(500).json({ message: 'Internal server error' })
  })

  return app
}
import { Router } from 'express'
import type { OrdersService } from './orders.service.js'
import { HttpError } from '../../shared/http-error.js'

export function createOrdersRouter(ordersService: OrdersService) {
  const router = Router()

  router.get('/', async (_req, res) => {
    res.json(await ordersService.getAll())
  })

  router.delete('/:id', async (req, res) => {
    const orderId = parseOrderId(req.params.id)
    const deleted = await ordersService.remove(orderId)

    if (!deleted) {
      res.status(404).json({ message: 'Order not found' })
      return
    }

    res.json({ success: true, id: orderId })
  })

  return router
}

function parseOrderId(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) {
    throw new HttpError(400, 'Order id must be a positive integer')
  }

  const orderId = Number(value)
  if (!Number.isSafeInteger(orderId) || orderId < 1) {
    throw new HttpError(400, 'Order id must be a positive integer')
  }

  return orderId
}
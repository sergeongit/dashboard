import type { Server } from 'socket.io'
import type { DatabaseRepository } from '../../infrastructure/database/json-file.repository.js'

export class OrdersService {
  constructor(
    private readonly repository: DatabaseRepository,
    private readonly io: Server,
  ) {}

  async getAll() {
    const database = await this.repository.read()

    return database.orders.map((order) => ({
      ...order,
      products: database.products.filter((product) => product.order === order.id),
    }))
  }

  async remove(orderId: number) {
    const database = await this.repository.read()
    const orderExists = database.orders.some((order) => order.id === orderId)

    if (!orderExists) {
      return false
    }

    database.orders = database.orders.filter((order) => order.id !== orderId)
    database.products = database.products.filter((product) => product.order !== orderId)
    await this.repository.write(database)

    this.io.emit('order_deleted', { id: orderId })

    return true
  }
}
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { JsonFileRepository } from './infrastructure/database/json-file.repository.js'
import { OrdersService } from './modules/orders/orders.service.js'
import { registerSessionsGateway } from './modules/sessions/sessions.gateway.js'

const io = new Server({
  cors: {
    origin: env.frontendOrigin,
    methods: ['GET', 'POST', 'DELETE'],
  },
})

const repository = new JsonFileRepository(env.databasePath)
const ordersService = new OrdersService(repository, io)
const app = createApp({
  frontendOrigin: env.frontendOrigin,
  ordersService,
  repository,
})
const httpServer = createServer(app)

io.attach(httpServer)
registerSessionsGateway(io)

httpServer.listen(env.port, () => {
  console.log(`Dashboard backend running on http://localhost:${env.port}`)
})

httpServer.on('error', (error) => {
  console.error('HTTP server error', error)
  process.exitCode = 1
})

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    console.log(`Received ${signal}, shutting down`)
    io.close()
    httpServer.close((error) => {
      if (error) {
        console.error('Failed to close HTTP server', error)
        process.exitCode = 1
      }
    })
  })
}

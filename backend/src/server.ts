import cors from 'cors'
import express from 'express'
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.resolve(__dirname, '../db.json')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
  },
})

const activeSockets = new Set<string>()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/products', async (_req, res) => {
  const db = await readDatabase()
  res.json(db.products)
})

app.get('/api/orders', async (_req, res) => {
  const db = await readDatabase()
  const orders = db.orders.map((order) => ({
    ...order,
    products: db.products.filter((product) => product.order === order.id),
  }))

  res.json(orders)
})

app.delete('/api/orders/:id', async (req, res) => {
  const db = await readDatabase()
  const orderId = Number(req.params.id)

  const filteredOrders = db.orders.filter((order) => order.id !== orderId)

  if (filteredOrders.length === db.orders.length) {
    return res.status(404).json({ message: 'Order not found' })
  }

  db.orders = filteredOrders
  await writeDatabase(db)

  return res.json({ success: true, id: orderId })
})

async function readDatabase() {
  const raw = await readFile(dbPath, 'utf-8')
  return JSON.parse(raw) as {
    products: Array<{ order: number }>
    orders: Array<{ id: number }>
  }
}

async function writeDatabase(data: {
  products: Array<{ order: number }>
  orders: Array<{ id: number }>
}) {
  await writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8')
}

io.on('connection', (socket) => {
  activeSockets.add(socket.id)
  io.emit('session_count', activeSockets.size)

  socket.on('disconnect', () => {
    activeSockets.delete(socket.id)
    io.emit('session_count', activeSockets.size)
  })
})

const PORT = 4000
httpServer.listen(PORT, () => {
  console.log(`Dashboard backend running on http://localhost:${PORT}`)
})

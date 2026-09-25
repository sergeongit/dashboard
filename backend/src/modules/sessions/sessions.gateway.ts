import type { Server } from 'socket.io'

export function registerSessionsGateway(io: Server) {
  const activeSockets = new Set<string>()

  io.on('connection', (socket) => {
    activeSockets.add(socket.id)
    io.emit('session_count', activeSockets.size)

    socket.on('disconnect', () => {
      activeSockets.delete(socket.id)
      io.emit('session_count', activeSockets.size)
    })
  })
}
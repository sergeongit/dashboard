import type { Server } from 'socket.io'

export function registerSessionsGateway(io: Server) {
  const activeSessions = new Map<string, string>()

  io.on('connection', (socket) => {
    const requestedSessionId = socket.handshake.auth.sessionId
    const sessionId =
      typeof requestedSessionId === 'string' && requestedSessionId.length > 0
        ? requestedSessionId
        : socket.id

    activeSessions.set(sessionId, socket.id)
    io.emit('session_count', activeSessions.size)

    socket.on('disconnect', () => {
      if (activeSessions.get(sessionId) === socket.id) {
        activeSessions.delete(sessionId)
        io.emit('session_count', activeSessions.size)
      }
    })
  })
}
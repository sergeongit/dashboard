import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Server, Socket } from 'socket.io'
import { registerSessionsGateway } from './sessions.gateway.js'

function createSocket(id: string, sessionId: string) {
  let disconnectHandler: (() => void) | undefined

  return {
    id,
    handshake: { auth: { sessionId } },
    on(event: string, handler: () => void) {
      if (event === 'disconnect') {
        disconnectHandler = handler
      }
    },
    disconnect() {
      disconnectHandler?.()
    },
  }
}

test('replacing a connection for the same browser tab keeps one active session', () => {
  let onConnection: ((socket: Socket) => void) | undefined
  const sessionCounts: number[] = []
  const io = {
    on(_event: string, handler: (socket: Socket) => void) {
      onConnection = handler
    },
    emit(_event: string, count: number) {
      sessionCounts.push(count)
    },
  } as unknown as Server

  registerSessionsGateway(io)

  const previousSocket = createSocket('previous', 'tab-1')
  const currentSocket = createSocket('current', 'tab-1')
  onConnection?.(previousSocket as unknown as Socket)
  onConnection?.(currentSocket as unknown as Socket)
  previousSocket.disconnect()
  currentSocket.disconnect()

  assert.deepEqual(sessionCounts, [1, 1, 0])
})
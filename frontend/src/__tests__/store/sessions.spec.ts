import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import type { RootState } from '@/app/store/types'

const createSocketMock = () => ({
  on: vi.fn(),
  disconnect: vi.fn(),
})

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => createSocketMock()),
}))

const createTestStore = async () => {
  vi.resetModules()

  const { default: sessionsModule } = await import('@/app/store/modules/sessions')

  return createStore<RootState>({
    modules: {
      sessions: sessionsModule,
    },
  })
}

const getSocketMock = async () => {
  const { io } = await import('socket.io-client')
  const results = vi.mocked(io).mock.results
  const socket = results[results.length - 1]?.value as
    | {
        on: ReturnType<typeof vi.fn>
        disconnect: ReturnType<typeof vi.fn>
      }
    | undefined

  if (!socket) {
    throw new Error('Socket was not created')
  }

  return socket
}

describe('sessions store module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('connect listens for socket events and updates active count', async () => {
    const store = await createTestStore()
    const { io } = await import('socket.io-client')

    store.dispatch('sessions/connect')

    const socket = await getSocketMock()
    expect(io).toHaveBeenCalledTimes(1)
    expect(socket.on).toHaveBeenCalledWith('session_count', expect.any(Function))

    const call = socket.on.mock.calls[0]
    expect(call).toBeDefined()

    const handler = call?.[1]
    expect(handler).toBeTypeOf('function')
    handler?.(12)

    expect(store.state.sessions.activeCount).toBe(12)
  })

  it('disconnect closes socket connection', async () => {
    const store = await createTestStore()

    store.dispatch('sessions/connect')

    const socket = await getSocketMock()
    store.dispatch('sessions/disconnect')

    expect(socket.disconnect).toHaveBeenCalledTimes(1)
  })
})

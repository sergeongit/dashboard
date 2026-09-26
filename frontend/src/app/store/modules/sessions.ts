import { io, type Socket } from 'socket.io-client'
import type { ActionContext, Module } from 'vuex'
import type { RootState, SessionsState } from '@/app/store/types'
import { SOCKET_URL } from '@/shared/config'

type SessionsContext = ActionContext<SessionsState, RootState>

let socketClient: Socket | undefined
const SESSION_ID_KEY = 'dashboard.sessionId'

function getSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY)

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_ID_KEY, sessionId)
  }

  return sessionId
}

const sessionsModule: Module<SessionsState, RootState> = {
  namespaced: true,
  state: (): SessionsState => ({
    activeCount: 0,
  }),
  mutations: {
    setActiveCount(state, count: number) {
      state.activeCount = count
    },
  },
  actions: {
    connect({ commit }: SessionsContext) {
      if (socketClient) {
        return
      }

      socketClient = io(SOCKET_URL, {
        transports: ['websocket'],
        auth: { sessionId: getSessionId() },
      })
      socketClient.on('session_count', (count: number) => {
        commit('setActiveCount', count)
      })
    },
    disconnect() {
      socketClient?.disconnect()
      socketClient = undefined
    },
  },
}

export default sessionsModule

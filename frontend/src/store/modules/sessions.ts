import { io, type Socket } from 'socket.io-client'
import type { ActionContext, Module } from 'vuex'
import type { RootState, SessionsState } from '../types'
import { SOCKET_URL } from '../../shared/config'

type SessionsContext = ActionContext<SessionsState, RootState>

let socketClient: Socket | undefined

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

      socketClient = io(SOCKET_URL, { transports: ['websocket'] })
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

import type { ActionContext, Module } from 'vuex'
import type { Order } from '@/entities/order/model/types'
import type { RootState, OrdersState } from '@/app/store/types'
import { API_URL } from '@/shared/config'

type OrdersContext = ActionContext<OrdersState, RootState>

const ordersModule: Module<OrdersState, RootState> = {
  namespaced: true,
  state: (): OrdersState => ({
    items: [],
    loading: false,
    error: null,
  }),
  mutations: {
    setItems(state, orders: Order[]) {
      state.items = orders
    },
    setLoading(state, loading: boolean) {
      state.loading = loading
    },
    setError(state, error: string | null) {
      state.error = error
    },
  },
  actions: {
    async fetch({ commit }: OrdersContext) {
      commit('setLoading', true)
      commit('setError', null)

      try {
        const response = await fetch(`${API_URL}/api/orders`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        commit('setItems', await response.json() as Order[])
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch orders'
        commit('setError', message)
        console.error('Failed to fetch orders', error)
      } finally {
        commit('setLoading', false)
      }
    },
    async remove({ commit, state }: OrdersContext, orderId: number) {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      commit('setItems', state.items.filter((order) => order.id !== orderId))
    },
  },
}

export default ordersModule

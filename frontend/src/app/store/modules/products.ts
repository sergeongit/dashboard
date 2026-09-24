import type { ActionContext, Module } from 'vuex'
import type { Product } from '@/entities/product/model/types'
import type { RootState, ProductsState } from '@/app/store/types'
import { API_URL } from '@/shared/config'

type ProductsContext = ActionContext<ProductsState, RootState>

const productsModule: Module<ProductsState, RootState> = {
  namespaced: true,
  state: (): ProductsState => ({
    items: [],
    loading: false,
    error: null,
  }),
  mutations: {
    setItems(state, products: Product[]) {
      state.items = products
    },
    setLoading(state, loading: boolean) {
      state.loading = loading
    },
    setError(state, error: string | null) {
      state.error = error
    },
  },
  actions: {
    async fetch({ commit }: ProductsContext) {
      commit('setLoading', true)
      commit('setError', null)

      try {
        const response = await fetch(`${API_URL}/api/products`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        commit('setItems', await response.json() as Product[])
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch products'
        commit('setError', message)
        console.error('Failed to fetch products', error)
      } finally {
        commit('setLoading', false)
      }
    },
  },
}

export default productsModule

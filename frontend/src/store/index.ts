import { createStore } from 'vuex'
import orders from './modules/orders'
import products from './modules/products'
import sessions from './modules/sessions'
import type { RootState } from './types'

export type { RootState } from './types'

export const store = createStore<RootState>({
  modules: {
    orders,
    products,
    sessions,
  },
})

export default store

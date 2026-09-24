import { createStore } from 'vuex'
import orders from '@/app/store/modules/orders'
import products from '@/app/store/modules/products'
import sessions from '@/app/store/modules/sessions'
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

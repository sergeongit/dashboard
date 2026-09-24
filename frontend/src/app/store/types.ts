import type { Order } from '@/entities/order/model/types'
import type { Product } from '@/entities/product/model/types'

export interface OrdersState {
  items: Order[]
  loading: boolean
  error: string | null
}

export interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
}

export interface SessionsState {
  activeCount: number
}

export interface RootState {
  orders: OrdersState
  products: ProductsState
  sessions: SessionsState
}

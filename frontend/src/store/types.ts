import type { Order } from '../types/orders'
import type { Product } from '../types/products'

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

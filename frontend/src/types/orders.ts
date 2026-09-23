import type { Product } from './products'

export interface Order {
  id: number
  title: string
  date: string
  description: string
  products: Product[]
}

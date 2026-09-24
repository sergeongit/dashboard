import type { Product } from '@/entities/product/model/types'

export interface Order {
  id: number
  title: string
  date: string
  description: string
  products: Product[]
}

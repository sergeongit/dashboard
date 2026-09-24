import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import type { RootState } from '@/app/store/types'

const mockFetch = vi.fn()

const createResponse = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: vi.fn().mockResolvedValue(body),
})

const createTestStore = async () => {
  vi.resetModules()

  const { default: ordersModule } = await import('@/app/store/modules/orders')

  return createStore<RootState>({
    modules: {
      orders: ordersModule,
    },
  })
}

describe('orders store module', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('fetch loads items and clears errors', async () => {
    const store = await createTestStore()
    const orders = [
      {
        id: 1,
        title: 'Order 1',
        date: '2024-01-01',
        description: 'First order',
        products: [],
      },
    ]

    mockFetch.mockResolvedValueOnce(createResponse(orders))

    await store.dispatch('orders/fetch')

    expect(store.state.orders.loading).toBe(false)
    expect(store.state.orders.error).toBeNull()
    expect(store.state.orders.items).toEqual(orders)
  })

  it('fetch sets error when request fails', async () => {
    const store = await createTestStore()

    mockFetch.mockResolvedValueOnce(createResponse({}, false, 500))

    await store.dispatch('orders/fetch')

    expect(store.state.orders.loading).toBe(false)
    expect(store.state.orders.error).toContain('500')
  })

  it('remove deletes the selected order from the store', async () => {
    const store = await createTestStore()
    const items = [
      { id: 1, title: 'Order 1', date: '2024-01-01', description: 'First', products: [] },
      { id: 2, title: 'Order 2', date: '2024-01-02', description: 'Second', products: [] },
    ]

    mockFetch.mockResolvedValueOnce(createResponse(undefined, true, 200))
    store.commit('orders/setItems', items)

    await store.dispatch('orders/remove', 2)

    expect(store.state.orders.items).toEqual([items[0]])
  })
})

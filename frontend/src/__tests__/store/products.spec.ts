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

  const { default: productsModule } = await import('@/app/store/modules/products')

  return createStore<RootState>({
    modules: {
      products: productsModule,
    },
  })
}

describe('products store module', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('fetch loads products into the store', async () => {
    const store = await createTestStore()
    const products = [
      {
        id: 1,
        serialNumber: 101,
        isNew: 1,
        photo: 'image.png',
        title: 'Product 1',
        type: 'phone',
        specification: 'spec',
        guarantee: {
          start: '2024-01-01',
          end: '2025-01-01',
        },
        price: [{ value: 100, symbol: '$', isDefault: 1 }],
        order: 1,
        date: '2024-01-01',
      },
    ]

    mockFetch.mockResolvedValueOnce(createResponse(products))

    await store.dispatch('products/fetch')

    expect(store.state.products.loading).toBe(false)
    expect(store.state.products.error).toBeNull()
    expect(store.state.products.items).toEqual(products)
  })

  it('fetch sets error when request fails', async () => {
    const store = await createTestStore()

    mockFetch.mockResolvedValueOnce(createResponse({}, false, 404))

    await store.dispatch('products/fetch')

    expect(store.state.products.loading).toBe(false)
    expect(store.state.products.error).toContain('404')
  })
})

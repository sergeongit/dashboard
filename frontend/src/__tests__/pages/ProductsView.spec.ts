import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ProductsView from '@/pages/products/ProductsView.vue'

const mockDispatch = vi.fn()

const products = [
  {
    id: 1,
    serialNumber: 101,
    isNew: 1,
    photo: 'product-1.png',
    title: 'Phone X',
    type: 'phone',
    specification: 'Compact phone',
    guarantee: {
      start: '2024-01-01T00:00:00.000Z',
      end: '2025-01-01T00:00:00.000Z',
    },
    price: [{ value: 799, symbol: 'USD', isDefault: 1 }],
    order: 1,
    date: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    serialNumber: 202,
    isNew: 0,
    photo: 'product-2.png',
    title: 'Tablet Pro',
    type: 'tablet',
    specification: 'Large tablet',
    guarantee: {
      start: '2024-02-01T00:00:00.000Z',
      end: '2025-02-01T00:00:00.000Z',
    },
    price: [{ value: 999, symbol: 'USD', isDefault: 1 }],
    order: 2,
    date: '2024-02-01T00:00:00.000Z',
  },
]

describe('ProductsView', () => {
  beforeEach(() => {
    mockDispatch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (stateOverrides = {}) => {
    const store = createStore({
      state: {
        products: {
          items: products,
          loading: false,
          error: null,
        },
      },
      actions: {
        'products/fetch': mockDispatch,
      },
      ...stateOverrides,
    })

    return mount(ProductsView, {
      global: {
        plugins: [store],
      },
    })
  }

  it('renders product list and filters by selected type', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Products')
    expect(wrapper.text()).toContain('Phone X')
    expect(wrapper.text()).toContain('Tablet Pro')

    const select = wrapper.find('select')
    await select.setValue('phone')

    expect(wrapper.text()).toContain('Phone X')
    expect(wrapper.text()).not.toContain('Tablet Pro')
  })

  it('shows loading state while products are being fetched', () => {
    const wrapper = createWrapper({
      state: {
        products: {
          items: [],
          loading: true,
          error: null,
        },
      },
    })

    expect(wrapper.text()).toContain('Loading products...')
  })

  it('shows empty state when no products match', async () => {
    const wrapper = createWrapper({
      state: {
        products: {
          items: products,
          loading: false,
          error: null,
        },
      },
    })

    const select = wrapper.find('select')
    await select.setValue('camera')

    expect(wrapper.text()).toContain('No products available.')
  })

  it('dispatches fetch on mount', () => {
    createWrapper()

    expect(mockDispatch).toHaveBeenCalledTimes(1)
  })
})

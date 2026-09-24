import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import OrdersView from '@/pages/orders/OrdersView.vue'

const mockDispatch = vi.fn()

const orders = [
  {
    id: 1,
    title: 'Order 1',
    date: '2024-01-01T00:00:00.000Z',
    description: 'First order',
    products: [
      {
        id: 11,
        serialNumber: 101,
        isNew: 1,
        photo: 'p1.png',
        title: 'Phone X',
        type: 'phone',
        specification: 'Phone spec',
        guarantee: {
          start: '2024-01-01T00:00:00.000Z',
          end: '2025-01-01T00:00:00.000Z',
        },
        price: [
          { value: 700, symbol: 'UAH', isDefault: 0 },
          { value: 25, symbol: 'USD', isDefault: 1 },
        ],
        order: 1,
        date: '2024-01-01T00:00:00.000Z',
      },
    ],
  },
  {
    id: 2,
    title: 'Order 2',
    date: '2024-02-01T00:00:00.000Z',
    description: 'Second order',
    products: [
      {
        id: 22,
        serialNumber: 202,
        isNew: 0,
        photo: 'p2.png',
        title: 'Tablet Pro',
        type: 'tablet',
        specification: 'Tablet spec',
        guarantee: {
          start: '2024-02-01T00:00:00.000Z',
          end: '2025-02-01T00:00:00.000Z',
        },
        price: [
          { value: 1200, symbol: 'UAH', isDefault: 1 },
          { value: 40, symbol: 'USD', isDefault: 0 },
        ],
        order: 2,
        date: '2024-02-01T00:00:00.000Z',
      },
    ],
  },
]

describe('OrdersView', () => {
  beforeEach(() => {
    mockDispatch.mockReset()
  })

  const createWrapper = (stateOverrides = {}) => {
    const store = createStore({
      state: {
        orders: {
          items: orders,
          loading: false,
          error: null,
        },
      },
      actions: {
        'orders/fetch': mockDispatch,
        'orders/remove': mockDispatch,
      },
      ...stateOverrides,
    })

    return mount(OrdersView, {
      global: {
        plugins: [store],
      },
    })
  }

  it('renders orders and dispatches fetch on mount', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Orders')
    expect(wrapper.text()).toContain('Order 1')
    expect(wrapper.text()).toContain('Order 2')
    expect(mockDispatch).toHaveBeenCalledTimes(1)
  })

  it('shows loading state while orders are being fetched', () => {
    const wrapper = createWrapper({
      state: {
        orders: {
          items: [],
          loading: true,
          error: null,
        },
      },
    })

    expect(wrapper.text()).toContain('Loading orders...')
  })

  it('shows empty state when there are no orders', () => {
    const wrapper = createWrapper({
      state: {
        orders: {
          items: [],
          loading: false,
          error: null,
        },
      },
    })

    expect(wrapper.text()).toContain('No orders available.')
  })
})

import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { router } from '../router'
import App from '../App.vue'
import store from '../store'

describe('App', () => {
  it('renders dashboard navigation and layout shell', async () => {
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, store],
      },
    })

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Orders')
    expect(wrapper.text()).toContain('Products')
  })
})

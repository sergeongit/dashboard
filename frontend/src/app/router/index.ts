import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/orders',
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/pages/orders/OrdersView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/pages/products/ProductsView.vue'),
    },
  ],
})

export default router

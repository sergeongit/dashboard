import { createRouter, createWebHistory } from 'vue-router'
import OrdersView from '../views/OrdersView.vue'
import ProductsView from '../views/ProductsView.vue'

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
      component: OrdersView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
  ],
})

export default router

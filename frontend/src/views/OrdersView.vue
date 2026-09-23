<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DeleteOrderModal from '../components/DeleteOrderModal.vue'
import OrderActions from '../components/OrderActions.vue'
import type { Order } from '../types/orders'

const orders = ref<Order[]>([])
const selectedOrderId = ref<number | null>(null)
const deleteOrderId = ref<number | null>(null)
const loading = ref(true)

const selectedOrder = computed(() =>
  orders.value.find((order) => order.id === selectedOrderId.value) ?? null
)

const getProductCount = (order: Order) => order.products.length

const getOrderTotal = (order: Order) =>
  order.products.reduce(
    (sum, product) => {
      const defaultPrice = product.price.find((price) => price.isDefault === 1)
      const value = defaultPrice?.value ?? 0
      return sum + value
    },
    0,
  )

const getOrderTotalUsd = (order: Order) =>
  order.products.reduce(
    (sum, product) => {
      const usdPrice = product.price.find((price) => price.symbol === 'USD')
      return sum + (usdPrice?.value ?? 0)
    },
    0,
  )

const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/orders')
    const payload = await response.json() as Order[]
    orders.value = payload
  } catch (error) {
    console.error('Failed to fetch orders', error)
  } finally {
    loading.value = false
  }
}

const removeOrder = async () => {
  if (deleteOrderId.value === null) {
    return
  }

  try {
    await fetch(`http://localhost:4000/api/orders/${deleteOrderId.value}`, {
      method: 'DELETE',
    })

    orders.value = orders.value.filter((order) => order.id !== deleteOrderId.value)

    if (selectedOrderId.value === deleteOrderId.value) {
      selectedOrderId.value = null
    }
  } catch (error) {
    console.error('Failed to delete order', error)
  } finally {
    deleteOrderId.value = null
  }
}

const formatDateEu = (value: string) =>
  new Date(value).toLocaleString('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

const formatDateUs = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="orders-page">
    <div class="orders-layout d-flex h-100">
      <div class="list-panel flex-grow-1 pe-3">
      <div class="d-flex w-100 justify-content-between align-items-center mb-3">
        <h2>Orders</h2>
      </div>

      <div v-if="loading" class="empty-state">Loading orders...</div>
      <div v-else-if="orders.length === 0" class="empty-state">No orders available.</div>

      <!-- Orders list -->
      <div v-else>
        <div class="order-list-header" aria-hidden="true">
          <div>Name</div>
          <div>Quantity</div>
          <div>Created at</div>
          <div>Total</div>
          <div class="order-list-header-actions"></div>
        </div>

        <div class="orders-list d-flex flex-column gap-2">
          <div
            v-for="order in orders"
            :key="order.id"
            class="order-row"
            :class="{ active: selectedOrderId === order.id }"
          >
            <div class="order-title">
              <strong>{{ order.title }}</strong>
            </div>
            <div class="order-products">{{ getProductCount(order)}} {{ getProductCount(order) > 1 ? 'items' : 'item' }}</div>
            <div class="order-date">
              <div class="small text-muted">{{ formatDateUs(order.date) }}</div>
              <div>{{ formatDateEu(order.date) }}</div>
            </div>
            <div class="order-total">
              <div class="small text-muted">{{ getOrderTotalUsd(order) }} USD</div>
              <div>{{ getOrderTotal(order) }} UAH</div>
            </div>
            <OrderActions
              @view="selectedOrderId = order.id"
              @delete="deleteOrderId = order.id"
            />
          </div>
        </div>
      </div>
      </div>

      <div class="details-slot" :class="{ 'has-details': selectedOrder }">
        <Transition name="details" appear>
          <aside v-if="selectedOrder" class="details-panel p-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>{{ selectedOrder.title }}</h3>
            <button type="button" class="btn-close" aria-label="Close" @click="selectedOrderId = null"></button>
          </div>

          <p class="text-muted mb-4">{{ selectedOrder.description }}</p>

          <div class="product-list">
            <div v-for="product in selectedOrder.products" :key="product.id" class="product-item border rounded p-2 mb-2">
              <div class="fw-semibold">{{ product.title }}</div>
              <div class="small text-muted">{{ product.type }}</div>
              <div class="small">{{ product.price.map((price) => `${price.value} ${price.symbol}`).join(' / ') }}</div>
            </div>
          </div>
        </aside>
      </Transition>
    </div>
    </div>

    <DeleteOrderModal
      v-if="deleteOrderId !== null"
      :order-title="orders.find((order) => order.id === deleteOrderId)?.title"
      @cancel="deleteOrderId = null"
      @confirm="removeOrder"
    />
  </div>
</template>

<style scoped>
.orders-layout {
  min-height: 400px;
}

.list-panel {
  min-width: 0;
}

.order-row {
  display: grid;
  grid-template-columns: minmax(180px, 1.5fr) minmax(70px, 0.5fr) minmax(170px, 1fr) minmax(130px, 0.8fr) minmax(112px, auto);
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background: #fff;
}

.order-list-header {
  display: grid;
  grid-template-columns: minmax(180px, 1.5fr) minmax(70px, 0.5fr) minmax(170px, 1fr) minmax(130px, 0.8fr) minmax(112px, auto);
  gap: 1rem;
  align-items: center;
  padding: 0 1rem 0.5rem;
  color: #6c757d;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.order-row.active {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.1rem rgba(13, 110, 253, 0.2);
}

@media (max-width: 768px) {
  .order-list-header {
    grid-template-columns: 1fr 1fr;
  }

  .order-list-header > div:nth-child(1),
  .order-list-header > div:nth-child(3),
  .order-list-header > div:nth-child(4) {
    grid-column: span 2;
  }

  .order-list-header-actions {
    display: none;
  }

  .order-row {
    grid-template-columns: 1fr 1fr;
  }

  .order-title,
  .order-date,
  .order-total {
    grid-column: span 2;
  }

  :deep(.order-actions) {
    grid-column: span 2;
  }
}

.details-slot {
  flex: 0 0 auto;
  width: 0;
  margin-left: 0;
  overflow: hidden;
  transition: width 0.25s ease, margin-left 0.25s ease;
}

.details-slot.has-details {
  width: 380px;
  margin-left: 1rem;
}

.details-panel {
  flex: 0 0 380px;
  width: 380px;
  margin-top: 88px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
}

.details-slot:not(.has-details) .details-panel {
  opacity: 0;
  pointer-events: none;
}

.details-enter-active,
.details-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.details-enter-from,
.details-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}

@media (prefers-reduced-motion: reduce) {
  .details-slot,
  .details-enter-active,
  .details-leave-active {
    transition-duration: 0.01ms;
  }
}

@media (max-width: 768px) {
  .details-slot {
    width: 0;
    margin-left: 0;
    transition: none;
  }

  .details-slot.has-details {
    width: 100%;
  }

  .details-panel {
    flex: 0 0 auto;
    width: 100%;
  }
}

.empty-state {
  padding: 2rem;
  border: 1px dashed #dee2e6;
  border-radius: 0.75rem;
  color: #6c757d;
}
</style>

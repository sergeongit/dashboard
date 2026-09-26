<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import DeleteOrderModal from '@/features/orders/delete-order/DeleteOrderModal.vue'
import OrderActions from '@/features/orders/order-actions/OrderActions.vue'
import type { Order } from '@/entities/order/model/types'
import type { RootState } from '@/app/store/types'

const store = useStore<RootState>()
const orders = computed(() => store.state.orders.items)
const selectedOrderId = ref<number | null>(null)
const deleteOrderId = ref<number | null>(null)
const loading = computed(() => store.state.orders.loading)

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

const removeOrder = async () => {
  if (deleteOrderId.value === null) {
    return
  }

  const orderId = deleteOrderId.value

  try {
    await store.dispatch('orders/remove', orderId)

    if (selectedOrderId.value === orderId) {
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
  store.dispatch('orders/fetch')
})
</script>

<template>
  <div class="orders-page">
    <div class="orders-layout d-flex h-100">
      <div class="list-panel flex-grow-1 pe-3">
      <div class="d-flex w-100 justify-content-between align-items-center mb-3">
        <h2>Orders</h2>
      </div>

      <div v-if="loading" class="empty-state text-muted border border-secondary-subtle">Loading orders...</div>
      <div v-else-if="orders.length === 0" class="empty-state text-muted border border-secondary-subtle">No orders available.</div>

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
            class="order-row border rounded-3 bg-white px-3"
            :class="{ active: selectedOrderId === order.id }"
          >
            <div class="order-title text-truncate">
              <strong class="d-block text-truncate">{{ order.title }}</strong>
            </div>
            <div class="order-products text-truncate">{{ getProductCount(order)}} {{ getProductCount(order) > 1 ? 'items' : 'item' }}</div>
            <div class="order-date">
              <div class="small text-muted text-truncate">{{ formatDateUs(order.date) }}</div>
              <div class="text-truncate">{{ formatDateEu(order.date) }}</div>
            </div>
            <div class="order-total">
              <div class="small text-muted text-truncate">{{ getOrderTotalUsd(order) }} USD</div>
              <div class="text-truncate">{{ getOrderTotal(order) }} UAH</div>
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
          <aside v-if="selectedOrder" class="details-panel p-3 bg-light border">
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

    <Transition name="modal" appear>
      <DeleteOrderModal
        v-if="deleteOrderId !== null"
        :order-title="orders.find((order) => order.id === deleteOrderId)?.title"
        @cancel="deleteOrderId = null"
        @confirm="removeOrder"
      />
    </Transition>
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
  grid-template-columns: minmax(0, 1.5fr) minmax(70px, 0.5fr) minmax(170px, 1fr) minmax(130px, 0.8fr) minmax(112px, auto);
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding-block: 0.85rem;
}

.order-list-header {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(70px, 0.5fr) minmax(170px, 1fr) minmax(130px, 0.8fr) minmax(112px, auto);
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

.order-title {
  min-width: 0;
  overflow: hidden;
}

.order-row > * {
  min-width: 0;
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

.empty-state {
  padding: 2rem;
  border-radius: 0.75rem;
  --bs-border-style: dashed;
}
</style>

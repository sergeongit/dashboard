<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '@/app/store/types'

const store = useStore<RootState>()
const products = computed(() => store.state.products.items)
const selectedType = ref('All')
const loading = computed(() => store.state.products.loading)

const productTypes = computed(() => ['All', ...new Set(products.value.map((product) => product.type))])

const filteredProducts = computed(() => {
  if (selectedType.value === 'All') {
    return products.value
  }

  return products.value.filter((product) => product.type === selectedType.value)
})

const formatDate = (value: string) => new Date(value).toLocaleString()

onMounted(() => {
  store.dispatch('products/fetch')
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Products</h2>
      <select v-model="selectedType" class="form-select w-auto">
        <option v-for="type in productTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <div v-if="loading" class="text-muted">Loading products...</div>
    <div v-else-if="filteredProducts.length === 0" class="empty-state text-muted border border-secondary-subtle">
      No products available.
    </div>

    <div v-else class="table-responsive">
      <table class="products-table table table-striped table-bordered align-middle bg-white">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Guarantee</th>
            <th>Price</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>
              <div class="product-cell d-flex align-items-center gap-3">
                <img :src="product.photo || '/images/no-image.svg'" alt="Product preview" class="product-thumb flex-shrink-0 border rounded-3 bg-light" />
                <div class="product-copy">
                  <div class="fw-semibold text-truncate">{{ product.title }}</div>
                  <div class="small text-muted text-truncate">SN: {{ product.serialNumber }}</div>
                </div>
              </div>
            </td>
            <td><div class="text-truncate">{{ product.type }}</div></td>
            <td>
              <div class="text-truncate">{{ formatDate(product.guarantee.start) }}</div>
              <div class="text-truncate">{{ formatDate(product.guarantee.end) }}</div>
            </td>
            <td>
              <div v-for="price in product.price" :key="`${product.id}-${price.symbol}`" class="small text-truncate">
                {{ price.value }} {{ price.symbol }}
              </div>
            </td>
            <td><div class="text-truncate">{{ product.order }}</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 2rem;
  border-radius: 0.75rem;
  --bs-border-style: dashed;
}

.product-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
}

.product-cell {
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

.product-copy {
  flex: 1 1 0%;
  min-width: 0;
  overflow: hidden;
}

.products-table {
  min-width: 760px;
  table-layout: fixed;
}

.products-table col:nth-child(1) {
  width: 32%;
}

.products-table col:nth-child(2) {
  width: 14%;
}

.products-table col:nth-child(3) {
  width: 24%;
}

.products-table col:nth-child(4) {
  width: 20%;
}

.products-table col:nth-child(5) {
  width: 10%;
}
</style>

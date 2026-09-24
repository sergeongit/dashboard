<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../store/types'

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
    <div v-else-if="filteredProducts.length === 0" class="empty-state">
      No products available.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-bordered align-middle">
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
              <div class="d-flex align-items-center gap-3">
                <img :src="product.photo || '/images/no-image.svg'" alt="Product preview" class="product-thumb" />
                <div>
                  <div class="fw-semibold">{{ product.title }}</div>
                  <div class="small text-muted">SN: {{ product.serialNumber }}</div>
                </div>
              </div>
            </td>
            <td>{{ product.type }}</td>
            <td>
              <div>{{ formatDate(product.guarantee.start) }}</div>
              <div>{{ formatDate(product.guarantee.end) }}</div>
            </td>
            <td>
              <div v-for="price in product.price" :key="`${product.id}-${price.symbol}`" class="small">
                {{ price.value }} {{ price.symbol }}
              </div>
            </td>
            <td>{{ product.order }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table {
  background: #fff;
}

.empty-state {
  padding: 2rem;
  border: 1px dashed #dee2e6;
  border-radius: 0.75rem;
  color: #6c757d;
}

.product-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
  background: #f8f9fa;
}
</style>

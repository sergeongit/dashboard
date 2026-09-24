<script setup lang="ts">
import BaseButton from '@/shared/ui/BaseButton.vue'

defineEmits<{
  view: []
  delete: []
}>()
</script>

<template>
  <div class="order-actions d-flex flex-column align-items-end gap-2">
    <BaseButton title="View details" variant="primary" :outline="true" size="sm" @click="$emit('view')" />
    <BaseButton title="Delete" variant="danger" :outline="true" size="sm" @click="$emit('delete')" />
  </div>
</template>

<style scoped>
.order-actions {
  min-width: 112px;
}

@media (max-width: 768px) {
  .order-actions {
    align-items: stretch !important;
  }
}
</style>

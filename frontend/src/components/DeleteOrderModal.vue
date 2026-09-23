<script setup lang="ts">
import BaseButton from './BaseButton.vue'

defineProps<{
  orderTitle?: string
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

<template>
  <Transition name="modal">
    <div class="modal-backdrop d-flex align-items-center justify-content-center">
      <div class="modal-card bg-white rounded shadow p-4">
        <h4>Delete order?</h4>
        <p class="mb-3">
          {{ orderTitle ? `Delete ${orderTitle}? This action cannot be undone.` : 'This action will remove the selected order permanently.' }}
        </p>
        <div class="d-flex justify-content-end gap-2">
          <BaseButton title="Cancel" variant="secondary" :outline="true" @click="$emit('cancel')" />
          <BaseButton title="Delete" variant="danger" @click="$emit('confirm')" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
}

.modal-card {
  min-width: 320px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  opacity: 0;
  transform: scale(0.96) translateY(0.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal-card,
  .modal-leave-active .modal-card {
    transition-duration: 0.01ms;
  }
}
</style>

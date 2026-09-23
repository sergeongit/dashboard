<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
type ButtonType = 'button' | 'submit' | 'reset'
type ButtonSize = 'sm' | 'lg'

withDefaults(
  defineProps<{
    title: string
    variant?: ButtonVariant
    outline?: boolean
    type?: ButtonType
    size?: ButtonSize
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    outline: false,
    type: 'button',
    size: undefined,
    disabled: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[
      `btn-${outline ? 'outline-' : ''}${variant}`,
      size ? `btn-${size}` : '',
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    {{ title }}
  </button>
</template>

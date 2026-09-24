<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '../store/types'

const now = ref(new Date())
const store = useStore<RootState>()
const activeSessions = computed(() => store.state.sessions.activeCount)

let timerId: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timerId = setInterval(() => {
    now.value = new Date()
  }, 1000)

  store.dispatch('sessions/connect')
})

onBeforeUnmount(() => {
  if (timerId) {
    clearInterval(timerId)
  }

  store.dispatch('sessions/disconnect')
})

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(now.value),
)

const formattedTime = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now.value),
)
</script>

<template>
  <header class="top-menu d-flex align-items-center justify-content-between px-4 py-3">
    <div class="title fw-semibold">Dashboard</div>
    <div class="d-flex align-items-center gap-3">
      <div class="date-time text-end">
        <div class="small text-muted">{{ formattedDate }}</div>
        <div class="fw-semibold">{{ formattedTime }}</div>
      </div>
      <div class="badge-session d-flex align-items-center gap-2 px-3 py-2 rounded-pill">
        <span class="session-dot"></span>
        <span>{{ activeSessions }} active session{{ activeSessions === 1 ? '' : 's' }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-menu {
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
}

.title {
  font-size: 1.15rem;
}

.badge-session {
  background: #eef6ff;
  color: #0d6efd;
  font-size: 0.85rem;
}

.session-dot {
  display: inline-block;
  width: 0.65rem;
  height: 0.65rem;
  background: #198754;
  border-radius: 50%;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.2);
}
</style>

<script setup lang="ts">
import NavigationMenu from './components/NavigationMenu.vue'
import TopMenu from './components/TopMenu.vue'
</script>

<template>
  <div class="dashboard-shell d-flex flex-column min-vh-100">
    <TopMenu />

    <div class="dashboard-body d-flex flex-grow-1">
      <aside class="sidebar-wrap">
        <NavigationMenu />
      </aside>

      <main class="content-wrap flex-grow-1 p-4">
        <RouterView v-slot="{ Component }">
          <Transition name="route" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-shell {
  background: #f5f7fb;
}

.dashboard-body {
  min-height: 0;
}

.sidebar-wrap {
  width: 260px;
  min-width: 260px;
}

.content-wrap {
  background: #f5f7fb;
}

.route-enter-active,
.route-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(0.5rem);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .route-enter-active,
  .route-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>

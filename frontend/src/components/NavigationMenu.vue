<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="nav-menu d-flex flex-column gap-2 p-3">
    <div class="fw-medium text-primary mb-3">Navigation</div>
    <RouterLink class="nav-link" to="/orders">Orders</RouterLink>
    <RouterLink class="nav-link" to="/products">Products</RouterLink>
  </nav>
</template>

<style scoped>
.nav-menu {
  height: 100%;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
}

.nav-link {
  display: block;
  padding: 0.75rem 0.9rem;
  border-radius: 0.5rem;
  color: #212529;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #c5dcfc;
  color: #0e69f2;
}
.nav-link:hover {
  background-color: #e6f2ff;
}
</style>

<template>
  <div class="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white transition-colors duration-300 font-display">
    <AppNavbar />
    <NuxtPage />
  </div>
</template>

<script setup>
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

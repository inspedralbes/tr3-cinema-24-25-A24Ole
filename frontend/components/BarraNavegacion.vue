<template>
  <header class="glass fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 transition-all duration-300">
    <div class="flex items-center gap-4">
      <NuxtLink to="/" class="group flex items-center gap-3">
        <div class="relative flex items-center justify-center size-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(242,13,51,0.5)]">
           <svg fill="currentColor" viewBox="0 0 24 24" class="size-full">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
        </div>
        <h2 class="text-white text-lg font-black tracking-widest uppercase font-display group-hover:text-primary transition-colors duration-300">Cinema<span class="text-primary">Flow</span></h2>
      </NuxtLink>
    </div>
    
    <nav class="hidden md:flex items-center gap-8">
      <NuxtLink to="/" class="nav-link">Movies</NuxtLink>
      <a href="#" class="nav-link">Theaters</a>
      <a href="#" class="nav-link">Promotions</a>
    </nav>

    <div class="flex items-center gap-4">
      <button @click="handleAdminToggle" :class="['admin-toggle-btn group', isAdmin ? 'active' : '']" title="Toggle Admin Mode">
        <span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
          {{ isAdmin ? 'admin_panel_settings' : 'person' }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAdmin } from '@/composables/useAdmin'
import { useRouter } from 'vue-router'

const { isAdmin, toggleAdmin } = useAdmin()
const router = useRouter()

const handleAdminToggle = () => {
  toggleAdmin()
  if (isAdmin.value) {
    router.push('/admin')
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.admin-toggle-btn {
  @apply flex items-center justify-center rounded-full size-10 border bg-surface-200 border-white/5 text-white transition-all;
}

.admin-toggle-btn:hover {
  @apply bg-primary border-primary;
  box-shadow: 0 0 15px rgba(242, 13, 51, 0.4);
}

.admin-toggle-btn.active {
  @apply bg-primary border-primary text-white;
  box-shadow: 0 0 15px rgba(242, 13, 51, 0.4);
}
</style>

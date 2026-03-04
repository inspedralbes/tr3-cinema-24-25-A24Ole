<template>
  <div class="min-h-screen bg-background pt-24 px-6 lg:px-12 pb-12">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-black uppercase tracking-widest text-white mb-2 font-display text-shadow-glow">
            Admin <span class="text-primary">Dashboard</span>
          </h1>
          <p class="text-secondary text-sm tracking-wide">Real-time platform overview</p>
        </div>
        
        <NuxtLink to="/admin/informes" class="flex items-center gap-2 px-6 py-3 bg-surface-200 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-white/20 transition-all font-semibold uppercase tracking-wider text-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <span class="material-symbols-outlined text-[20px]">bar_chart</span>
          Detailed Reports
        </NuxtLink>
      </div>

      <!-- Real-time Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass p-6 rounded-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Active Users</p>
              <h3 class="text-3xl font-black text-white font-display">{{ realtimeState?.global?.totalConnected || 0 }}</h3>
            </div>
            <div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined">group</span>
            </div>
          </div>
        </div>

        <div class="glass p-6 rounded-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Locked Seats</p>
              <h3 class="text-3xl font-black text-white font-display">{{ realtimeState?.global?.totalLocked || 0 }}</h3>
            </div>
            <div class="size-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined">lock</span>
            </div>
          </div>
        </div>

        <div class="glass p-6 rounded-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-secondary text-xs font-bold uppercase tracking-wider mb-1">Confirmed Purchases</p>
              <h3 class="text-3xl font-black text-white font-display">{{ dashboardData?.confirmed_purchases || 0 }}</h3>
            </div>
            <div class="size-12 rounded-xl bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined">shopping_cart_checkout</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Movies Real-time List -->
      <div class="glass p-8 rounded-3xl">
        <h2 class="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">movie</span>
          Movie Rooms Status
        </h2>
        
        <div class="space-y-4">
          <div v-if="pending" class="text-center py-8 text-secondary">
            <span class="material-symbols-outlined animate-spin text-4xl">refresh</span>
            <p class="mt-2 text-sm uppercase tracking-widest">Loading data...</p>
          </div>
          
          <div v-else-if="dashboardData?.movies?.length === 0" class="text-center py-8 text-secondary">
            No movies available.
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="movie in dashboardData?.movies" :key="movie.id" class="p-5 rounded-2xl bg-surface-200/50 border border-white/5 hover:border-white/10 transition-colors">
              <h4 class="text-white font-bold text-lg mb-4 truncate" :title="movie.titulo">{{ movie.titulo }}</h4>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-secondary">Seats Sold</span>
                  <span class="font-bold text-white">{{ movie.sold_seats || 0 }} / 40</span>
                </div>
                <!-- Progress bar for sales -->
                <div class="h-2 w-full bg-surface-300 rounded-full overflow-hidden">
                  <div class="h-full bg-success transition-all duration-1000" :style="{ width: `${((movie.sold_seats || 0) / 40) * 100}%` }"></div>
                </div>
                
                <div class="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                  <span class="text-secondary">Active Users (Room)</span>
                  <span class="font-bold text-accent">{{ getRoomStats(movie.id).activeUsers }}</span>
                </div>
                
                <div class="flex justify-between items-center text-sm">
                  <span class="text-secondary">Locked Pending</span>
                  <span class="font-bold text-primary">{{ getRoomStats(movie.id).lockedSeats }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdmin } from '@/composables/useAdmin'

const config = useRuntimeConfig()
const router = useRouter()
const { isAdmin } = useAdmin()

// Protection if navigated directly
if (!isAdmin.value) {
  router.push('/')
}

const realtimeState = ref(null)
let pollInterval = null

const { data: dashboardData, pending } = await useFetch(`${config.public.apiBase}/admin/dashboard`)

const fetchRealtimeState = async () => {
  try {
    const res = await fetch(`${config.public.socketUrl}/admin/state`)
    if (res.ok) {
        realtimeState.value = await res.json()
    }
  } catch (err) {
    console.error('Failed to fetch realtime state', err)
  }
}

const getRoomStats = (movieId) => {
    if (!realtimeState.value || !realtimeState.value.rooms) return { activeUsers: 0, lockedSeats: 0 }
    
    // Server uses roomId which we set as movieId in string
    const room = realtimeState.value.rooms.find(r => r.roomId === String(movieId))
    return room || { activeUsers: 0, lockedSeats: 0 }
}

onMounted(() => {
    // Initial fetch
    fetchRealtimeState()
    
    // Poll every 3 seconds for realtime updates without websockets overhead for the dashboard
    pollInterval = setInterval(() => {
        fetchRealtimeState()
    }, 3000)
})

onUnmounted(() => {
    if (pollInterval) {
        clearInterval(pollInterval)
    }
})

// Optional title
useHead({ title: 'Admin Dashboard - CinemaFlow' })
</script>

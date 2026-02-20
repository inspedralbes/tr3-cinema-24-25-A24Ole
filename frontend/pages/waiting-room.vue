<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
    <!-- Ambient Background -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="relative mb-12">
       <div class="size-40 rounded-full border-4 border-surface-200 border-t-primary animate-spin shadow-[0_0_50px_rgba(242,13,51,0.2)]"></div>
       <div class="absolute inset-0 flex items-center justify-center animate-pulse">
         <span class="material-symbols-outlined text-5xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">hourglass_top</span>
       </div>
    </div>
    
    <h1 class="text-5xl font-black text-white uppercase tracking-tighter mb-6 font-display">You're in line</h1>
    <p class="text-secondary text-lg max-w-lg mb-12 leading-relaxed">
      We are experiencing high demand. Please hold tight, you will be redirected to the booking experience shortly.
    </p>

    <div class="bg-surface-100/80 border border-white/10 px-10 py-6 rounded-2xl backdrop-blur-md shadow-2xl relative group">
      <div class="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div class="relative">
        <p class="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Your Position in Queue</p>
        <p class="text-4xl font-black text-white neon-text">{{ queuePosition !== null ? queuePosition : 'Calculating...' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRealtime } from '@/composables/useRealtime'
import { useRouter } from 'vue-router'
import { watch, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const { connect, disconnect, queuePosition, startTransition } = useRealtime()

onMounted(() => {
    connect()
})

onUnmounted(() => {
    // Optional cleanup
})

watch(startTransition, (val) => {
    if (val) {
        // Redirect to booking flow
        // Try to go back to the previous movie if known, or home
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push('/')
        }
    }
})
</script>

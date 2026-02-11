<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
    <div class="relative mb-8">
       <div class="size-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
       <div class="absolute inset-0 flex items-center justify-center">
         <span class="material-symbols-outlined text-4xl text-white">hourglass_empty</span>
       </div>
    </div>
    
    <h1 class="text-3xl font-black text-white uppercase tracking-tight mb-4">You're in line</h1>
    <p class="text-gray-400 max-w-md mb-8">
      There are currently many users booking tickets. Please wait a moment, you will be redirected automatically.
    </p>

    <div class="bg-card-dark border border-border-dark px-6 py-4 rounded-lg">
      <p class="text-sm text-gray-500 uppercase tracking-widest mb-1">Your Position</p>
      <p class="text-2xl font-bold text-white">{{ queuePosition !== null ? queuePosition : 'Calculating...' }}</p>
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
        router.push('/') 
    }
})
</script>

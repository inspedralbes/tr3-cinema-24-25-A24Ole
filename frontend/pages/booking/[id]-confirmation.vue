<template>
  <div v-if="pending" class="min-h-[70vh] flex justify-center items-center">
    <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
  <div v-else-if="error" class="min-h-[70vh] flex flex-col justify-center items-center text-white">
    <span class="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
    <h2 class="text-2xl font-bold">Booking Not Found</h2>
    <p class="text-secondary mt-2">{{ error.message }}</p>
    <NuxtLink to="/" class="mt-6 text-primary hover:underline">Return Home</NuxtLink>
  </div>
  <div v-else-if="booking" class="max-w-3xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center min-h-[70vh]">
    <div class="mb-8 flex justify-center">
      <div class="size-28 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_50px_rgba(242,13,51,0.3)] animate-pulse">
        <span class="material-symbols-outlined text-7xl">check_circle</span>
      </div>
    </div>
    
    <h1 class="text-5xl font-black text-white mb-4 uppercase tracking-tighter font-display">Booking Confirmed!</h1>
    <p class="text-secondary text-lg mb-12 max-w-lg mx-auto leading-relaxed">Thank you, <span class="text-white font-bold">{{ booking.name }}</span>! Your tickets have been sent to <span class="text-white font-bold">{{ booking.email }}</span>. Get ready for an unforgettable specialized experience.</p>

    <div class="w-full bg-surface-100/50 border border-white/5 rounded-2xl p-0 relative overflow-hidden shadow-2xl backdrop-blur-md">
      <!-- Gradient Top Line -->
      <div class="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      <div class="p-8 flex flex-col md:flex-row gap-8 items-center">
        <!-- QR Code Simulation -->
        <div class="bg-white p-4 rounded-xl shrink-0 shadow-lg rotate-2 hover:rotate-0 transition-transform duration-300">
          <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Booking_${booking.id}`" alt="QR Code" class="size-32 mix-blend-multiply">
        </div>

        <div class="text-left space-y-5 flex-1 w-full">
          <div class="border-b border-white/5 pb-5">
            <h3 class="text-2xl font-black text-white uppercase tracking-tight mb-2">{{ booking.movie?.title || 'Unknown Movie' }}</h3>
            <p class="text-primary font-bold uppercase tracking-widest text-xs bg-primary/10 px-2 py-1 rounded w-fit">{{ booking.room?.name || 'Hall' }} • Seats {{ booking.seats.map(s => s.seat_number).join(', ') }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <p class="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Date</p>
              <p class="text-white font-medium">{{ formatDate(booking.session?.start_at) }}</p>
            </div>
            <div>
              <p class="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Time</p>
              <p class="text-white font-medium">{{ formatTime(booking.session?.start_at) }}</p>
            </div>
            <div>
              <p class="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Order ID</p>
              <p class="text-white font-medium font-mono text-xs opacity-70">#{{ booking.id }}</p>
            </div>
             <div>
              <p class="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Total Paid</p>
              <p class="text-primary font-black text-lg neon-text">${{ Number(booking.total_price).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-16">
      <NuxtLink to="/" class="inline-flex items-center gap-3 text-white hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm group">
        <span class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">west</span>
        Back to Movies
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'

const route = useRoute()
const config = useRuntimeConfig()

const { data: responseData, pending, error } = await useFetch(`${config.public.apiBase || '/api'}/bookings/${route.params.id}`)

const booking = computed(() => responseData.value?.data)

const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const formatTime = (dateString) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
</script>

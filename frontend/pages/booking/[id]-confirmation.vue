<template>
  <div class="max-w-3xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center min-h-[70vh]">
    <div class="mb-8 flex justify-center">
      <div class="size-28 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_50px_rgba(242,13,51,0.3)] animate-pulse">
        <span class="material-symbols-outlined text-7xl">check_circle</span>
      </div>
    </div>
    
    <h1 class="text-5xl font-black text-white mb-4 uppercase tracking-tighter font-display">Booking Confirmed!</h1>
    <p class="text-secondary text-lg mb-12 max-w-lg mx-auto leading-relaxed">Your tickets have been sent to your email. Get ready for an unforgettable specialized experience.</p>

    <div class="w-full bg-surface-100/50 border border-white/5 rounded-2xl p-0 relative overflow-hidden shadow-2xl backdrop-blur-md">
      <!-- Gradient Top Line -->
      <div class="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      <div class="p-8 flex flex-col md:flex-row gap-8 items-center">
        <!-- QR Code Simulation -->
        <div class="bg-white p-4 rounded-xl shrink-0 shadow-lg rotate-2 hover:rotate-0 transition-transform duration-300">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExampleBooking" alt="QR Code" class="size-32 mix-blend-multiply">
        </div>

        <div class="text-left space-y-5 flex-1 w-full">
          <div class="border-b border-white/5 pb-5">
            <h3 class="text-2xl font-black text-white uppercase tracking-tight mb-2">{{ bookingStore.currentMovie?.title || 'Neon Demon' }}</h3>
            <p class="text-primary font-bold uppercase tracking-widest text-xs bg-primary/10 px-2 py-1 rounded w-fit">Hall 4 • Seat {{ bookingStore.selectedSeats.map(s => s.label).join(', ') }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <p class="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Date</p>
              <p class="text-white font-medium">Fri, Oct 25</p>
            </div>
            <div>
              <p class="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Time</p>
              <p class="text-white font-medium">8:30 PM</p>
            </div>
            <div>
              <p class="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Order ID</p>
              <p class="text-white font-medium font-mono text-xs opacity-70">#{{ route.params.id }}</p>
            </div>
             <div>
              <p class="text-secondary text-xs uppercase tracking-widest font-bold mb-1">Total Paid</p>
              <p class="text-primary font-black text-lg neon-text">${{ bookingStore.grandTotal.toFixed(2) }}</p>
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
import { useRoute } from 'vue-router'
import { useBookingStore } from '@/stores/booking'

const route = useRoute()
const bookingStore = useBookingStore()
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-12 text-center">
    <div class="mb-8 flex justify-center">
      <div class="size-24 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-bounce">
        <span class="material-symbols-outlined text-6xl">check_circle</span>
      </div>
    </div>
    
    <h1 class="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Booking Confirmed!</h1>
    <p class="text-gray-400 mb-12">Your tickets have been sent to your email.</p>

    <div class="bg-surface-dark border border-border-dark rounded-2xl p-8 relative overflow-hidden neon-border">
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-600"></div>
      
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <!-- QR Code Simulation -->
        <div class="bg-white p-4 rounded-xl shrink-0">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExampleBooking" alt="QR Code" class="size-32 mix-blend-multiply">
        </div>

        <div class="text-left space-y-4 flex-1">
          <div>
            <h3 class="text-2xl font-bold text-white">{{ bookingStore.currentMovie?.title || 'Neon Demon' }}</h3>
            <p class="text-primary font-bold uppercase tracking-widest text-sm">Hall 4 • Seat {{ bookingStore.selectedSeats.map(s => s.label).join(', ') }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Date</p>
              <p class="text-white font-medium">Fri, Oct 25</p>
            </div>
            <div>
              <p class="text-gray-500">Time</p>
              <p class="text-white font-medium">8:30 PM</p>
            </div>
            <div>
              <p class="text-gray-500">Order ID</p>
              <p class="text-white font-medium font-mono text-xs">#{{ route.params.id }}</p>
            </div>
             <div>
              <p class="text-gray-500">Total Paid</p>
              <p class="text-primary font-bold">${{ bookingStore.grandTotal.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-white hover:text-primary transition-colors font-medium">
        <span class="material-symbols-outlined">west</span>
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

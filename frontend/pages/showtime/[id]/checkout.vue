<template>
  <div class="max-w-7xl mx-auto px-6 md:px-20 py-8 lg:py-12">
    <!-- Stepper -->
    <nav class="flex items-center gap-2 text-sm font-medium mb-8">
      <span class="text-primary/70">Seat Selection</span>
      <span class="text-slate-400"><span class="material-symbols-outlined text-[14px]">chevron_right</span></span>
      <span class="text-primary/70">Booking Details</span>
      <span class="text-slate-400"><span class="material-symbols-outlined text-[14px]">chevron_right</span></span>
      <span class="text-white">Payment</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <!-- Left Column: Payment Form -->
      <div class="lg:col-span-7 flex flex-col gap-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Checkout</h1>
          <p class="text-slate-400">Complete your transaction to secure your seats.</p>
        </div>

        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">credit_card</span>
            Payment Method
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-semibold uppercase tracking-wider text-slate-400">Cardholder Name</label>
              <input class="w-full h-14 bg-surface-dark border border-border-dark rounded-lg px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-white" placeholder="e.g. MARCUS AURELIUS" type="text"/>
            </div>
            
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-semibold uppercase tracking-wider text-slate-400">Card Number</label>
              <div class="relative">
                <input class="w-full h-14 bg-surface-dark border border-border-dark rounded-lg px-4 pr-12 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-white" placeholder="0000 0000 0000 0000" type="text"/>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  <span class="material-symbols-outlined text-primary">credit_card_heart</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-semibold uppercase tracking-wider text-slate-400">Expiry Date</label>
              <input class="w-full h-14 bg-surface-dark border border-border-dark rounded-lg px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-white" placeholder="MM/YY" type="text"/>
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-semibold uppercase tracking-wider text-slate-400">CVV</label>
              <div class="relative">
                <input class="w-full h-14 bg-surface-dark border border-border-dark rounded-lg px-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-white" placeholder="***" type="password"/>
                <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">help</span>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
            <span class="material-symbols-outlined text-primary text-xl">verified_user</span>
            <p class="text-xs text-slate-400 leading-relaxed">
              Your payment information is processed securely. We do not store your CVV. All transactions are protected with industry-standard 256-bit SSL encryption.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Order Summary -->
      <aside class="lg:col-span-5">
        <div class="bg-surface-dark border border-border-dark rounded-xl p-6 lg:p-8 sticky top-32">
          <h2 class="text-xl font-bold mb-6 text-white">Booking Summary</h2>
          
          <div class="flex gap-4 mb-8">
            <div class="w-24 h-36 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
               <!-- Mock Image -->
              <img v-if="bookingStore.currentMovie?.poster" :src="bookingStore.currentMovie.poster" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center text-white/20 font-bold text-xs uppercase">No Poster</div>
            </div>
            <div class="flex flex-col justify-center">
              <h3 class="text-lg font-bold leading-snug mb-1 text-white">{{ bookingStore.currentMovie?.title || 'Unknown Title' }}</h3>
              <p class="text-sm text-primary font-semibold mb-2">Standard Session</p>
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="material-symbols-outlined text-sm">calendar_today</span>
                  <span>Friday, Oct 27, 2023</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  <span>08:30 PM</span>
                </div>
                 <div class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="material-symbols-outlined text-sm">location_on</span>
                  <span>Grand IMAX Theater, Screen 4</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-4 mb-8 border-t border-border-dark pt-6">
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-400">Selected Seats ({{ bookingStore.seatCount }})</span>
              <div class="flex gap-2 flex-wrap justify-end">
                <span v-for="seat in bookingStore.selectedSeats" :key="seat.id" class="bg-background-dark px-2 py-1 rounded text-primary font-bold text-xs">
                    {{ seat.label }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Tickets Total</span>
              <span class="text-white font-medium text-right">${{ bookingStore.totalTicketPrice.toFixed(2) }}</span>
            </div>
            
             <div class="flex justify-between text-sm">
              <span class="text-slate-400">Booking Fee</span>
              <span class="text-white font-medium">${{ bookingStore.totalBookingFee.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t border-dashed border-border-dark">
              <span class="text-lg font-bold text-white">Total</span>
              <span class="text-2xl font-bold text-primary">${{ bookingStore.grandTotal.toFixed(2) }}</span>
            </div>
          </div>
          
          <button @click="handlePayment" class="w-full bg-primary text-white font-bold py-4 rounded-lg neon-glow flex items-center justify-center gap-2 transition-transform active:scale-95">
             Pay Now
             <span class="material-symbols-outlined">lock</span>
          </button>
          
           <p class="text-center text-[10px] uppercase tracking-widest text-slate-500 mt-6">
              Refundable up to 2 hours before showtime
           </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from '@/stores/booking'
import { useBooking } from '@/composables/useBooking'

const bookingStore = useBookingStore()
const { nextStep } = useBooking()

const handlePayment = () => {
    // Simulate payment handling
    nextStep('checkout')
}
</script>

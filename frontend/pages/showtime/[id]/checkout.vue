<template>
  <div class="max-w-7xl mx-auto px-6 md:px-20 py-8 lg:py-12">
    <!-- Stepper -->
    <nav class="flex items-center gap-3 text-sm font-bold mb-12">
      <span class="text-primary/70 uppercase tracking-wider">Seat Selection</span>
      <span class="text-white/20"><span class="material-symbols-outlined text-[14px]">chevron_right</span></span>
      <span class="text-primary/70 uppercase tracking-wider">Booking Details</span>
      <span class="text-white/20"><span class="material-symbols-outlined text-[14px]">chevron_right</span></span>
      <span class="text-white uppercase tracking-wider border-b-2 border-primary pb-0.5">Payment</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-white">
      <!-- Left Column: Payment Form -->
      <div class="lg:col-span-7 flex flex-col gap-8">
        <div>
          <h1 class="text-3xl md:text-5xl font-black tracking-tighter text-white mb-3 font-display uppercase">Checkout</h1>
          <p class="text-secondary text-lg">Complete your transaction to secure your seats.</p>
        </div>

        <div class="space-y-8 bg-surface-100/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
          <h2 class="text-xl font-bold text-white flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">credit_card</span>
            Payment Method
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2 space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Cardholder Name</label>
              <input class="w-full h-14 bg-surface-200 border border-white/10 rounded-xl px-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_15px_rgba(242,13,51,0.2)] outline-none transition-all text-white placeholder-white/20 font-medium" placeholder="e.g. MARCUS AURELIUS" type="text"/>
            </div>
            
            <div class="md:col-span-2 space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Card Number</label>
              <div class="relative">
                <input class="w-full h-14 bg-surface-200 border border-white/10 rounded-xl px-4 pr-12 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_15px_rgba(242,13,51,0.2)] outline-none transition-all text-white placeholder-white/20 font-medium font-mono" placeholder="0000 0000 0000 0000" type="text"/>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                  <span class="material-symbols-outlined text-primary/50">credit_card</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Expiry Date</label>
              <input class="w-full h-14 bg-surface-200 border border-white/10 rounded-xl px-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_15px_rgba(242,13,51,0.2)] outline-none transition-all text-white placeholder-white/20 font-medium font-mono text-center" placeholder="MM/YY" type="text"/>
            </div>
            
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1">CVV</label>
              <div class="relative">
                <input class="w-full h-14 bg-surface-200 border border-white/10 rounded-xl px-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_15px_rgba(242,13,51,0.2)] outline-none transition-all text-white placeholder-white/20 font-medium font-mono text-center" placeholder="***" type="password"/>
                <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-secondary text-lg cursor-help hover:text-white transition-colors">help</span>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
            <span class="material-symbols-outlined text-primary text-xl mt-0.5">verified_user</span>
            <p class="text-xs text-secondary leading-relaxed font-medium">
              Your payment information is processed securely. We do not store your CVV. All transactions are protected with industry-standard 256-bit SSL encryption.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Order Summary -->
      <aside class="lg:col-span-5">
        <div class="bg-surface-100/80 border border-white/10 rounded-2xl p-6 lg:p-8 sticky top-32 backdrop-blur-md shadow-2xl">
          <h2 class="text-2xl font-black mb-6 text-white uppercase tracking-tight">Booking Summary</h2>
          
          <div class="flex gap-5 mb-8 group">
            <div class="w-28 h-40 rounded-lg overflow-hidden flex-shrink-0 bg-surface-200 shadow-lg border border-white/5 relative">
               <!-- Mock Image -->
              <img v-if="bookingStore.currentMovie?.poster" :src="bookingStore.currentMovie.poster" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
              <div v-else class="w-full h-full flex items-center justify-center text-white/20 font-bold text-xs uppercase">No Poster</div>
            </div>
            <div class="flex flex-col justify-center">
              <h3 class="text-xl font-bold leading-tight mb-2 text-white font-display">{{ bookingStore.currentMovie?.title || 'Unknown Title' }}</h3>
              <p class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded w-fit mb-3 uppercase tracking-wider">Standard Session</p>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2 text-xs text-secondary font-medium">
                  <span class="material-symbols-outlined text-sm text-primary">calendar_today</span>
                  <span>Friday, Oct 27, 2023</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-secondary font-medium">
                  <span class="material-symbols-outlined text-sm text-primary">schedule</span>
                  <span>08:30 PM</span>
                </div>
                 <div class="flex items-center gap-2 text-xs text-secondary font-medium">
                  <span class="material-symbols-outlined text-sm text-primary">location_on</span>
                  <span>Grand IMAX Theater, Screen 4</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-4 mb-8 border-t border-white/10 pt-6">
            <div class="flex justify-between items-center text-sm">
              <span class="text-secondary font-medium">Selected Seats ({{ bookingStore.seatCount }})</span>
              <div class="flex gap-2 flex-wrap justify-end">
                <span v-for="seat in bookingStore.selectedSeats" :key="seat.id" class="bg-surface-300 border border-white/10 px-2 py-1 rounded text-white font-bold text-xs font-mono shadow-sm">
                    {{ seat.label }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between text-sm">
              <span class="text-secondary font-medium">Tickets Total</span>
              <span class="text-white font-bold text-right">${{ bookingStore.totalTicketPrice.toFixed(2) }}</span>
            </div>
            
             <div class="flex justify-between text-sm">
              <span class="text-secondary font-medium">Booking Fee</span>
              <span class="text-white font-bold">${{ bookingStore.totalBookingFee.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t border-dashed border-white/20">
              <span class="text-lg font-black text-white uppercase tracking-tight">Total</span>
              <span class="text-3xl font-black text-primary neon-text">${{ bookingStore.grandTotal.toFixed(2) }}</span>
            </div>
          </div>
          

          <button @click="handlePayment" :disabled="status === 'loading'" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(242,13,51,0.4)] hover:shadow-[0_0_30px_rgba(242,13,51,0.6)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] group uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed">
             <span v-if="status === 'loading'" class="material-symbols-outlined animate-spin">refresh</span>
             <span v-else>Pay Now</span>
             <span v-if="status !== 'loading'" class="material-symbols-outlined group-hover:lock transition-colors">lock</span>
          </button>
          
           <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs font-bold text-center">
             {{ error }}
           </div>

           <p class="text-center text-[10px] uppercase tracking-widest text-secondary/70 mt-6 font-bold">
              Refundable up to 2 hours before showtime
           </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue' // Ensure onMounted is imported
import { useBookingStore } from '@/stores/booking'
import { useBookingSubmit } from '@/composables/useBookingSubmit'
import { useRealtime } from '@/composables/useRealtime'

const bookingStore = useBookingStore()
const { submitBooking, status, error } = useBookingSubmit()
const { connect } = useRealtime()

onMounted(() => {
    connect()
})

const handlePayment = async () => {
    await submitBooking()
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 md:px-20 py-8 lg:py-12">
    <!-- Stepper -->
    <nav class="flex items-center gap-3 text-sm font-bold mb-12">
      <span class="text-primary/70 uppercase tracking-wider">{{ $t('pago.seatSelection' || 'Seat Selection') }}</span>
      <span class="text-white/20"><span class="material-symbols-outlined text-[14px]">chevron_right</span></span>
      <span class="text-primary/70 uppercase tracking-wider">{{ $t('pago.bookingDetails' || 'Booking Details') }}</span>
      <span class="text-white/20"><span class="material-symbols-outlined text-[14px]">chevron_right</span></span>
      <span class="text-white uppercase tracking-wider border-b-2 border-primary pb-0.5 glow-text">{{ $t('checkout.title') }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-white">
      <!-- Left Column: Payment Form -->
      <div class="lg:col-span-7 flex flex-col gap-8">
        <div>
          <h1 class="text-3xl md:text-5xl font-black tracking-tighter text-white mb-3 font-display uppercase">{{ $t('checkout.title') }}</h1>
          <p class="text-secondary text-lg">{{ $t('checkout.subtitle') }}</p>
        </div>

        <div class="space-y-8 bg-surface-100/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

          <h2 class="text-xl font-bold text-white flex items-center gap-3 relative z-10">
            <span class="material-symbols-outlined text-primary">credit_card</span>
            {{ $t('checkout.paymentMethod') }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div class="md:col-span-1 space-y-2 group">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1 group-focus-within:text-primary transition-colors">{{ $t('checkout.fullName') }} *</label>
              <input v-model="customerName" class="w-full h-14 bg-surface-200/50 border border-white/10 rounded-xl px-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_20px_rgba(242,13,51,0.15)] outline-none transition-all text-white placeholder-white/20 font-medium" :placeholder="$t('checkout.placeholderName')" type="text" required/>
            </div>
            <div class="md:col-span-1 space-y-2 group">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1 group-focus-within:text-primary transition-colors">{{ $t('checkout.email') }} *</label>
              <input v-model="customerEmail" class="w-full h-14 bg-surface-200/50 border border-white/10 rounded-xl px-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_20px_rgba(242,13,51,0.15)] outline-none transition-all text-white placeholder-white/20 font-medium" :placeholder="$t('checkout.placeholderEmail')" type="email" required/>
            </div>
            
            <div class="md:col-span-2 space-y-2 group mt-4">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1 group-focus-within:text-primary transition-colors">{{ $t('checkout.cardNumber') }}</label>
              <div class="relative">
                <input class="w-full h-14 bg-surface-200/50 border border-white/10 rounded-xl px-4 pr-12 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_20px_rgba(242,13,51,0.15)] outline-none transition-all text-white placeholder-white/20 font-medium font-mono text-lg tracking-widest" placeholder="0000 0000 0000 0000" type="text"/>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                  <span class="material-symbols-outlined text-primary/80">credit_card</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-2 group">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1 group-focus-within:text-primary transition-colors">{{ $t('checkout.expiryDate') }}</label>
              <input class="w-full h-14 bg-surface-200/50 border border-white/10 rounded-xl px-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_20px_rgba(242,13,51,0.15)] outline-none transition-all text-white placeholder-white/20 font-medium font-mono text-center tracking-widest" placeholder="MM/YY" type="text"/>
            </div>
            
            <div class="space-y-2 group">
              <label class="text-xs font-bold uppercase tracking-widest text-secondary ml-1 group-focus-within:text-primary transition-colors">{{ $t('checkout.cvv') }}</label>
              <div class="relative">
                <input class="w-full h-14 bg-surface-200/50 border border-white/10 rounded-xl px-4 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-surface-200 focus:shadow-[0_0_20px_rgba(242,13,51,0.15)] outline-none transition-all text-white placeholder-white/20 font-medium font-mono text-center tracking-widest" placeholder="***" type="password"/>
                <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-secondary text-lg cursor-help hover:text-white transition-colors">help</span>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3 relative z-10 backdrop-blur-md">
            <span class="material-symbols-outlined text-primary text-xl mt-0.5">lock</span>
            <p class="text-[11px] text-white/70 leading-relaxed font-medium uppercase tracking-wider">
              {{ $t('checkout.encryptionInfo') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Order Summary -->
      <aside class="lg:col-span-5 relative">
        <div class="absolute inset-0 bg-primary/5 blur-[50px] rounded-full pointer-events-none"></div>
        <div class="bg-surface-100/90 border border-white/10 rounded-3xl p-6 lg:p-8 sticky top-32 backdrop-blur-xl shadow-2xl relative z-10">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-black text-white uppercase tracking-tight">{{ $t('checkout.summary') }}</h2>
            
            <!-- Timer Display -->
            <div v-if="isActive" class="flex flex-col items-end">
              <span class="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">{{ $t('checkout.seatsHeld') }}</span>
              <div class="bg-primary/20 border border-primary/50 text-white font-mono font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(242,13,51,0.3)]">
                <span class="material-symbols-outlined text-[14px] text-primary animate-pulse">timer</span>
                {{ formattedTime }}
              </div>
            </div>
          </div>
          
          <div class="flex gap-5 mb-8 group">
            <div class="w-28 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-surface-200 shadow-2xl border border-white/10 relative">
               <!-- Mock Image -->
              <img v-if="movieDisplay.poster_url" :src="movieDisplay.poster_url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div v-else class="w-full h-full flex items-center justify-center text-white/20 font-bold text-xs uppercase">No Poster</div>
              <div class="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent"></div>
            </div>
            <div class="flex flex-col justify-center">
              <h3 class="text-xl font-black leading-tight mb-2 text-white font-display uppercase tracking-tighter">{{ movieDisplay.titulo }}</h3>
              <p class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded w-fit mb-3 uppercase tracking-widest">{{ storeRoomName }}</p>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2 text-xs text-secondary font-medium uppercase tracking-widest">
                  <span class="material-symbols-outlined text-[14px] text-primary/80">calendar_today</span>
                  <span>{{ storeDate }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-secondary font-medium uppercase tracking-widest">
                  <span class="material-symbols-outlined text-[14px] text-primary/80">schedule</span>
                  <span>20:30 (8:30 PM)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-4 mb-8 border-t border-white/10 pt-6">
            <div class="flex justify-between items-center text-sm">
              <span class="text-secondary font-medium uppercase tracking-widest text-xs">{{ $t('booking.seat') }}s ({{ bookingDisplay.seatCount }})</span>
              <div class="flex gap-2 flex-wrap justify-end">
                <span v-for="seat in bookingDisplay.selectedSeats" :key="seat.id" class="bg-surface-300 border border-white/10 px-2.5 py-1 rounded text-white font-bold text-[11px] font-mono shadow-sm">
                    {{ seat.label }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between text-sm py-1">
              <span class="text-secondary font-medium uppercase tracking-widest text-xs">Tickets</span>
              <span class="text-white font-bold text-right font-mono">${{ bookingDisplay.totalTicketPrice.toFixed(2) }}</span>
            </div>
            
             <div class="flex justify-between text-sm py-1">
              <span class="text-secondary font-medium uppercase tracking-widest text-xs">{{ $t('booking.fees') }}</span>
              <span class="text-white font-bold font-mono">${{ bookingDisplay.totalBookingFee.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between items-center pt-5 mt-2 border-t border-dashed border-white/20">
              <span class="text-lg font-black text-white uppercase tracking-tight">{{ $t('booking.total') }}</span>
              <span class="text-3xl font-black text-primary neon-text">${{ bookingDisplay.grandTotal.toFixed(2) }}</span>
            </div>
          </div>
          
          <button @click="handlePayment" :disabled="status === 'loading'" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(242,13,51,0.4)] hover:shadow-[0_0_30px_rgba(242,13,51,0.6)] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100">
             <span v-if="status === 'loading'" class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
             <span v-else>{{ $t('checkout.paySecurely') }}</span>
             <span v-if="status !== 'loading'" class="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">lock</span>
          </button>
          
           <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs font-bold text-center">
             {{ error }}
           </div>
 
           <p class="text-center text-[10px] uppercase tracking-widest text-secondary/50 mt-6 font-bold">
              {{ $t('checkout.nonRefundable') }}
           </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useBookingStore } from '@/stores/booking'
import { useI18n } from '@/composables/useI18n'
import { useBookingSubmit } from '@/composables/useBookingSubmit'
import { useRealtime } from '@/composables/useRealtime'
import { useBookingTimer } from '@/composables/useBookingTimer'

const { $t, locale } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()

const bookingStore = useBookingStore()
const { submitBooking, status, error } = useBookingSubmit()
const { connect } = useRealtime()
const { isActive, formattedTime } = useBookingTimer()

const customerName = ref('')
const customerEmail = ref('')

// Local caching for movie details to prevent UI tearing during page transitions (Vue best practices)
const movieDisplay = ref({
    titulo: 'Unknown Title',
    poster_url: null
})

const bookingDisplay = ref({
    seatCount: 0,
    selectedSeats: [],
    totalTicketPrice: 0,
    totalBookingFee: 0,
    grandTotal: 0,
    roomName: 'Standard Session'
})

// Watcher guarantees the component visually freezes its state instead of dropping it if pinia flushes
watch(() => bookingStore.currentMovie, (newMovie) => {
    if (newMovie && (newMovie.titulo || newMovie.title || newMovie.name)) {
        movieDisplay.value = {
            titulo: newMovie.titulo || newMovie.title || newMovie.name,
            poster_url: newMovie.poster_url || newMovie.poster || null
        }
    }
}, { immediate: true })

watch(() => bookingStore.selectedSeats, (newSeats) => {
    if (newSeats && newSeats.length > 0) {
        bookingDisplay.value = {
            seatCount: bookingStore.seatCount,
            selectedSeats: [...newSeats],
            totalTicketPrice: bookingStore.totalTicketPrice,
            totalBookingFee: bookingStore.totalBookingFee,
            grandTotal: bookingStore.grandTotal,
            roomName: 'Standard Session'
        }
    }
}, { immediate: true, deep: true })

const storeRoomName = computed(() => {
    return bookingDisplay.value.roomName
})

const storeDate = computed(() => {
    return new Date().toLocaleDateString(locale.value === 'en' ? 'en-US' : (locale.value === 'es' ? 'es-ES' : 'ca-ES'), { weekday: 'short', month: 'short', day: 'numeric' })
})

onMounted(() => {
    connect(route.params.id)
    
    // Fallback if data is lost on page refresh
    if (!bookingStore.currentMovie) {
        $fetch(`${config.public.apiBase || '/api'}/peliculas/${route.params.id}`)
            .then(res => {
                const movie = res.data || res
                bookingStore.setMovie(movie)
            })
            .catch(err => console.error("Failed to fetch movie:", err))
    }
})

const handlePayment = async () => {
    await submitBooking(customerName.value, customerEmail.value)
}
</script>

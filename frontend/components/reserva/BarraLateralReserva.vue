<template>
  <aside class="w-full lg:w-[400px] glass border-l border-white/5 p-8 flex flex-col justify-between h-auto lg:min-h-[calc(100vh-80px)] backdrop-blur-xl bg-surface-100/50">
    <div>
      <div class="flex justify-between items-start mb-8">
        <h3 class="text-xl font-black text-white uppercase tracking-tight">{{ $t('booking.orderSummary') }}</h3>
        
        <!-- Timer Display -->
        <div v-if="isActive" class="flex flex-col items-end">
          <span class="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">{{ $t('booking.seatsReserved') }}</span>
          <div class="bg-primary/20 border border-primary/50 text-white font-mono font-bold px-3 py-1 rounded-lg text-sm flex items-center gap-2 shadow-[0_0_10px_rgba(242,13,51,0.2)]">
            <span class="material-symbols-outlined text-[14px] text-primary">timer</span>
            {{ formattedTime }}
          </div>
        </div>
      </div>
      
      <!-- Selection Summary -->
      <div class="space-y-6">
          <!-- Movie Info -->
          <div class="flex items-start gap-4 p-4 rounded-xl bg-surface-200/50 border border-white/5">
              <div class="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-surface-300">
                  <img v-if="bookingStore.currentMovie?.poster_url" :src="bookingStore.currentMovie.poster_url" class="w-full h-full object-cover">
              </div>
              <div>
                  <h4 class="text-lg font-bold text-white leading-tight mb-2">{{ bookingStore.currentMovie?.titulo || 'Neon Demon' }}</h4>
                  <div class="flex flex-col gap-1">
                      <div class="flex items-center gap-1.5 text-[10px] text-secondary font-bold uppercase tracking-wider">
                          <span class="material-symbols-outlined text-[14px] text-primary">calendar_today</span>
                          Friday, Oct 25 • 8:30 PM
                      </div>
                      <div class="flex items-center gap-1.5 text-[10px] text-secondary font-bold uppercase tracking-wider">
                          <span class="material-symbols-outlined text-[14px] text-primary">location_on</span>
                          Grand Cinema, {{ $t('booking.hall') }} 4
                      </div>
                  </div>
              </div>
          </div>

          <!-- Selected Seats List -->
          <div class="space-y-3">
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{{ $t('booking.selectedSeats', { count: selectedSeats.length }) }}</p>
              <div v-if="selectedSeats.length > 0" class="flex flex-wrap gap-2">
                  <div v-for="seat in selectedSeats" :key="seat.id" class="group relative px-3 py-1.5 rounded-lg bg-surface-300 border border-white/10 flex items-center gap-2 animate-fade-in">
                      <span class="font-mono text-xs font-bold text-white">{{ seat.label }}</span>
                      <button @click="emit('remove', seat)" class="text-white/30 hover:text-primary transition-colors">
                          <span class="material-symbols-outlined text-[16px]">close</span>
                      </button>
                  </div>
              </div>
              <div v-else class="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-white/20">
                  <span class="material-symbols-outlined text-4xl mb-2">event_seat</span>
                  <p class="text-[10px] font-bold uppercase tracking-widest">{{ $t('booking.noSeatsSelected') }}</p>
              </div>
          </div>
      </div>
    </div>

    <!-- Summary Footer -->
    <div class="pt-8 border-t border-white/10 space-y-6">
        <div class="space-y-3">
            <div v-if="selectedSeats.length > 0" class="flex justify-between items-center text-sm">
                <span class="text-secondary font-medium">{{ selectedSeats.length }}x Tickets</span>
                <span class="text-white font-bold font-mono">${{ bookingStore.totalTicketPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
                <span class="text-secondary font-medium">{{ $t('booking.fees') }}</span>
                <span class="text-white font-bold font-mono">${{ bookingStore.totalBookingFee.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between items-end pt-4 border-t border-dashed border-white/20">
                <span class="text-lg font-bold uppercase tracking-tight text-white">{{ $t('booking.total') }}</span>
                <span class="text-3xl font-black text-primary neon-text">${{ bookingStore.grandTotal.toFixed(2) }}</span>
            </div>
        </div>

        <button 
            @click="emit('next')"
            :disabled="selectedSeats.length === 0"
            class="w-full h-16 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(242,13,51,0.4)] hover:shadow-[0_0_30px_rgba(242,13,51,0.6)] flex items-center justify-center gap-3 group"
        >
            <span>{{ $t('booking.proceedPayment') }}</span>
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
    </div>
  </aside>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { useBookingTimer } from '@/composables/useBookingTimer'
import { useI18n } from '@/composables/useI18n'

const props = defineProps({
  selectedSeats: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove', 'next'])

const { $t } = useI18n()
const bookingStore = useBookingStore()
const { startTimer, clearTimer, formattedTime, isActive } = useBookingTimer()

watch(() => props.selectedSeats.length, (newLength) => {
    if (newLength > 0 && !isActive.value) {
        startTimer()
    } else if (newLength === 0 && isActive.value) {
        clearTimer()
    }
})

onMounted(() => {
    if (props.selectedSeats.length > 0 && !isActive.value) {
        startTimer()
    }
})
</script>

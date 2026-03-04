<template>
  <div class="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
    <!-- Main Content: Ticket Types -->
    <div class="flex-1 p-6 lg:p-12 overflow-y-auto no-scrollbar">
      <!-- Progress Stepper -->
      <div class="mb-10 max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-bold tracking-widest uppercase text-secondary">Step 2 of 3: Ticket Selection</span>
          <span class="text-sm font-black text-primary">60%</span>
        </div>
        <div class="w-full bg-surface-200 h-1.5 rounded-full overflow-hidden">
          <div class="bg-primary h-full w-[60%] shadow-[0_0_10px_rgba(242,13,51,0.5)] transition-all duration-500"></div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h2 class="text-3xl font-black mb-2 tracking-tight text-white uppercase font-display">How many tickets?</h2>
          <p class="text-secondary text-lg">
            You've selected <span class="text-white font-bold">{{ bookingStore.selectedSeats.length }}</span> seats: 
            <span class="text-primary font-mono bg-primary/10 border border-primary/20 px-2 py-0.5 rounded ml-1 text-sm">
              {{ bookingStore.selectedSeats.map(s => s.label).join(', ') }}
            </span>
          </p>
        </div>

        <!-- Seat - Ticket Assignment List -->
        <div class="space-y-4">
           <!-- Loop through selected seats to assign tickets -->
           <div v-for="seat in bookingStore.selectedSeats" :key="seat.id" class="p-6 rounded-xl border border-white/5 bg-surface-100/50 hover:bg-surface-100 hover:border-primary/30 transition-all duration-300 group shadow-lg">
              <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div class="flex items-center gap-5 w-full md:w-auto">
                      <div class="size-16 rounded-xl bg-surface-200 border border-white/5 flex items-center justify-center text-secondary group-hover:text-primary group-hover:border-primary/50 transition-all font-black text-2xl shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                          {{ seat.label }}
                      </div>
                      <div>
                          <h3 class="text-lg font-bold text-white mb-1">Seat {{ seat.label }} <span class="text-xs font-normal text-secondary uppercase tracking-wider ml-2 border border-white/10 px-2 py-0.5 rounded">{{ seat.type }}</span></h3>
                          <p class="text-sm text-secondary font-medium">Row {{ seat.row }} • Seat {{ seat.number }}</p>
                      </div>
                  </div>
                  
                  <!-- Ticket Type Selector for this Seat -->
                  <div class="w-full md:w-auto">
                      <div class="relative">
                        <select 
                          :value="bookingStore.selectedTickets[seat.id]?.id || ''" 
                          @change="(e) => selectTicketForSeat(seat.id, e.target.value)"
                          class="w-full md:w-64 bg-surface-300/50 border border-white/10 text-white rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer hover:bg-surface-300 transition-colors"
                        >
                            <option value="" disabled>Select Ticket Type</option>
                            <option v-for="type in availableTicketTypes" :key="type.id" :value="type.id">
                                {{ type.name }} — ${{ type.price.toFixed(2) }}
                            </option>
                        </select>
                        <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">expand_more</span>
                      </div>
                  </div>
              </div>
           </div>
        </div>

        <div class="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-4 items-center">
          <div class="p-2 bg-primary/10 rounded-full text-primary">
            <span class="material-symbols-outlined">info</span>
          </div>
          <p class="text-sm text-secondary">
            Please select a ticket type for all <strong class="text-white">{{ bookingStore.selectedSeats.length }}</strong> seats to proceed.
            Count: <strong class="text-primary">{{ assignedCount }}/{{ bookingStore.selectedSeats.length }}</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Sidebar Summary -->
    <aside class="w-full lg:w-[400px] glass border-l border-white/5 p-8 flex flex-col justify-between h-auto lg:h-[calc(100vh-80px)] backdrop-blur-xl bg-surface-100/50 sticky top-[80px]">
        <div>
             <div class="flex justify-between items-start mb-8">
               <h3 class="text-xl font-black text-white uppercase tracking-tight">Order Summary</h3>
               
               <!-- Timer Display -->
               <div v-if="isActive" class="flex flex-col items-end">
                 <span class="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Seats Reserved</span>
                 <div class="bg-primary/20 border border-primary/50 text-white font-mono font-bold px-3 py-1 rounded-lg text-sm flex items-center gap-2 shadow-[0_0_10px_rgba(242,13,51,0.2)]">
                   <span class="material-symbols-outlined text-[14px] text-primary">timer</span>
                   {{ formattedTime }}
                 </div>
               </div>
             </div>
        
            <!-- Summary Content -->
            <div class="space-y-8">
                  <div class="space-y-4">
                      <div class="flex items-start gap-4 text-sm text-secondary group">
                          <div class="p-2 rounded bg-surface-200 text-primary group-hover:scale-110 transition-transform">
                             <span class="material-symbols-outlined text-lg">movie</span>
                          </div>
                          <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Movie</p>
                            <span class="text-white font-bold text-lg leading-tight block">{{ bookingStore.currentMovie?.titulo || 'Neon Demon' }}</span>
                          </div>
                      </div>
                      <div class="flex items-start gap-4 text-sm text-secondary group">
                          <div class="p-2 rounded bg-surface-200 text-primary group-hover:scale-110 transition-transform">
                             <span class="material-symbols-outlined text-lg">calendar_today</span>
                          </div>
                          <div>
                            <p class="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Date & Time</p>
                            <span class="text-white font-medium">Friday, Oct 25 • 8:30 PM</span>
                          </div>
                      </div>
                      <div class="flex items-start gap-4 text-sm text-secondary group">
                          <div class="p-2 rounded bg-surface-200 text-primary group-hover:scale-110 transition-transform">
                             <span class="material-symbols-outlined text-lg">location_on</span>
                          </div>
                          <div>
                             <p class="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Theater</p>
                             <span class="text-white font-medium">Grand Cinema, Hall 4</span>
                          </div>
                      </div>
                  </div>

                  <div class="pt-8 border-t border-white/10 space-y-4">
                      <div class="flex justify-between text-sm items-center" v-for="(ticket, seatId) in bookingStore.selectedTickets" :key="seatId">
                          <span class="text-secondary font-medium">1x {{ ticket.name }} <span class="text-xs bg-white/5 px-1.5 py-0.5 rounded ml-1">{{ bookingStore.selectedSeats.find(s => s.id === seatId)?.label }}</span></span>
                          <span class="font-bold text-white">${{ ticket.price.toFixed(2) }}</span>
                      </div>
                      
                      <div class="flex justify-between text-sm items-center">
                          <span class="text-secondary font-medium">Booking Fees</span>
                          <span class="font-bold text-white">${{ bookingStore.totalBookingFee.toFixed(2) }}</span>
                      </div>

                      <div class="flex justify-between items-end pt-4 border-t border-dashed border-white/20">
                          <span class="text-lg font-bold uppercase tracking-tight text-white">Total</span>
                          <span class="text-3xl font-black text-primary neon-text">${{ bookingStore.grandTotal.toFixed(2) }}</span>
                      </div>
                  </div>
            </div>
        </div>

        <button 
          @click="handleNext"
          :disabled="assignedCount !== bookingStore.selectedSeats.length"
          class="w-full h-16 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(242,13,51,0.4)] hover:shadow-[0_0_30px_rgba(242,13,51,0.6)] flex items-center justify-center gap-3 group mt-8"
        >
            <span>Proceed to Payment</span>
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import { useBooking } from '@/composables/useBooking'
import { useBookingTimer } from '@/composables/useBookingTimer'

const route = useRoute()

const bookingStore = useBookingStore()
const { nextStep } = useBooking()
const { formattedTime, isActive } = useBookingTimer()

const availableTicketTypes = [
    { id: 'adult', name: 'General Admission', price: 12.50 },
    { id: 'child', name: 'Child (3-12)', price: 10.00 },
    { id: 'member', name: 'Member Price', price: 12.00 },
    { id: 'senior', name: 'Senior (65+)', price: 10.00 },
    { id: 'student', name: 'Student', price: 12.50 },
    { id: 'vip', name: 'VIP Experience', price: 18.50 },
    { id: 'accessible', name: 'Accessible Seat', price: 10.00 }
]

const selectTicketForSeat = (seatId, ticketTypeId) => {
    const ticket = availableTicketTypes.find(t => t.id === ticketTypeId)
    if (ticket) {
        bookingStore.setTicketType(seatId, ticket)
    }
}

const assignedCount = computed(() => Object.keys(bookingStore.selectedTickets).length)

onMounted(() => {
    // Fallback if data is lost on page refresh
    if (!bookingStore.currentMovie) {
        const config = useRuntimeConfig()
        $fetch(`${config.public.apiBase || '/api'}/pelicula/${route.params.id}`)
            .then(res => {
                const movie = res.data || res
                bookingStore.setMovie(movie)
            })
            .catch(err => console.error("Failed to fetch movie:", err))
    }
})

const handleNext = () => {
    nextStep('tickets')
}
</script>

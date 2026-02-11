<template>
  <div class="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
    <!-- Main Content: Ticket Types -->
    <div class="flex-1 p-6 lg:p-12 overflow-y-auto no-scrollbar">
      <!-- Progress Stepper -->
      <div class="mb-10 max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Step 2 of 3: Ticket Selection</span>
          <span class="text-sm font-bold text-primary">60%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-border-dark h-1.5 rounded-full overflow-hidden">
          <div class="bg-primary h-full w-[60%] transition-all duration-500"></div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h2 class="text-3xl font-black mb-2 tracking-tight text-white">How many tickets?</h2>
          <p class="text-gray-500 dark:text-gray-400">
            You've selected <span class="text-white font-bold">{{ bookingStore.selectedSeats.length }}</span> seats: 
            <span class="text-white font-mono bg-border-dark px-2 py-0.5 rounded ml-1">
              {{ bookingStore.selectedSeats.map(s => s.label).join(', ') }}
            </span>
            <br>
            Please assign a ticket type to each seat below.
          </p>
        </div>

        <!-- Seat - Ticket Assignment List -->
        <div class="space-y-6">
           <!-- Loop through selected seats to assign tickets -->
           <div v-for="seat in bookingStore.selectedSeats" :key="seat.id" class="p-6 rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-card-dark transition-all neon-border group">
              <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div class="flex items-center gap-5">
                      <div class="size-14 rounded-lg bg-gray-100 dark:bg-border-dark flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors font-bold text-xl">
                          {{ seat.label }}
                      </div>
                      <div>
                          <h3 class="text-lg font-bold text-white">Seat {{ seat.label }} ({{ seat.type }})</h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">Row {{ seat.row }} • Seat {{ seat.number }}</p>
                      </div>
                  </div>
                  
                  <!-- Ticket Type Selector for this Seat -->
                  <div class="flex items-center gap-4">
                      <select 
                        :value="bookingStore.selectedTickets[seat.id]?.id || ''" 
                        @change="(e) => selectTicketForSeat(seat.id, e.target.value)"
                        class="bg-background-dark border border-border-dark text-white rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                      >
                          <option value="" disabled>Select Type</option>
                          <option v-for="type in availableTicketTypes" :key="type.id" :value="type.id">
                              {{ type.name }} - ${{ type.price }}
                          </option>
                      </select>
                  </div>
              </div>
           </div>
        </div>

        <div class="mt-8 p-4 bg-primary/10 rounded-lg flex gap-3 border border-primary/20">
          <span class="material-symbols-outlined text-primary">info</span>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Total tickets assigned: {{ assignedCount }}/{{ bookingStore.selectedSeats.length }}.
          </p>
        </div>
      </div>
    </div>

    <!-- Sidebar Summary -->
    <aside class="w-full lg:w-[400px] bg-white dark:bg-card-dark border-l border-gray-200 dark:border-border-dark p-6 lg:p-8 sticky top-0 h-screen overflow-y-auto">
        <div class="sticky top-0 bg-white dark:bg-card-dark z-10 pb-4">
             <h3 class="text-xl font-black text-white mb-6">Order Summary</h3>
        </div>
        
        <!-- Summary Content -->
        <div class="space-y-6">
              <div class="space-y-3">
                  <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span class="material-symbols-outlined text-sm text-primary">movie</span>
                      <span class="text-white font-bold">{{ bookingStore.currentMovie?.title || 'Neon Demon' }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span class="material-symbols-outlined text-sm text-primary">calendar_today</span>
                      <span>Friday, Oct 25 • 8:30 PM</span>
                  </div>
                   <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span class="material-symbols-outlined text-sm text-primary">location_on</span>
                      <span>Grand Cinema, Screen 4</span>
                  </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-border-dark space-y-3">
                  <div class="flex justify-between text-sm" v-for="(ticket, seatId) in bookingStore.selectedTickets" :key="seatId">
                      <span class="text-gray-500 dark:text-gray-400">1x {{ ticket.name }} ({{ bookingStore.selectedSeats.find(s => s.id === seatId)?.label }})</span>
                      <span class="font-medium text-white">${{ ticket.price.toFixed(2) }}</span>
                  </div>
                  
                   <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Booking Fees</span>
                      <span class="font-medium text-white">${{ bookingStore.totalBookingFee.toFixed(2) }}</span>
                  </div>

                  <div class="flex justify-between pt-3 border-t border-gray-200 dark:border-border-dark">
                      <span class="text-lg font-bold uppercase tracking-tight text-white">Total</span>
                      <span class="text-2xl font-black text-primary">${{ bookingStore.grandTotal.toFixed(2) }}</span>
                  </div>
              </div>

              <button 
                @click="handleNext"
                :disabled="assignedCount !== bookingStore.selectedSeats.length"
                class="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-lg uppercase tracking-widest transition-all neon-shadow flex items-center justify-center gap-2 group"
              >
                  <span>Proceed to Payment</span>
                  <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
        </div>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { useBooking } from '@/composables/useBooking'

const bookingStore = useBookingStore()
const { nextStep } = useBooking()

const availableTicketTypes = [
    { id: 'adult', name: 'General Admission', price: 15.00 },
    { id: 'child', name: 'Child (3-12)', price: 10.00 },
    { id: 'member', name: 'Member Price', price: 12.00 },
    { id: 'senior', name: 'Senior (65+)', price: 10.00 },
    { id: 'student', name: 'Student', price: 12.50 },
//    { id: 'vip', name: 'VIP Experience', price: 20.00 } // Could be tied to seat type?
]

const selectTicketForSeat = (seatId, ticketTypeId) => {
    const ticket = availableTicketTypes.find(t => t.id === ticketTypeId)
    if (ticket) {
        bookingStore.setTicketType(seatId, ticket)
    }
}

const assignedCount = computed(() => Object.keys(bookingStore.selectedTickets).length)

const handleNext = () => {
    nextStep('tickets')
}
</script>

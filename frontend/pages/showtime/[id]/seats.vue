<template>
  <div class="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
    <!-- Left Section: Seating Chart -->
    <section class="flex-1 flex flex-col items-center p-6 lg:p-12 overflow-y-auto no-scrollbar">
      <!-- Position in Queue Badge (Mock) -->
      <div class="mb-8 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest animate-pulse">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live Session
        </div>
        <div class="mt-8 text-center" v-if="movie">
          <h1 class="text-3xl font-black uppercase tracking-tighter">{{ movie.title }}</h1>
          <p class="text-white/40 text-sm mt-1 uppercase tracking-[0.2em]">Hall 4 • Today, 8:30 PM • 4K Dolby Atmos</p>
        </div>
      </div>

      <SeatMap 
        :rows="seatRows" 
        :selected-seats="bookingStore.selectedSeats"
        :locked-seats="lockedSeats"
        :cursors="cursors"
        @toggle-seat="toggleSeat"
        @mouse-move="handleMouseMove"
      />
    </section>

    <!-- Right Section: Sidebar -->
    <aside class="w-full lg:w-[400px] bg-white/[0.03] border-l border-white/10 p-8 flex flex-col justify-between h-auto lg:min-h-[calc(100vh-80px)]">
      <div>
        <h3 class="text-lg font-bold uppercase tracking-tight mb-8">Your Selection</h3>
        
        <div v-if="bookingStore.selectedSeats.length === 0" class="text-white/30 text-sm text-center py-10">
          Select seats to proceed
        </div>

        <div class="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="seat in bookingStore.selectedSeats" :key="seat.id" 
               class="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 animate-fade-in-up">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">
                {{ seat.label }}
              </div>
              <div>
                <p class="text-sm font-bold">{{ getSeatTypeLabel(seat.type) }}</p>
                <p class="text-xs text-white/40 uppercase">Row {{ seat.row }} • Seat {{ seat.number }}</p>
              </div>
            </div>
            <div class="text-right">
              <button @click="toggleSeat(seat)" class="text-white/60 hover:text-white transition-colors">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-white/10 space-y-6">
        <div class="flex justify-between items-end">
          <span class="text-xs text-white/40 uppercase tracking-widest">Total Seats</span>
          <span class="text-3xl font-black text-white">{{ bookingStore.selectedSeats.length }}</span>
        </div>
        
        <button 
          @click="handleNext"
          :disabled="bookingStore.selectedSeats.length === 0"
          class="w-full h-16 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] neon-glow text-white"
        >
          <span class="text-sm font-black uppercase tracking-widest">Select Tickets</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
        
        <p class="text-[10px] text-center text-white/30 uppercase tracking-tight">
           By proceeding, you agree to our <a href="#" class="underline hover:text-white">Refund Policy</a>
        </p>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRealtime } from '@/composables/useRealtime'
import { useWebRTC } from '@/composables/useWebRTC' // Import WebRTC composable

const route = useRoute()
const bookingStore = useBookingStore()
const { nextStep } = useBooking()
const { socket, isConnected, lockedSeats, activeUsers, connect, disconnect, lockSeat, unlockSeat } = useRealtime()
const { initWebRTC, bindEvents, cleanup, sendCursorUpdate, cursors } = useWebRTC(socket)

// Connect on mount
onMounted(() => {
    connect()
    bindEvents() // Bind WebRTC signal listeners
    
    // Mock Move Data if empty
    if (!bookingStore.currentMovie) {
        bookingStore.setMovie({ id: 1, title: 'Neon Demon', poster: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' })
    }
})

onUnmounted(() => {
    cleanup() // Cleanup WebRTC
    disconnect()
})

// Watch for access granted to initialize peers
watch(activeUsers, (users) => {
    if (users && users.length > 0) {
        initWebRTC(users)
    }
})

const handleMouseMove = ({ x, y }) => {
    if (isConnected.value) {
        sendCursorUpdate(x, y)
    }
}


// Mock Data Generation
const generateRows = () => {
  const rows = []
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  
  rowLabels.forEach((label, rowIndex) => {
    const seats = []
    const seatsInRow = 10 
    
    for (let i = 1; i <= seatsInRow; i++) {
        let type = 'standard'
        if (rowIndex === 0) type = 'disabled'
        if (rowIndex === 2) type = 'vip'

        // Mock some occupied seats
        let status = 'available'
        // if (Math.random() > 0.8) status = 'occupied' // Disable random mock occupancy to test realtime

        seats.push({
            id: `${label}${i}`,
            label: `${label}${i}`,
            row: label,
            number: i,
            type: type,
            status: status,
            price: type === 'vip' ? 18.50 : (type === 'disabled' ? 10.00 : 12.50) 
        })
    }
    rows.push({ label, seats })
  })
  return rows
}

const seatRows = ref(generateRows())
const movie = computed(() => bookingStore.currentMovie)

const toggleSeat = (seat) => {
  if (bookingStore.selectedSeats.some(s => s.id === seat.id)) {
      // Unselecting
      unlockSeat(seat.id)
      bookingStore.toggleSeat(seat)
  } else {
      // Selecting
      lockSeat(seat.id)
      bookingStore.toggleSeat(seat)
  }
}


const getSeatTypeLabel = (type) => {
  switch(type) {
    case 'vip': return 'VIP Seat'
    case 'disabled': return 'Accessible Seat'
    default: return 'Standard Seat'
  }
}

const handleNext = () => {
    nextStep('seats')
}

// Initialize store if needed (mock)
onMounted(() => {
    if (!bookingStore.currentMovie) {
        bookingStore.setMovie({ id: 1, title: 'Neon Demon', poster: 'https://...' })
    }
})
</script>

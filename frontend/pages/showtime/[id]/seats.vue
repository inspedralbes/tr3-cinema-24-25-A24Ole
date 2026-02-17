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
        <div class="mt-8 text-center" v-if="bookingStore.currentMovie">
          <h1 class="text-3xl font-black uppercase tracking-tighter">{{ bookingStore.currentMovie.title }}</h1>
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
    <BookingSidebar 
      :selected-seats="bookingStore.selectedSeats" 
      @remove="toggleSeat"
      @next="handleNext"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import { useBooking } from '@/composables/useBooking'
import { useRealtime } from '@/composables/useRealtime'
import { useWebRTC } from '@/composables/useWebRTC'
import { useSeatLogic } from '@/composables/useSeatLogic'
import BookingSidebar from '@/components/booking/BookingSidebar.vue'
import SeatMap from '@/components/SeatMap.vue'

const route = useRoute()
const bookingStore = useBookingStore()
const { nextStep } = useBooking()
const { toggleSeat } = useSeatLogic()
const { socket, isConnected, lockedSeats, activeUsers, connect, disconnect } = useRealtime()
const { initWebRTC, bindEvents, cleanup, sendCursorUpdate, cursors } = useWebRTC(socket)

// Connect on mount
onMounted(() => {
    connect()
    bindEvents() // Bind WebRTC signal listeners
    
    // Mock Move Data if empty
    if (!bookingStore.currentMovie) {
        bookingStore.setMovie({ 
          id: 1, 
          title: 'Neon Demon', 
          poster: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', 
          genre: 'Sci-Fi', 
          duration: '2h', 
        })
    }
})

onUnmounted(() => {
    cleanup() // Cleanup WebRTC
    // disconnect() // Keep socket connected for Checkout
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

const handleNext = () => {
    nextStep('seats')
}

// Mock Data Generation
const generateRows = () => {
  const rows = []
  const rowLabels = ['A', 'B', 'C', 'D', 'E'] // 5 rows to match backend Sala A
  
  rowLabels.forEach((label, rowIndex) => {
    const seats = []
    const seatsInRow = 10 // 10 columns to match backend Sala A
    
    for (let i = 1; i <= seatsInRow; i++) {
        let type = 'standard'
        if (rowIndex === 0) type = 'disabled' // First row (A)
        if (rowIndex === 2) type = 'vip'      // Third row (C)

        let status = 'available'

        // Calculate ID based on Sala A layout (5 rows, 10 cols)
        // IDs: 1-10 (Row A), 11-20 (Row B), etc.
        const seatId = (rowIndex * 10) + i

        seats.push({
            id: seatId, // Send integer ID to backend
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
</script>

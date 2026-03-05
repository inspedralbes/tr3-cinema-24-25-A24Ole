<template>
  <div class="w-full flex flex-col items-center" @mousemove="handleMouseMove">
    <!-- Screen Representation -->
    <div class="w-full max-w-2xl mb-14 relative">
      <div class="screen-curve h-12 w-full flex items-end justify-center">
        <span class="text-[10px] text-white/30 uppercase tracking-[0.4em] mb-2">Screen</span>
      </div>
    </div>

    <!-- Seat Legend -->
    <div class="flex flex-wrap justify-center gap-8 mb-12">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded border border-white/40"></div>
        <span class="text-[10px] uppercase text-white/60 font-bold">Available</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-primary seat-selected"></div>
        <span class="text-[10px] uppercase text-white/60 font-bold">Selected</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-white/20"></div>
        <span class="text-[10px] uppercase text-white/60 font-bold">Occupied</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-[14px] text-white/40">lock</span>
        </div>
        <span class="text-[10px] uppercase text-white/60 font-bold">Blocked</span>
      </div>
      <!-- Types Legend -->
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded border border-yellow-500/50"></div>
        <span class="text-[10px] uppercase text-white/60 font-bold">VIP</span>
      </div>
       <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded border border-blue-500/50"></div>
        <span class="text-[10px] uppercase text-white/60 font-bold">Accessible</span>
      </div>
    </div>

    <!-- Seating Grid -->
    <div class="grid gap-4 select-none">
      <div v-for="row in rows" :key="row.label" class="flex items-center gap-6">
        <span class="text-white/20 text-xs font-bold w-4">{{ row.label }}</span>
        <div class="flex gap-3">
          <button
            v-for="seat in row.seats"
            :key="seat.id"
            @click="handleSeatClick(seat)"
            :disabled="seat.status === 'occupied' || seat.status === 'blocked' || isLockedByOther(seat)"
            class="w-8 h-8 rounded transition-all duration-300 flex items-center justify-center relative group"
            :class="getSeatClasses(seat)"
          >
            <!-- VIP Indicator -->
            <span v-if="seat.type === 'vip'" class="absolute -top-1 -right-1 flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>

             <!-- Accessible Icon -->
            <span v-if="seat.type === 'disabled'" class="material-symbols-outlined text-[14px] text-blue-400/80">accessible</span>

            <!-- Lock Icon for Blocked -->
            <span v-if="seat.status === 'blocked' || isLockedByOther(seat)" class="material-symbols-outlined text-[14px] text-white/40">lock</span>
          </button>
        </div>
        <span class="text-white/20 text-xs font-bold w-4">{{ row.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rows: {
    type: Array,
    required: true
  },
  selectedSeats: {
    type: Array,
    required: true
  },
  lockedSeats: {
    type: Object, // Set
    default: () => new Set()
  },
  cursors: {
    type: Map,
    default: () => new Map()
  }
})

const emit = defineEmits(['toggle-seat', 'mouse-move'])

const handleMouseMove = (e) => {
  try {
    const target = e.currentTarget || e.target
    if (!target || typeof target.getBoundingClientRect !== 'function') return
    const rect = target.getBoundingClientRect()
    if (!rect || rect.left === undefined || rect.top === undefined) return
    if (e.clientX === undefined || e.clientY === undefined) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    emit('mouse-move', { x, y })
  } catch (err) {
    // Ignore synthetic Cypress event payload errors 
  }
}

const isLockedByOther = (seat) => {
  return props.lockedSeats.has(seat.id) && !props.selectedSeats.some(s => s.id === seat.id)
}

const handleSeatClick = (seat) => {
  if (seat.status === 'available' && !props.lockedSeats.has(seat.id)) {
    emit('toggle-seat', seat)
  }
}

const getSeatClasses = (seat) => {
  const isSelected = props.selectedSeats.some(s => s.id === seat.id)
  
  // Real-time lock check
  if (props.lockedSeats.has(seat.id) && !isSelected) {
      return 'bg-white/10 cursor-not-allowed border border-white/20' // Blocked style
  }
  
  if (seat.status === 'occupied') {
    return 'bg-white/20 cursor-not-allowed'
  }
  
  if (seat.status === 'blocked') {
    return 'bg-white/10 cursor-not-allowed'
  }

  if (isSelected) {
    return 'bg-primary shadow-[0_0_15px_rgba(242,13,51,0.6)] scale-110 z-10 border border-primary'
  }

  // Available styles based on type
  if (seat.type === 'vip') {
    return 'border border-yellow-500/50 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:bg-yellow-500/10 cursor-pointer'
  }
  
  if (seat.type === 'disabled') {
    return 'border border-blue-500/50 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:bg-blue-500/10 cursor-pointer'
  }

  return 'border border-white/20 hover:border-primary hover:shadow-[0_0_10px_rgba(242,13,51,0.4)] hover:bg-primary/10 cursor-pointer'
}
</script>

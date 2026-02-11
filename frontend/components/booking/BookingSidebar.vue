<template>
  <aside class="w-full lg:w-[400px] glass border-l border-white/5 p-8 flex flex-col justify-between h-auto lg:min-h-[calc(100vh-80px)] backdrop-blur-xl bg-surface-100/50">
    <div>
      <h3 class="text-lg font-bold uppercase tracking-tight mb-8 flex items-center gap-3">
        <span class="w-1 h-6 bg-primary rounded-full shadow-[0_0_8px_rgba(242,13,51,0.8)]"></span>
        Your Selection
      </h3>
      
      <div v-if="selectedSeats.length === 0" class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
        <span class="material-symbols-outlined text-4xl text-white/20 mb-3">event_seat</span>
        <p class="text-white/30 text-sm font-medium">Select seats on the map<br>to proceed with booking</p>
      </div>

      <div class="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        <div v-for="seat in selectedSeats" :key="seat.id" 
             class="flex items-center justify-between p-4 rounded-xl bg-surface-200/50 border border-white/5 hover:border-primary/30 transition-colors animate-fade-in group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/20 border border-primary/50 text-primary flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(242,13,51,0.2)]">
              {{ seat.label }}
            </div>
            <div>
              <p class="text-sm font-bold text-white group-hover:text-primary transition-colors">{{ getSeatTypeLabel(seat.type) }}</p>
              <div class="flex items-center gap-2 mt-1">
                 <p class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 uppercase font-bold tracking-wider">Row {{ seat.row }}</p>
                 <p class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 uppercase font-bold tracking-wider">Seat {{ seat.number }}</p>
              </div>
            </div>
          </div>
          <div class="text-right">
            <button @click="emit('remove', seat)" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-8 border-t border-white/10 space-y-6">
      <div class="flex justify-between items-end">
        <span class="text-xs text-white/40 uppercase tracking-widest font-bold">Total Seats</span>
        <div class="flex items-baseline gap-1">
           <span class="text-4xl font-black text-white tracking-tighter">{{ selectedSeats.length }}</span>
           <span class="text-sm text-white/40 font-medium">/ 8</span>
        </div>
      </div>
      
      <button 
        @click="emit('next')"
        :disabled="selectedSeats.length === 0"
        class="group w-full h-16 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(242,13,51,0.4)] hover:shadow-[0_0_30px_rgba(242,13,51,0.6)] text-white relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <span class="text-sm font-black uppercase tracking-widest relative z-10">Select Tickets</span>
        <span class="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </button>
      
      <p class="text-[10px] text-center text-white/30 uppercase tracking-tight">
         By proceeding, you agree to our <a href="#" class="underline hover:text-white transition-colors">Refund Policy</a>
      </p>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  selectedSeats: Array
})

const emit = defineEmits(['remove', 'next'])

const getSeatTypeLabel = (type) => {
  switch(type) {
    case 'vip': return 'VIP Seat'
    case 'disabled': return 'Accessible Seat'
    default: return 'Standard Seat'
  }
}
</script>

<template>
  <NuxtLink :to="`/showtime/${movie.id}/seats`" class="group relative block rounded-xl overflow-hidden bg-surface-100 border border-white/5 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(242,13,51,0.15)]">
    <!-- Poster Image -->
    <div class="aspect-[2/3] w-full relative overflow-hidden">
      <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1">
      
      <!-- Gradient Overlay (Always visible but stronger on hover) -->
      <div class="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      
      <!-- Content Container -->
      <div class="absolute inset-x-0 bottom-0 p-6 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
        <!-- Badge -->
        <span class="inline-block px-2 py-1 mb-3 text-[10px] font-bold tracking-widest text-primary border border-primary/30 rounded uppercase bg-primary/10 backdrop-blur-sm">
          {{ movie.duration }}
        </span>

        <!-- Title -->
        <h3 class="text-xl font-bold text-white leading-tight mb-1 font-display group-hover:text-primary transition-colors">{{ movie.title }}</h3>
        
        <!-- Genre -->
        <p class="text-sm text-gray-400 mb-4">{{ movie.genre }}</p>

        <!-- CTA Button (Hidden until hover/focus) -->
        <div class="opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button class="w-full py-3 bg-primary text-white font-bold uppercase text-xs tracking-widest rounded-lg shadow-[0_0_15px_rgba(242,13,51,0.4)] hover:bg-red-600 hover:shadow-[0_0_25px_rgba(242,13,51,0.6)] transition-all flex items-center justify-center gap-2">
            <span>Book Seats</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  movie: {
    type: Object,
    required: true
  }
})
</script>

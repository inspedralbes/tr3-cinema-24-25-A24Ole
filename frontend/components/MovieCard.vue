<template>
  <div class="group relative rounded-xl overflow-hidden cursor-pointer neon-glow bg-card-dark border border-border-dark transition-all hover:-translate-y-2">
    <!-- Poster -->
    <div class="aspect-[2/3] w-full relative overflow-hidden">
      <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 transition-opacity"></div>
      
      <div class="absolute bottom-0 left-0 w-full p-4 transform translate-y-0 transition-transform">
        <h3 class="text-xl font-bold text-white leading-tight mb-1">{{ movie.title }}</h3>
        <p class="text-xs text-gray-400 uppercase tracking-wider mb-3">{{ movie.genre }} • {{ movie.duration }}</p>
        
        <NuxtLink :to="`/showtime/${movie.id}/seats`" class="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest rounded flex items-center justify-center gap-2 transition-colors">
          Book Now
          <span class="material-symbols-outlined text-base">confirmation_number</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  movie: {
    type: Object,
    required: true
  }
})
</script>

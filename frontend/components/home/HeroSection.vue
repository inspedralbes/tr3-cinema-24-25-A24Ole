<template>
  <div class="relative w-full h-[70vh] flex items-end pb-20 px-6 lg:px-12 mb-20 overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img src="https://image.tmdb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg" alt="Hero" class="w-full h-full object-cover opacity-60">
      <div class="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-void via-void/50 to-transparent"></div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 max-w-4xl animate-fade-in">
      <span class="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-[0.2em] text-primary border border-primary/30 rounded-full uppercase bg-primary/10 backdrop-blur-md">
        Premiering Now
      </span>
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">
        Neon <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500 neon-text">Velocity</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-light">
        Experience the future of cinema with our immersive Dolby Atmos sound systems and 4K laser projection.
      </p>
      
      <div class="flex flex-wrap gap-4">
        <button class="px-8 py-4 bg-primary text-white font-bold uppercase text-sm tracking-widest rounded-lg shadow-[0_0_20px_rgba(242,13,51,0.5)] hover:bg-red-600 hover:scale-105 transition-all flex items-center gap-3">
          <span>Book Tickets</span>
          <span class="material-symbols-outlined">confirmation_number</span>
        </button>
        <button class="px-8 py-4 bg-surface-200/50 backdrop-blur text-white font-bold uppercase text-sm tracking-widest rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-3">
          <span>Watch Trailer</span>
          <span class="material-symbols-outlined">play_circle</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Hero logic can be added here if needed (e.g., props for different movies)
</script>

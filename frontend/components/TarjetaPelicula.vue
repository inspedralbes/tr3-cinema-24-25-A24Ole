<template>
  <NuxtLink :to="`/sesion/${movie.id}/asientos`" class="movie-card group">
    <!-- Poster Image -->
    <div class="movie-card-image-wrapper">
      <img :src="movie.poster_url" :alt="movie.titulo" class="movie-card-image">
      
      <!-- Gradient Overlay (Always visible but stronger on hover) -->
      <div class="movie-card-overlay"></div>
      
      <!-- Content Container -->
      <div class="movie-card-content">
        <!-- Badge -->
        <span class="badge-neon-sm mb-3">
          {{ movie.duracion }}
        </span>

        <!-- Title -->
        <h3 class="movie-card-title">{{ movie.titulo }}</h3>
        
        <!-- Genre -->
        <p class="text-sm text-gray-400 mb-4">{{ movie.genero }}</p>

        <!-- CTA Button (Hidden until hover/focus) -->
        <div class="movie-card-cta">
          <button class="btn-primary w-full py-3 text-xs shadow-[0_0_15px_rgba(242,13,51,0.4)] hover:shadow-[0_0_25px_rgba(242,13,51,0.6)]">
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

<style scoped>
.movie-card {
  @apply relative block rounded-xl overflow-hidden bg-surface-100 border border-white/5 transition-all duration-500;
}
.movie-card:hover {
  @apply border-primary/50;
  box-shadow: 0 0 30px rgba(242, 13, 51, 0.15);
}

.movie-card-image-wrapper {
  @apply aspect-[2/3] w-full relative overflow-hidden;
}

.movie-card-image {
  @apply w-full h-full object-cover transition-transform duration-700;
}
.movie-card:hover .movie-card-image {
  @apply scale-110 rotate-1;
}

.movie-card-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent opacity-80 transition-opacity duration-300;
}
.movie-card:hover .movie-card-overlay {
  @apply opacity-90;
}

.movie-card-content {
  @apply absolute inset-x-0 bottom-0 p-6 translate-y-2 transition-transform duration-300;
}
.movie-card:hover .movie-card-content {
  @apply translate-y-0;
}

.movie-card-title {
  @apply text-xl font-bold text-white leading-tight mb-1 font-display transition-colors;
}
.movie-card:hover .movie-card-title {
  @apply text-primary;
}

.movie-card-cta {
  @apply opacity-0 transform translate-y-4 transition-all duration-300;
}
.movie-card:hover .movie-card-cta {
  @apply opacity-100 translate-y-0;
}
</style>

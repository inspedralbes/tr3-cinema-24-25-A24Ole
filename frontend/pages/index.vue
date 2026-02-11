<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <div class="flex items-end justify-between mb-12">
      <div>
        <h1 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">Now Playing</h1>
        <p class="text-gray-400">Experience cinema like never before.</p>
      </div>
      <div class="hidden md:flex gap-4">
        <button class="size-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <button class="size-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>

    <!-- Movie Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" @click="bookingStore.setMovie(movie)" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()

const movies = ref([
  {
    id: 1,
    title: 'Neon Velocity: 2049',
    genre: 'Sci-Fi / Action',
    duration: '2h 15m',
    poster: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' // Mock
  },
  {
    id: 2,
    title: 'Cyber Enigma',
    genre: 'Thriller',
    duration: '1h 48m',
    poster: 'https://image.tmdb.org/t/p/w500/qA5kPYZA7FkVvqcEfJRoOy4kpHg.jpg' // Mock
  },
  {
    id: 3,
    title: 'The Quantum Paradox',
    genre: 'Mystery',
    duration: '2h 30m',
    poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOtrC.jpg' // Mock
  },
  {
    id: 4,
    title: 'Midnight Echoes',
    genre: 'Drama / Noir',
    duration: '1h 55m',
    poster: 'https://image.tmdb.org/t/p/w500/pFlaoOXp95Mcn3jAXSpjmBODlfR.jpg' // Mock
  }
])
</script>

<template>
  <div class="pb-20">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Movie Listings -->
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex items-end justify-between mb-12">
        <div>
          <h2
            class="text-3xl font-bold text-white mb-2 flex items-center gap-3"
          >
            <span
              class="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(242,13,51,0.8)]"
            ></span>
            Now Showing
          </h2>
        </div>

        <!-- Filter/Controls -->
        <MovieFilters v-model="activeFilter" />
      </div>

      <MovieGrid :movies="filteredMovies" @select="handleMovieSelect" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useBookingStore } from "@/stores/booking";
import HeroSection from "@/components/home/HeroSection.vue";
import MovieFilters from "@/components/home/MovieFilters.vue";
import MovieGrid from "@/components/home/MovieGrid.vue";

const bookingStore = useBookingStore();
const activeFilter = ref("All");

const config = useRuntimeConfig();
const {
  data: movies,
  pending,
  error,
} = await useFetch(`${config.public.apiBase}/movies`);

// Fallback to empty array if fetch fails or returns null
if (!movies.value) movies.value = [];

const filteredMovies = computed(() => {
  if (activeFilter.value === "All") return movies.value;
  return movies.value.filter((m) => m.genre.includes(activeFilter.value));
});

const handleMovieSelect = (movie) => {
  bookingStore.currentMovie = movie; // Direct assignment or use a specific action if available
  // To match original behavior:
  bookingStore.setMovie(movie);
};
</script>

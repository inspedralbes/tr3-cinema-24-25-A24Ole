<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    <TarjetaPelicula 
      v-for="movie in movies" 
      :key="movie.id" 
      :movie="movie" 
      @click="emit('select', movie)" 
    />
  </div>
</template>

<script setup>
defineProps({
  movies: Array
})

const emit = defineEmits(['select'])
</script>

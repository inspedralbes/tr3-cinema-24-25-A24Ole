<template>
  <header class="flex items-center justify-between border-b border-solid border-white/10 px-6 lg:px-20 py-4 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
    <div class="flex items-center gap-4 text-white">
      <NuxtLink to="/" class="flex items-center gap-4">
        <div class="size-6 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fill-rule="evenodd"></path>
          </svg>
        </div>
        <h2 class="text-white text-xl font-bold leading-tight tracking-tight uppercase">CinemaFlow</h2>
      </NuxtLink>
    </div>
    <div class="flex items-center gap-10">
      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink to="/" class="text-white/70 hover:text-white text-sm font-medium transition-colors">Movies</NuxtLink>
        <a href="#" class="text-white/70 hover:text-white text-sm font-medium transition-colors">Theaters</a>
        <a href="#" class="text-white/70 hover:text-white text-sm font-medium transition-colors">Promotions</a>
      </nav>
      <div class="flex items-center gap-4">
        <button class="flex items-center justify-center rounded-full size-10 bg-white/5 hover:bg-white/10 text-white transition-all">
          <span class="material-symbols-outlined">person</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

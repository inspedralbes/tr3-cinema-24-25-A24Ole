<template>
  <div class="relative min-h-screen bg-void overflow-hidden text-white font-sans selection:bg-primary selection:text-white">
    <!-- Ambient Spotlight Effect -->
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0 animate-spotlight"></div>
    
    <!-- Navbar -->
    <AppNavbar />

    <!-- Page Content -->
    <main class="relative z-10 pt-24 px-6 max-w-7xl mx-auto">
      <slot />
    </main>
  </div>
</template>

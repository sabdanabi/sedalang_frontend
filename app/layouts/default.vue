<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
    <!-- Navbar Component -->
    <LayoutsNavbar />
    
    <!-- Main page content container -->
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

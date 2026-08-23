<template>
  <div class="min-h-screen bg-white text-gray-900 font-inter flex flex-col">
    <!-- Navbar Component -->
    <LayoutsNavbar />
    
    <!-- Main page content container -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer Component -->
    <LayoutsFooter />
  </div>
</template>

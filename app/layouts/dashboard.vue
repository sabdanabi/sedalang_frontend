<template>
  <div class="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
    <!-- Dashboard Navbar Component -->
    <LayoutsDashboardNavbar />
    
    <!-- Main page content container -->
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

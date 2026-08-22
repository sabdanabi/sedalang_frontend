<script setup lang="ts">
// Automatically redirect from root route to login page
await navigateTo('/login')
</script>

<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <p class="text-gray-400 text-sm animate-pulse">Redirecting to login...</p>
  </div>
</template>

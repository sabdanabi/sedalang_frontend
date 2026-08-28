<script setup lang="ts">
import { onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// Onboarding verification check
onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
    }
  }
})
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-white py-10">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20">
      
      <!-- Back to Dashboard Link -->
      <div class="mb-6 flex justify-start">
        <NuxtLink 
          to="/dashboard-aiPage" 
          class="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#7A4D30] transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12l7.5-7.5M21 12H3" />
          </svg>
          Kembali ke Ide AI
        </NuxtLink>
      </div>

      <!-- Craftsman Carousel Section Component -->
      <FeaturesLandingCraftsmanCarouselSection />

    </div>
  </div>
</template>

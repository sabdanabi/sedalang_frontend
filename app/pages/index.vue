<script setup lang="ts">
import { ref } from 'vue'

// Search query for craftsman input
const searchQuery = ref('')

// Form search submission handler
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    alert(`Searching for craftsman: "${searchQuery.value}"`)
  } else {
    alert('Please enter a craftsman name or capability.')
  }
}

// Interactive handler for bottom feature tags
const selectTag = (tagName: string) => {
  alert(`Navigating to: ${tagName}`)
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="relative w-full bg-white select-none">
      <!-- Decorative background elements for premium feel -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[40%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-[#7A4D30]/3 blur-[120px]"></div>
        <div class="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#7A4D30]/3 blur-[120px]"></div>
      </div>

      <!-- Hero Content Container -->
      <div class="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 md:pt-28 md:pb-32 flex flex-col items-center text-center relative z-10">
        
        <!-- Subheading / Tagline -->
        <span class="text-sm md:text-base font-semibold text-gray-500 tracking-wide uppercase mb-5 animate-fade-in">
          Green Supply Chain & Sustainable Consumption Platforms
        </span>

        <!-- Main Heading -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] max-w-5xl leading-[1.15] mb-6">
          Recycling Becomes Valuable <br class="hidden sm:inline" />
          Together Local Artisans
        </h1>

        <!-- Description Paragraph -->
        <p class="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10">
          Transform used household items into valuable products <br class="hidden md:inline" />
          with the help of AI and local MSME artisans in Semarang.
        </p>

        <!-- Craftsman Search / Tracking Input Box -->
        <form 
          @submit.prevent="handleSearch"
          class="w-full max-w-lg bg-white border border-gray-200 hover:border-[#7A4D30]/30 focus-within:border-[#7A4D30] focus-within:ring-2 focus-within:ring-[#7A4D30]/10 rounded-full p-1.5 pl-6 shadow-sm hover:shadow transition-all duration-300 flex items-center gap-2 mb-16"
        >
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Looking for a craftsman"
            class="flex-grow bg-transparent text-sm md:text-base text-gray-800 placeholder-gray-400 outline-none w-full"
          />
          <button 
            type="submit"
            class="bg-[#7A4D30] hover:bg-[#6A3F25] text-white px-6 py-3 rounded-full text-sm md:text-base font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            Tracking craftsman
          </button>
        </form>

        <!-- Bottom Highlights List -->
        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-sm md:text-base font-medium text-gray-800">
          <button 
            @click="selectTag('AI Page')"
            class="hover:text-[#7A4D30] transition-colors duration-150 cursor-pointer focus:outline-none"
          >
            AI Page
          </button>
          <span class="text-gray-300 select-none">•</span>
          <button 
            @click="selectTag('Discussion Room')"
            class="hover:text-[#7A4D30] transition-colors duration-150 cursor-pointer focus:outline-none"
          >
            Discussion Room
          </button>
          <span class="text-gray-300 select-none">•</span>
          <button 
            @click="selectTag('Tracking Progres')"
            class="hover:text-[#7A4D30] transition-colors duration-150 cursor-pointer focus:outline-none"
          >
            Tracking Progres
          </button>
          <span class="text-gray-300 select-none">•</span>
          <button 
            @click="selectTag('Looking for a Craftsman')"
            class="hover:text-[#7A4D30] transition-colors duration-150 cursor-pointer focus:outline-none">
            Looking for a Craftsman
          </button>
        </div>
      </div>
    </div>

    <!-- Explore Section -->
    <FeaturesLandingExploreSection />

    <!-- Ways of Working Section -->
    <FeaturesLandingWaysOfWorkingSection />
    
  </div>
</template>

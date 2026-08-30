<script setup lang="ts">
// Scroll to about section
const scrollToAbout = () => {
  const aboutSection = document.getElementById('about')
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' })
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
        <span class="text-sm md:text-base font-semibold text-gray-500 tracking-wide uppercase mb-5 animate-fade-in font-inter">
          Green Supply Chain & Sustainable Consumption Platforms
        </span>

        <!-- Main Heading -->
        <h1 class="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1A1A1A] max-w-5xl leading-[1.40] mb-6">
          Recycling Becomes Valuable <br class="hidden sm:inline" />
          Together Local Artisans
        </h1>

        <!-- Description Paragraph -->
        <p class="font-inter text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10">
          Transform used household items into valuable products <br class="hidden md:inline" />
          with the help of AI and local MSME artisans in Semarang.
        </p>

        <!-- Mulai Button -->
        <button
          @click="scrollToAbout"
          class="bg-[#7A4D30] hover:bg-[#6A3F25] active:scale-[0.97] text-white px-10 py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg mb-16 font-inter flex items-center gap-2 group"
        >
          Mulai
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition-transform duration-200 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Bottom Highlights List -->
        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-sm md:text-base font-medium text-gray-800 font-inter">
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

    <!-- Explore Section (About anchor) -->
    <div id="about">
      <FeaturesLandingExploreSection />
    </div>

    <!-- Ways of Working Section -->
    <FeaturesLandingWaysOfWorkingSection />

    <!-- Maps Section -->
    <FeaturesLandingMapsSection />

    <!-- QnA Section -->
    <FeaturesLandingQnaSection />

    <!-- Testimonials Section -->
    <FeaturesLandingTestimonialsSection />
    
  </div>
</template>

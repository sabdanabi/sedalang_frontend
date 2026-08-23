<script setup lang="ts">
const steps = [
  {
    image: '/images/landing_page_images/ai_page_img.webp',
    alt: 'AI Page illustration',
    title: 'AI Page',
    description: 'Users upload photos of used items, and the AI analyzes the materials to provide recycling ideas along with visualizations; users can then select an idea and connect with a suitable artisan.'
  },
  {
    image: '/images/landing_page_images/discussion_room_img.webp',
    alt: 'Discussion Room illustration',
    title: 'Discussion Room',
    description: 'Users and artisans can discuss item details, costs, and shipping, as well as confirm the transaction via an agreement proposal once the user approves the submitted proposal.'
  },
  {
    image: '/images/landing_page_images/tracking_progres_img.webp',
    alt: 'Tracking Progres illustration',
    title: 'Tracking Progres',
    description: 'Users can view their order history and monitor the work process, from the initial stage to completion. Artisans update the job status and include photos showing the progress.'
  },
  {
    image: '/images/landing_page_images/looking_for_a_craftsman_img.png',
    alt: 'Looking for a craftsman illustration',
    title: 'Looking for a craftsman',
    description: 'Users can search for artisans if they already have their own recycling ideas. Users can select artisans based on location, portfolio, ratings, and the types of materials accepted.'
  }
]
</script>

<template>
  <section class="w-full bg-white py-20 md:py-28 select-none relative overflow-hidden">
    <div class="max-w-8xl mx-auto px-10 lg:px-11 flex flex-col items-center relative z-10">
      
      <!-- Top Pill Tag -->
      <div class="border border-gray-900 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase inline-block mb-6 select-none bg-white shadow-sm font-inter">
        ways of working
      </div>

      <!-- Main Headline -->
      <h2 class="font-poppins text-4xl md:text-5xl font-medium text-gray-950 text-center mb-4 tracking-tight leading-tight">
        Turn Used Items into More Valuable.
      </h2>

      <!-- Subtitle -->
      <p class="font-inter text-base md:text-lg text-gray-400 text-center max-w-4xl mb-16 leading-relaxed">
        Follow these simple steps to easily and sustainably transform used items into valuable creations.
      </p>

      <!-- Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        <div 
          v-for="step in steps" 
          :key="step.title"
          class="flex flex-col items-center bg-white border border-gray-100 hover:border-gray-200 rounded-[20px] p-6 lg:p-8 hover:shadow-lg transition-all duration-300 group cursor-default"
        >
          <!-- Illustration Container (Fixed height to keep cards aligned) -->
          <div class="h-40 flex items-center justify-center mb-8 w-full select-none pointer-events-none group-hover:scale-[1.03] transition-transform duration-300">
            <img 
              :src="step.image" 
              :alt="step.alt" 
              class="max-h-full max-w-[85%] object-contain"
            />
          </div>

          <!-- Step Title -->
          <h3 class="text-[#7A4D30] font-poppins font-bold text-lg lg:text-xl text-center mb-4 transition-colors duration-200 group-hover:text-[#6A3F25]">
            {{ step.title }}
          </h3>

          <!-- Step Description -->
          <p class="font-inter text-sm lg:text-[15px] leading-relaxed text-gray-500 text-center">
            {{ step.description }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

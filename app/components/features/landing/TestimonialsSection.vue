<script setup lang="ts">
import { ref, computed } from 'vue'

const currentPage = ref(1) // Start at page 2 like the mockup design
const totalPages = 19

// Standard local avatar path from public folder
const defaultAvatar = '/images/landing_page_images/default_pp.webp'

// Dummy testimonials data variations for the pages (cycling using modulo)
const testimonialsData = [
  // Variant A (Matches mockup layout closely)
  [
    { type: 'date', header: '12 - 02 - 2026', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', name: 'Bruno James', role: 'Creative design' },
    { type: 'title', header: 'PT. Joystick', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Bruno James', role: 'Creative design' },
    { type: 'date', header: '12 - 02 - 2026', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', name: 'Bruno James', role: 'Creative design' },
    { type: 'title', header: 'PT. Joystick', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Bruno James', role: 'Creative design' },
    { type: 'date', header: '12 - 02 - 2026', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', name: 'Bruno James', role: 'Creative design' },
    { type: 'title', header: 'PT. Joystick', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', name: 'Bruno James', role: 'Creative design' }
  ],
  // Variant B (Real-world descriptions)
  [
    { type: 'title', header: 'PT. Sirkula Wood', text: 'Working with SeDaLang and local Semarang artisans allowed us to repurpose all our scrap timber into beautiful lounge furniture. The process was transparent and simple.', name: 'Sarah Connor', role: 'Operations Manager' },
    { type: 'date', header: '15 - 03 - 2026', text: 'Absolutely love the customized bamboo desk organizers. The AI suggestions were highly creative, and tracking shipping milestones gave us peace of mind.', name: 'Alex Mercer', role: 'Product Lead' },
    { type: 'date', header: '18 - 03 - 2026', text: 'A fantastic initiative matching local MSMEs with businesses. We successfully turned 500kg of metal offcuts into premium showroom stands.', name: 'Diana Prince', role: 'Sustainability Specialist' },
    { type: 'title', header: 'PT. Digital Creative', text: 'Great communication. The discussion room let us refine the designs directly with the craftsman. Safe shipping, excellent packaging.', name: 'Bruce Wayne', role: 'Purchasing Director' },
    { type: 'title', header: 'Eco Packaging Corp', text: 'An absolute game-changer for corporate CSR goals. Replaced our office waste with sustainable products crafted right in Semarang.', name: 'Clark Kent', role: 'CSR Coordinator' },
    { type: 'date', header: '22 - 03 - 2026', text: 'The craftsmen turned old cargo pallets into elegant retail stools. Very highly recommended platform for any green business.', name: 'Arthur Curry', role: 'Store Owner' }
  ],
  // Variant C
  [
    { type: 'date', header: '01 - 04 - 2026', text: 'Excellent matching accuracy. The system selected a highly skilled weaver who transformed our textile waste into beautiful corporate rugs.', name: 'Selina Kyle', role: 'Home Decor Stylist' },
    { type: 'title', header: 'PT. Metallurgy Utama', text: 'Managed to save 300kg of brass filings from entering the waste stream by partnering with local blacksmiths. Superb workflow and design ideas.', name: 'Tony Stark', role: 'Industrial Designer' },
    { type: 'date', header: '05 - 04 - 2026', text: 'The escrow-like secure transaction system makes buying customized recycled art safe and simple. Highly recommend this Nuxt web app.', name: 'Natasha Romanoff', role: 'Project Director' },
    { type: 'title', header: 'Semarang Craft Hub', text: 'We received high quality custom paper boxes made entirely from recycled office papers. The communication was prompt and helpful.', name: 'Peter Parker', role: 'Creative Specialist' },
    { type: 'date', header: '08 - 04 - 2026', text: 'The AI recommendations were spot-on! It recognized our wood scrap types and generated beautiful Scandinavian chair concepts.', name: 'Wanda Maximoff', role: 'Design Consultant' },
    { type: 'title', header: 'PT. Joyful Living', text: 'A wonderful bridge connecting modern enterprises with local wisdom and artisanal skills. The eco impact numbers speak for themselves.', name: 'Steve Rogers', role: 'Community Partner' }
  ]
]

// Select active data cards based on page number
const currentTestimonials = computed(() => {
  const index = (currentPage.value - 1) % testimonialsData.length
  return testimonialsData[index]
})

// Format page number to double digit (e.g. 02)
const formattedPage = computed(() => {
  return currentPage.value < 10 ? `0${currentPage.value}` : `${currentPage.value}`
})

const formattedTotalPages = computed(() => {
  return totalPages < 10 ? `0${totalPages}` : `${totalPages}`
})

// Navigation methods
const nextPage = () => {
  if (currentPage.value < totalPages) {
    currentPage.value++
  } else {
    currentPage.value = 1
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  } else {
    currentPage.value = totalPages
  }
}
</script>

<template>
  <section class="w-full bg-[#FFFFFF] py-20 md:py-28 select-none relative overflow-hidden border-b border-gray-100/50">
    <div class="max-w-8xl mx-auto px-10 lg:px-11 relative z-10">
      
      <!-- Top Pill Tag -->
      <div class="border border-gray-900 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase inline-block mb-6 select-none bg-white shadow-sm font-inter">
        Testimoni
      </div>

      <!-- Section Title -->
      <h2 class="font-poppins text-4xl md:text-5xl font-medium text-gray-950 mb-12 tracking-tight">
        Feedback From Client
      </h2>

      <!-- Testimonials Staggered Grid with Vue Page Swap Transition -->
      <transition name="testimonial-fade" mode="out-in">
        <div :key="currentPage" class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full items-start">
          
          <!-- Column 1 (Short + Long) -->
          <div class="flex flex-col gap-6 md:gap-8">
            <!-- Card 1 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[250px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[0].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[0].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[0].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[0].role }}</p>
                </div>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[300px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[3].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[3].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[3].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[3].role }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2 (Long + Short) -->
          <div class="flex flex-col gap-6 md:gap-8">
            <!-- Card 3 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[350px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[1].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[1].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[1].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[1].role }}</p>
                </div>
              </div>
            </div>

            <!-- Card 4 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[250px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[4].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[4].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[4].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[4].role }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 3 (Short + Long) -->
          <div class="flex flex-col gap-6 md:gap-8">
            <!-- Card 5 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[250px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[2].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[2].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[2].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[2].role }}</p>
                </div>
              </div>
            </div>

            <!-- Card 6 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[300px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[5].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[5].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="defaultAvatar" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[5].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[5].role }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </transition>

      <!-- Bottom Right Pagination Controls -->
      <div class="w-full flex justify-end items-center mt-12 md:mt-16">
        <div class="flex items-center">
          
          <!-- Prev Button -->
          <button 
            @click="prevPage" 
            type="button"
            class="w-12 h-12 rounded-full bg-[#7A4D30] hover:bg-[#633e26] transition-colors duration-200 flex items-center justify-center text-white cursor-pointer select-none shadow-sm focus:outline-none"
            aria-label="Previous Page"
          >
            <!-- Chevron Left SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <!-- Page Indicator -->
          <span class="font-inter text-sm font-bold text-gray-900 mx-6 w-12 text-center select-none">
            {{ formattedPage }}/{{ formattedTotalPages }}
          </span>

          <!-- Next Button -->
          <button 
            @click="nextPage" 
            type="button"
            class="w-12 h-12 rounded-full bg-[#7A4D30] hover:bg-[#633e26] transition-colors duration-200 flex items-center justify-center text-white cursor-pointer select-none shadow-sm focus:outline-none"
            aria-label="Next Page"
          >
            <!-- Chevron Right SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Page Swap Fade Animation */
.testimonial-fade-enter-active,
.testimonial-fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.testimonial-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.testimonial-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    question: 'What Is This Platform?',
    answer: 'A platform that connects users with local craftsmen to transform used materials into valuable, customized products.',
    isOpen: true // First item open by default like the mockup design
  },
  {
    question: 'How Does The Recycling Process Work?',
    answer: 'Users upload photos of used items, the AI analyzes the materials to provide recycling ideas, and users select an idea to connect with a suitable artisan to finalize the design and shipping.',
    isOpen: false
  },
  {
    question: 'How Does Smart Matching Find The Right Craftsman?',
    answer: 'It matches artisans based on location, customer ratings, portfolios, and the specific materials they accept, ensuring you get the perfect fit for your project.',
    isOpen: false
  },
  {
    question: 'Can I Discuss My Design And Budget With The Craftsman?',
    answer: 'Yes! You can directly chat with the craftsman in the Discussion Room to align on the design, materials, timeline, and budget before approving the formal proposal.',
    isOpen: false
  },
  {
    question: 'How Can I Send My Used Materials?',
    answer: 'You can arrange material shipment via local logistics providers or deliver them directly to the craftsman’s workshop, with the method agreed upon in the transaction proposal.',
    isOpen: false
  }
])

const toggleItem = (index: number) => {
  items.value.forEach((item, idx) => {
    if (idx === index) {
      item.isOpen = !item.isOpen
    } else {
      item.isOpen = false // Single-open accordion behavior
    }
  })
}
</script>

<template>
  <section class="w-full bg-white py-20 md:py-28 select-none relative overflow-hidden">
    <div class="max-w-8xl mx-auto px-10 lg:px-11 relative z-10 flex flex-col items-center">
      
      <!-- Top Pill Tag -->
      <div class="border border-gray-900 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase inline-block mb-8 select-none bg-white shadow-sm font-inter">
        QnA
      </div>

      <!-- Main Headline -->
      <h2 class="font-poppins text-4xl md:text-5xl font-medium text-gray-950 text-center mb-16 tracking-tight leading-tight max-w-3xl">
        Feel free to <span class="text-[#7A4D30]">ask anything</span> we're here to <span class="text-[#7A4D30]">answer</span> your questions!
      </h2>

      <!-- Accordion Container -->
      <div class="w-full border-t border-gray-100 divide-y divide-gray-100 max-w-8xl">
        <div 
          v-for="(item, index) in items" 
          :key="item.question"
          class="w-full"
        >
          <!-- Accordion Header Button -->
          <button
            @click="toggleItem(index)"
            type="button"
            class="w-full flex items-center justify-between py-6 text-left focus:outline-none group cursor-pointer"
            :aria-expanded="item.isOpen"
          >
            <span 
              class="font-poppins text-lg md:text-xl font-semibold text-gray-950 transition-colors duration-200"
              :class="{ 'text-[#7A4D30]': item.isOpen, 'group-hover:text-[#7A4D30]': !item.isOpen }"
            >
              {{ item.question }}
            </span>
            
            <!-- Animated Plus to X Icon -->
            <div 
              class="relative w-6 h-6 flex items-center justify-center transition-transform duration-300 ease-in-out transform"
              :class="{ 'rotate-134': item.isOpen }"
            >
              <!-- Horizontal line -->
              <span 
                class="absolute h-[2px] w-4 bg-gray-500 rounded-full transition-colors duration-300"
                :class="{ 'bg-gray-950': item.isOpen, 'group-hover:bg-gray-950': !item.isOpen }"
              ></span>
              <!-- Vertical line -->
              <span 
                class="absolute w-[2px] h-4 bg-gray-500 rounded-full transition-colors duration-300"
                :class="{ 'bg-gray-950': item.isOpen, 'group-hover:bg-gray-950': !item.isOpen }"
              ></span>
            </div>
          </button>

          <!-- Accordion Content (Smooth height & fade transition) -->
          <div 
            class="grid transition-all duration-300 ease-in-out overflow-hidden"
            :class="item.isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pb-0'"
          >
            <div class="overflow-hidden">
              <p class="font-inter text-sm sm:text-base text-gray-400 leading-relaxed max-w-3xl">
                {{ item.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Rotate 135 degrees class utility */
.rotate-135 {
  transform: rotate(135deg);
}
</style>

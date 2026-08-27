<script setup lang="ts">
interface Tool {
  name: string
  icon: string
}

interface Skill {
  name: string
  icon: string
  desc: string
  color: string
}

interface Step {
  title: string
  desc: string
}

interface Product {
  id: number
  title: string
  subtitle: string
  description: string
  detailDescription: string
  tools: Tool[]
  materials: string[]
  skills: Skill[]
  steps: Step[]
  image: string
  materialType: string
}

defineProps<{
  product: Product
}>()

defineEmits<{
  (e: 'select', product: Product): void
}>()
</script>

<template>
  <div class="bg-white rounded-[24px] overflow-hidden flex flex-col justify-between text-left group transition-all duration-300 hover:translate-y-[-4px]">
    <!-- Product Card Image -->
    <div class="relative aspect-[4/3] rounded-[24px] overflow-hidden mb-5">
      <img 
        :src="product.image" 
        :alt="product.title" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <!-- Material Category tag -->
      <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#7A4D30] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
        {{ product.materialType }}
      </span>
    </div>

    <!-- Product Card Content -->
    <div class="flex-grow flex flex-col justify-between">
      <div class="mb-6">
        <h3 class="font-poppins text-lg font-bold text-gray-950 group-hover:text-[#7A4D30] transition-colors duration-200">
          {{ product.title }}
        </h3>
        <p class="font-inter text-xs md:text-sm text-gray-400 mt-2 leading-relaxed">
          {{ product.description }}
        </p>
      </div>

      <!-- Card Action Button -->
      <button
        type="button"
        @click="$emit('select', product)"
        class="w-full md:w-auto self-start border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30] hover:text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 group cursor-pointer focus:outline-none"
      >
        Selengkapnya
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button>
    </div>
  </div>
</template>

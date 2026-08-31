<script setup lang="ts">
import { getAvatarUrl } from '~/composables/useAvatar'

defineProps<{
  craftsman: {
    id: string | number
    name: string
    location: string
    category: string
    rating: number
    description: string
    badges: string[]
    mainImage: string
    portfolio: string[]
    avatarUrl?: string | null
  }
  positionIndex: number
}>()

defineEmits<{
  (e: 'click-profile', id: string | number): void
  (e: 'click-chat', name: string): void
}>()
</script>

<template>
  <div 
    class="absolute w-full bg-white border border-gray-150 rounded-[32px] p-6 shadow-xl transition-all duration-500 ease-out origin-center flex flex-col justify-between"
    :class="[
      positionIndex === 0 ? 'z-30 scale-100 opacity-100 shadow-[0_20px_50px_rgba(122,77,48,0.08)] pointer-events-auto' : '',
      positionIndex === 1 ? 'z-20 scale-90 translate-x-[45%] md:translate-x-[65%] opacity-40 md:opacity-60 pointer-events-none select-none filter blur-[1px] md:blur-0' : '',
      positionIndex === -1 ? 'z-20 scale-90 -translate-x-[45%] md:-translate-x-[65%] opacity-40 md:opacity-60 pointer-events-none select-none filter blur-[1px] md:blur-0' : '',
      positionIndex === 99 ? 'opacity-0 scale-75 pointer-events-none z-10' : ''
    ]"
  >
    <!-- Card Header -->
    <div class="flex items-center gap-3">
      <img 
        :src="getAvatarUrl(craftsman.avatarUrl || null, craftsman.name)" 
        alt="Profile Picture" 
        class="w-12 h-12 rounded-full object-cover border border-gray-100" 
      />
      <div class="flex flex-col text-left">
        <h3 class="font-poppins font-bold text-gray-950 text-base md:text-lg leading-snug">
          {{ craftsman.name }}
        </h3>
        <span class="font-inter text-xs md:text-sm text-gray-400 font-medium flex items-center gap-1">
          <!-- Pin icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {{ craftsman.location }}
        </span>
      </div>
    </div>

    <!-- Workspace Main Image -->
    <div class="w-full h-44 mt-4 overflow-hidden rounded-[20px] border border-gray-100 bg-gray-50">
      <img 
        :src="craftsman.mainImage" 
        alt="Craftsman Workspace" 
        class="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300" 
      />
    </div>

    <!-- Content Area: Category & Rating & Description -->
    <div class="flex flex-col text-left mt-4 flex-grow">
      <div class="flex items-center justify-between gap-2">
        <h4 class="font-poppins font-semibold text-gray-950 text-sm md:text-[15px] leading-snug truncate">
          {{ craftsman.category }}
        </h4>
        <div class="flex items-center gap-1 text-amber-500 font-bold text-xs md:text-sm flex-shrink-0">
          <span>★</span>
          <span>{{ craftsman.rating.toFixed(1) }}</span>
        </div>
      </div>
      <p class="font-inter text-xs md:text-sm text-gray-500 leading-relaxed mt-2 line-clamp-3">
        {{ craftsman.description }}
      </p>
    </div>

    <!-- Badges List -->
    <div class="flex flex-wrap gap-2 mt-4">
      <span 
        v-for="badge in craftsman.badges" 
        :key="badge"
        class="bg-gray-50 border border-gray-200/60 text-gray-500 rounded-full py-1 px-3 text-xs font-semibold font-inter flex items-center gap-1"
      >
        <!-- Small recycle/leaf icon placeholder -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 text-[#7A4D30]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        {{ badge }}
      </span>
    </div>

    <!-- Portfolio Thumbnails -->
    <div class="grid grid-cols-3 gap-2 mt-4">
      <div 
        v-for="(thumb, thumbIdx) in craftsman.portfolio" 
        :key="thumbIdx"
        class="h-16 rounded-[12px] overflow-hidden border border-gray-150 bg-gray-50"
      >
        <img 
          :src="thumb" 
          alt="Portfolio item" 
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" 
        />
      </div>
    </div>

    <!-- Card Actions -->
    <div class="flex gap-3 mt-6">
      <button 
        @click.stop="$emit('click-profile', craftsman.id)"
        type="button"
        class="flex-1 border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 text-xs font-bold font-inter py-3 px-2 rounded-full transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none"
      >
        Lihat Profile
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button>

      <button 
        @click.stop="$emit('click-chat', craftsman.name)"
        type="button"
        class="flex-1 bg-[#7A4D30] hover:bg-[#683f26] text-white text-xs font-bold font-inter py-3 px-2 rounded-full transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none shadow-sm hover:shadow active:scale-[0.98]"
      >
        Pilih Pengrajin
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  photos: string[]
}>()

defineEmits<{
  (e: 'open-gallery'): void
}>()
</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col justify-between space-y-5">
    
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 border-b border-gray-50 pb-4">
      <div class="flex items-center gap-2">
        <!-- Camera Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#7A4D30]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
        <h4 class="font-poppins text-sm md:text-base font-bold text-gray-900 leading-none">
          Photo Updates
        </h4>
      </div>
      <span class="text-[10px] font-bold font-inter tracking-wider text-gray-400 uppercase">
        {{ photos.length }} PHOTOS
      </span>
    </div>

    <!-- Images Grid Layout -->
    <div class="space-y-3" v-if="photos.length > 0">
      <!-- Big image on top -->
      <div class="w-full h-44 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100/70 shadow-sm cursor-zoom-in" @click="$emit('open-gallery')">
        <img
          :src="photos[0]"
          alt="Main update photo"
          class="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
        />
      </div>

      <!-- Thumbnails row below (up to 4 thumbnails) -->
      <div class="grid grid-cols-4 gap-3">
        <div 
          v-for="(photo, index) in photos.slice(1, 5)" 
          :key="index"
          class="h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100/70 shadow-sm cursor-zoom-in relative"
          @click="$emit('open-gallery')"
        >
          <img
            :src="photo"
            alt="Update photo thumbnail"
            class="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-500"
          />
          <!-- Overlay on the last thumbnail if there are more than 5 photos -->
          <div 
            v-if="index === 3 && photos.length > 5" 
            class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold font-inter"
          >
            +{{ photos.length - 5 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Action Link Button -->
    <div class="pt-2">
      <button
        type="button"
        @click="$emit('open-gallery')"
        class="w-full border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2.5 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
      >
        Lihat semua media
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
interface UserProfile {
  name: string
  role: string
  location: string
  avatar: string
}

defineProps<{
  profile: UserProfile
}>()

defineEmits<{
  (e: 'edit'): void
}>()
</script>

<template>
  <div class="bg-[#FAF8F5]/80 border border-[#FAF8F5] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
    
    <div class="flex flex-col sm:flex-row items-center gap-6">
      
      <!-- Profile Picture Box with Button.svg camera icon overlay -->
      <div class="relative w-28 h-28 flex-shrink-0 select-none">
        <div class="w-full h-full rounded-[28px] overflow-hidden bg-gray-50 border border-gray-150">
          <img
            :src="profile.avatar || '/images/landing_page_images/default_pp.webp'"
            alt="Profile Photo"
            class="w-full h-full object-cover"
          />
        </div>
        <!-- Camera Edit Overlay Button.svg -->
        <button
          type="button"
          @click="$emit('edit')"
          class="absolute -bottom-2 -right-2 w-11 h-11 cursor-pointer focus:outline-none transition-transform hover:scale-105"
        >
          <img src="/images/icons/Button.svg" alt="Upload Profile Photo" class="w-full h-full" />
        </button>
      </div>

      <!-- Detail Info Text -->
      <div class="space-y-1.5 text-center sm:text-left">
        <h2 class="font-poppins text-2xl md:text-3xl font-bold text-gray-950 leading-snug">
          {{ profile.name }}
        </h2>
        <p class="font-inter text-sm text-[#7A4D30] font-semibold">
          {{ profile.role }}
        </p>
        
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-inter text-gray-500 pt-0.5">
          <!-- Pin Location -->
          <div class="flex items-center gap-1.5 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-[#7A4D30]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {{ profile.location }}
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

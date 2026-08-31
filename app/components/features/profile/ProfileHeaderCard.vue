<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

interface ProfileData {
  name: string
  description: string
  location: string
  rating: number
  projectsCount: number
  avatar: string
}

withDefaults(
  defineProps<{
    profile: ProfileData
    isOwnProfile?: boolean
  }>(),
  {
    isOwnProfile: true
  }
)

defineEmits<{
  (e: 'edit'): void
  (e: 'chat'): void
}>()

const authStore = useAuthStore()

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    authStore.logout()
  }
}
</script>

<template>
  <div class="bg-[#FAF8F5]/80 border border-[#FAF8F5] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
    
    <div class="flex flex-col sm:flex-row items-center gap-6">
      
      <!-- Profile Picture Box with Button.svg camera icon overlay -->
      <div class="relative w-28 h-28 flex-shrink-0 select-none">
        <div class="w-full h-full rounded-[28px] overflow-hidden bg-gray-50 border border-gray-150">
          <img
            :src="getAvatarUrl(profile.avatar, profile.name)"
            alt="Profile Photo"
            class="w-full h-full object-cover"
          />
        </div>
        <!-- Camera Edit Overlay Button.svg -->
        <button
          v-if="isOwnProfile"
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
          Pengrajin - {{ profile.description || 'KaryaLoka Craft' }}
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

          <!-- Vertical separator -->
          <span class="w-1 h-3 bg-gray-200 rounded-full hidden sm:inline"></span>

          <!-- Rating and Project Counter -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-0.5 text-amber-500 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.378 21.268c-1.017.607-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
              </svg>
              {{ profile.rating }}
            </div>
            <span class="text-gray-300 font-light">|</span>
            <span class="font-bold text-gray-900">{{ profile.projectsCount }} proyek selesai</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Actions Buttons -->
    <div class="flex flex-col sm:flex-row gap-3.5 w-full md:w-auto">
      <!-- Lihat Profil Publik Button -->
      <!-- <button
        v-if="isOwnProfile"
        type="button"
        class="border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2.5 px-6 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
      >
        Lihat Profil Publik
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button> -->

      <!-- Edit Profil Button -->
      <button
        v-if="isOwnProfile"
        type="button"
        @click="$emit('edit')"
        class="bg-[#7A4D30] hover:bg-[#683E25] text-white py-2.5 px-6 rounded-full text-xs font-bold font-inter shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
      >
        Edit Profil
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button>

      <!-- Hubungi Pengrajin Button (When viewing another craftsman's profile) -->
      <button
        v-else
        type="button"
        @click="$emit('chat')"
        class="bg-[#7A4D30] hover:bg-[#683E25] text-white py-2.5 px-6 rounded-full text-xs font-bold font-inter shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
      >
        Hubungi Pengrajin
        <!-- Message icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 18a5.978 5.978 0 01-.225-2.255C3.302 14.386 2.25 12.025 2.25 9.5 2.25 4.944 6.28 1.25 11 1.25s9 3.694 9 8.25z" />
        </svg>
      </button>

      <!-- Keluar Button -->
      <button
        v-if="isOwnProfile"
        type="button"
        @click="handleLogout"
        class="border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-2.5 px-6 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
      >
        Keluar
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3.004-3-3-3m3 3-3 3m3-3H21" />
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

interface UserProfile {
  name: string
  role: string
  location: string
  avatar: string
}

const props = withDefaults(
  defineProps<{
    profile: UserProfile
    isOwnProfile?: boolean
  }>(),
  {
    isOwnProfile: true
  }
)

defineEmits<{
  (e: 'edit'): void
}>()

const authStore = useAuthStore()

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    authStore.logout()
  }
}
</script>

<template>
  <div class="bg-[#FAF8F5]/80 border border-[#FAF8F5] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
    
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

    <!-- Actions Buttons -->
    <div v-if="isOwnProfile" class="flex flex-row gap-3.5 w-full md:w-auto justify-end items-center md:ml-auto">
      <!-- Edit Profil Button -->
      <button
        type="button"
        @click="$emit('edit')"
        class="bg-[#7A4D30] hover:bg-[#683E25] text-white py-2.5 px-6 rounded-full text-xs font-bold font-inter shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
      >
        Edit Profil
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 18.291a8.95 8.95 0 01-3.003 2.008l-2.233.58a.5.5 0 01-.623-.623l.58-2.233a8.95 8.95 0 012.007-3.003l12.07-12.072zm0 0L19.5 7.125" />
        </svg>
      </button>

      <!-- Keluar Button -->
      <button
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

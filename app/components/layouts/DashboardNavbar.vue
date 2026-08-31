<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.user) {
    try {
      await authStore.getMe()
    } catch (err) {
      console.error('Error fetching user for navbar:', err)
    }
  }
})

const profilePath = computed(() => {
  return authStore.user?.role === 'CRAFTSMAN' ? '/profile-pengrajin' : '/profile'
})

const userDisplayName = computed(() => {
  return authStore.user?.fullName || ''
})

const userRoleText = computed(() => {
  if (authStore.user) {
    return authStore.user.role === 'CRAFTSMAN' ? 'Pengrajin' : 'Pengguna'
  }
  return ''
})

const userAvatar = computed(() => {
  return getAvatarUrl(authStore.user?.avatarUrl, authStore.user?.fullName || 'User')
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-100/80 py-4 select-none">
    <div class="max-w-8xl mx-auto px-16 lg:px-20 flex items-center justify-between">
      
      <!-- Left: Brand Logo -->
      <NuxtLink to="/" class="flex items-center">
        <UiSirkulaLogo />
      </NuxtLink>

      <!-- Center: Navigation Icon Actions -->
      <div class="flex items-center gap-3">
        <!-- Home Button -->
        <NuxtLink
          to="/dashboard-aiPage"
          class="p-2.5 rounded-[12px] border transition-all duration-200 focus:outline-none"
          :class="[
            route.path === '/dashboard-aiPage' 
              ? 'border-[#7A4D30]/30 bg-[#7A4D30]/5 text-[#7A4D30]' 
              : 'border-gray-200/80 text-gray-500 hover:bg-gray-50 hover:text-[#7A4D30] hover:border-[#7A4D30]/30'
          ]"
          title="Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </NuxtLink>

        <!-- Chat Button -->
        <NuxtLink
          to="/chat"
          class="p-2.5 rounded-[12px] border transition-all duration-200 focus:outline-none"
          :class="[
            route.path === '/chat' 
              ? 'border-[#7A4D30]/30 bg-[#7A4D30]/5 text-[#7A4D30]' 
              : 'border-gray-200/80 text-gray-500 hover:bg-gray-50 hover:text-[#7A4D30] hover:border-[#7A4D30]/30'
          ]"
          title="Messages"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </NuxtLink>

        <!-- Search Button (Cari Pengrajin) -->
        <NuxtLink
          to="/search-craftsman"
          class="p-2.5 rounded-[12px] border transition-all duration-200 focus:outline-none"
          :class="[
            route.path === '/search-craftsman' 
              ? 'border-[#7A4D30]/30 bg-[#7A4D30]/5 text-[#7A4D30]' 
              : 'border-gray-200/80 text-gray-500 hover:bg-gray-50 hover:text-[#7A4D30] hover:border-[#7A4D30]/30'
          ]"
          title="Cari Pengrajin"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </NuxtLink>

        <!-- History / Order History Link (4th from left) -->
        <NuxtLink
          to="/history"
          class="p-2.5 rounded-[12px] border transition-all duration-200 focus:outline-none"
          :class="[
            route.path === '/history' 
              ? 'border-[#7A4D30]/30 bg-[#7A4D30]/5 text-[#7A4D30]' 
              : 'border-gray-200/80 text-gray-500 hover:bg-gray-50 hover:text-[#7A4D30] hover:border-[#7A4D30]/30'
          ]"
          title="Riwayat Pesanan"
        >
          <!-- Custom history SVG icon -->
          <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
            <path d="M5.375 2.375V5.375H8.375" stroke="currentColor" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.319 4.625C9.957 2.2195 7.8815 0.375 5.375 0.375C2.6135 0.375 0.375 2.6135 0.375 5.375C0.375 8.1365 2.6135 10.375 5.375 10.375C7.425 10.375 9.1875 9.141 9.959 7.375" stroke="currentColor" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.875 7.375H10.075C10.1144 7.375 10.1534 7.38276 10.1898 7.39784C10.2262 7.41291 10.2593 7.43501 10.2871 7.46287C10.315 7.49073 10.3371 7.5238 10.3522 7.56019C10.3672 7.59659 10.375 7.6356 10.375 7.675V9.875" stroke="currentColor" stroke-width="0.85" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Right: User profile photo & info (Cari/Edit profile) -->
      <NuxtLink v-if="authStore.user" :to="profilePath" class="flex items-center gap-3 hover:opacity-90 focus:outline-none select-none">
        <img
          :src="userAvatar"
          :alt="userDisplayName + ' avatar'"
          class="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
        />
        <div class="hidden sm:flex flex-col text-left">
          <span class="text-sm font-semibold text-gray-900 leading-none">{{ userDisplayName }}</span>
          <span class="text-[11px] text-gray-400 mt-1 font-medium leading-none">{{ userRoleText }}</span>
        </div>
      </NuxtLink>
      <div v-else class="flex items-center gap-3 animate-pulse">
        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div class="hidden sm:flex flex-col gap-1.5 text-left">
          <div class="w-24 h-3 bg-gray-200 rounded"></div>
          <div class="w-16 h-2 bg-gray-200 rounded"></div>
        </div>
      </div>

    </div>
  </header>
</template>

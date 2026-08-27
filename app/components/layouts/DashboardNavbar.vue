<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
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

        <!-- Search Button -->
        <button
          type="button"
          class="p-2.5 rounded-[12px] border border-gray-200/80 text-gray-500 hover:bg-gray-50 hover:text-[#7A4D30] hover:border-[#7A4D30]/30 transition-all duration-200 focus:outline-none cursor-pointer"
          title="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>

        <!-- Processing / AI Ideas Page Button -->
        <NuxtLink
          to="/dashboard-aiPage"
          class="p-2.5 rounded-[12px] border transition-all duration-200 focus:outline-none"
          :class="[
            route.path === '/dashboard-aiPage' 
              ? 'border-[#7A4D30]/30 bg-[#7A4D30]/5 text-[#7A4D30]' 
              : 'border-gray-200/80 text-gray-500 hover:bg-gray-50 hover:text-[#7A4D30] hover:border-[#7A4D30]/30'
          ]"
          title="AI Recycling Ideas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
            <circle cx="12" cy="12" r="4" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Right: User profile photo & info -->
      <div class="flex items-center gap-3">
        <img
          src="/images/landing_page_images/default_pp.webp"
          alt="Bruno James avatar"
          class="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
        />
        <div class="hidden sm:flex flex-col text-left">
          <span class="text-sm font-semibold text-gray-900 leading-none">Bruno James</span>
          <span class="text-[11px] text-gray-400 mt-1 font-medium leading-none">Creative design</span>
        </div>
      </div>

    </div>
  </header>
</template>

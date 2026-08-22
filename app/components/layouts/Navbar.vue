<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/', active: true },
  { name: 'Explore', path: '/explore', active: false },
  { name: 'QnA', path: '/qna', active: false },
  { name: 'Testimoni', path: '/testimoni', active: false }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 select-none">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- Left: Logo -->
        <NuxtLink to="/" class="flex items-center">
          <UiSirkulaLogo />
        </NuxtLink>

        <!-- Center: Desktop Nav Links -->
        <nav class="hidden md:flex items-center gap-8 lg:gap-10">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="relative text-sm font-medium transition-colors duration-200 py-1"
            :class="[
              link.active 
                ? 'text-[#7A4D30] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[2px] after:bg-[#7A4D30] after:rounded-full' 
                : 'text-gray-500 hover:text-[#7A4D30]'
            ]"
          >
            {{ link.name }}
          </NuxtLink>
        </nav>

        <!-- Right: Desktop Auth Buttons -->
        <div class="hidden md:flex items-center gap-4">
          <NuxtLink
            to="/login"
            class="px-6 py-2.5 border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 text-sm font-medium rounded-full transition-all duration-200"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="px-6 py-2.5 bg-[#7A4D30] hover:bg-[#6A3F25] text-white text-sm font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
          >
            Sign up
          </NuxtLink>
        </div>

        <!-- Mobile Hamburger Button -->
        <div class="flex md:hidden">
          <button
            @click="toggleMobileMenu"
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-[#7A4D30] hover:bg-gray-50 focus:outline-none transition-colors duration-200"
            aria-controls="mobile-menu"
            :aria-expanded="isMobileMenuOpen"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed -->
            <svg
              v-if="!isMobileMenuOpen"
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <!-- Icon when menu is open -->
            <svg
              v-else
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-show="isMobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white" id="mobile-menu">
        <div class="space-y-1 px-6 pt-4 pb-6">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="[
              link.active 
                ? 'bg-[#7A4D30]/5 text-[#7A4D30]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#7A4D30]'
            ]"
            @click="isMobileMenuOpen = false"
          >
            {{ link.name }}
          </NuxtLink>
          
          <div class="pt-4 border-t border-gray-100 mt-4 flex flex-col gap-3">
            <NuxtLink
              to="/login"
              class="w-full text-center px-4 py-2.5 border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 text-base font-medium rounded-full transition-all duration-200"
              @click="isMobileMenuOpen = false"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="w-full text-center px-4 py-2.5 bg-[#7A4D30] hover:bg-[#6A3F25] text-white text-base font-medium rounded-full transition-all duration-200 shadow-sm"
              @click="isMobileMenuOpen = false"
            >
              Sign up
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

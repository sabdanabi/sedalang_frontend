<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    await authStore.login({ email: email.value, password: password.value })
    navigateTo('/onboarding')
  } catch (err: any) {
    errorMsg.value = err.data?.message || 'Email atau password salah. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="w-full text-left">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="font-poppins text-3xl font-medium tracking-tight text-[#1A1A1A]">
        Selamat Datang Kembali
      </h1>
      <p class="font-inter text-sm text-gray-500 mt-1">
        Masuk ke akun Anda sekarang
      </p>
    </header>

    <!-- Error Banner -->
    <div v-if="errorMsg" class="mb-5 p-3.5 rounded-[12px] bg-red-50 border border-red-100 text-red-600 text-xs font-semibold font-inter animate-fade-in flex items-center gap-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 shrink-0">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Login Form -->
    <form @submit.prevent="handleLogin" class="space-y-5">
      <!-- Email Input -->
      <UiAuthInput
        id="email"
        v-model="email"
        type="email"
        label="Email"
        placeholder="Masukkan email Anda"
        required
        autocomplete="email"
      />

      <!-- Password Input -->
      <UiAuthInput
        id="password"
        v-model="password"
        type="password"
        label="Password"
        placeholder="Masukkan password Anda"
        required
        autocomplete="current-password"
      />

      <!-- Submit Button -->
      <div class="pt-2">
        <UiAuthButton :loading="isLoading">
          Masuk
        </UiAuthButton>
      </div>
    </form>

    <!-- Social Sign In Divider -->
    <div class="relative flex items-center justify-center my-6 select-none">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-[#EAEAEA]"></div>
      </div>
      <span class="relative px-4 bg-white text-xs font-medium text-gray-400 uppercase tracking-wider font-inter">
        Atau lanjutkan dengan
      </span>
    </div>

    <!-- Navigation / Footer Toggle -->
    <div class="text-center mt-6 text-sm text-gray-500 font-inter">
      Belum memiliki akun? 
      <NuxtLink to="/register" class="font-bold text-[#1A1A1A] hover:text-[#7A4D30] transition-colors duration-150 font-inter">
        Daftar di sini
      </NuxtLink>
    </div>
  </div>
</template>

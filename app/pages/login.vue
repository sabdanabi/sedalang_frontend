<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  // Mock login delay
  setTimeout(() => {
    isLoading.value = false
    alert(`Berhasil masuk!\nEmail: ${email.value}`)
  }, 1000)
}
</script>

<template>
  <div class="w-full">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="font-poppins text-3xl font-medium tracking-tight text-[#1A1A1A]">
        Selamat Datang Kembali
      </h1>
      <p class="font-inter text-sm text-gray-500 mt-1">
        Masuk ke akun Anda sekarang
      </p>
    </header>

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

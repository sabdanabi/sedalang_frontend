<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'auth'
})

const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  isLoading.value = true
  // Mock registration delay
  setTimeout(() => {
    isLoading.value = false
    alert(`Pendaftaran berhasil!\nNama: ${name.value}\nEmail: ${email.value}`)
  }, 1000)
}
</script>

<template>
  <div class="w-full">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-[#1A1A1A]">
        Mulai Sekarang
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Buat akun Anda sekarang
      </p>
    </header>

    <!-- Registration Form -->
    <form @submit.prevent="handleRegister" class="space-y-5">
      <!-- Name Input -->
      <UiAuthInput
        id="name"
        v-model="name"
        label="Nama"
        placeholder="Masukkan nama Anda"
        required
        autocomplete="name"
      />

      <!-- Phone Input -->
      <UiAuthInput
        id="phone"
        v-model="phone"
        type="tel"
        label="Telepon"
        placeholder="No. Telepon"
        required
        autocomplete="tel"
      />

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
        autocomplete="new-password"
      />

      <!-- Submit Button -->
      <div class="pt-2">
        <UiAuthButton :loading="isLoading">
          Daftar
        </UiAuthButton>
      </div>
    </form>

    <!-- Social Sign In Divider -->
    <div class="relative flex items-center justify-center my-6 select-none">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-[#EAEAEA]"></div>
      </div>
      <span class="relative px-4 bg-white text-xs font-medium text-gray-400 uppercase tracking-wider">
        Atau lanjutkan dengan
      </span>
    </div>

    <!-- Navigation / Footer Toggle -->
    <div class="text-center mt-6 text-sm text-gray-500">
      Sudah memiliki akun? 
      <NuxtLink to="/login" class="font-bold text-[#1A1A1A] hover:text-[#7A4D30] transition-colors duration-150">
        Masuk di sini
      </NuxtLink>
    </div>
  </div>
</template>

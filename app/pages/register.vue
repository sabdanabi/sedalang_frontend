<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()

const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  if (password.value.length < 8) {
    errorMsg.value = 'Password harus terdiri dari minimal 8 karakter.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  try {
    await authStore.register({
      email: email.value,
      password: password.value,
      fullName: name.value,
      phoneNumber: phone.value
    })
    if (import.meta.client) {
      localStorage.setItem('sedalang_new_register', 'true')
    }
    navigateTo('/login?registered=true')
  } catch (err: any) {
    if (err.data?.errors && Array.isArray(err.data.errors) && err.data.errors.length > 0) {
      errorMsg.value = err.data.errors
        .map((e: string) => {
          if (e.includes('email must be an email')) return 'Format email tidak valid.'
          if (e.includes('longer than or equal to 8 characters')) return 'Password harus terdiri dari minimal 8 karakter.'
          if (e.includes('fullName should not be empty')) return 'Nama lengkap tidak boleh kosong.'
          return e
        })
        .join(' ')
    } else {
      errorMsg.value = err.data?.message || 'Registrasi gagal. Silakan coba lagi.'
    }
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
        Mulai Sekarang
      </h1>
      <p class="font-inter text-sm text-gray-500 mt-1">
        Buat akun Anda sekarang
      </p>
    </header>

    <!-- Error Banner -->
    <div v-if="errorMsg" class="mb-5 p-3.5 rounded-[12px] bg-red-50 border border-red-100 text-red-600 text-xs font-semibold font-inter animate-fade-in">
      {{ errorMsg }}
    </div>

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
      <span class="relative px-4 bg-white text-xs font-medium text-gray-400 uppercase tracking-wider font-inter">
        Atau lanjutkan dengan
      </span>
    </div>

    <!-- Navigation / Footer Toggle -->
    <div class="text-center mt-6 text-sm text-gray-500 font-inter">
      Sudah memiliki akun? 
      <NuxtLink to="/login" class="font-bold text-[#1A1A1A] hover:text-[#7A4D30] transition-colors duration-150 font-inter">
        Masuk di sini
      </NuxtLink>
    </div>
  </div>
</template>

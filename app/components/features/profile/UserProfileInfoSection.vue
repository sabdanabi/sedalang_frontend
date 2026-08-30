<script setup lang="ts">
interface UserProfile {
  name: string
  location: string
  email: string
  phone: string
}

defineProps<{
  profile: UserProfile
}>()


</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-6 md:p-8 flex flex-col justify-between space-y-6 text-left h-full shadow-[0_8px_30px_rgba(0,0,0,0.012)]">
    
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-poppins text-lg md:text-xl font-bold text-gray-950">
          Informasi Pengguna
        </h3>
        <p class="font-inter text-xs text-gray-400 mt-1">
          Berikut adalah data pengguna yang tersedia
        </p>
      </div>
    </div>

    <!-- Read-only Fields -->
    <div class="space-y-4">
      
      <!-- Nama Pemilik -->
      <div class="flex flex-col gap-1.5">
        <label class="font-poppins text-xs font-bold text-gray-950">Nama Pemilik</label>
        <input
          :value="profile.name"
          type="text"
          disabled
          class="w-full bg-[#FAF8F5]/80 border border-gray-100 rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-500 outline-none font-inter select-none"
        />
      </div>

      <!-- Lokasi -->
      <div class="flex flex-col gap-1.5">
        <label class="font-poppins text-xs font-bold text-gray-950">Lokasi</label>
        <input
          :value="profile.location"
          type="text"
          disabled
          class="w-full bg-[#FAF8F5]/80 border border-gray-100 rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-500 outline-none font-inter select-none"
        />
      </div>

      <!-- Email and Phone numbers (Side-by-side or stacked on mobile) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- Email -->
        <div class="flex flex-col gap-1.5">
          <label class="font-poppins text-xs font-bold text-gray-950">Email</label>
          <input
            :value="profile.email"
            type="email"
            disabled
            class="w-full bg-[#FAF8F5]/80 border border-gray-100 rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-500 outline-none font-inter select-none"
          />
        </div>

        <!-- Phone -->
        <div class="flex flex-col gap-1.5">
          <label class="font-poppins text-xs font-bold text-gray-950">No. Telepon</label>
          <input
            :value="profile.phone"
            type="text"
            disabled
            class="w-full bg-[#FAF8F5]/80 border border-gray-100 rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-500 outline-none font-inter select-none"
          />
        </div>

      </div>

    </div>

  </div>
</template>

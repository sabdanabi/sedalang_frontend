<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: false // Minimal onboarding layout
})

const currentStep = ref(1)
const selectedRole = ref<'pengguna' | 'pengrajin'>('pengrajin') // Default to 'pengrajin' as in mockup design

const profileForm = ref({
  name: '',
  phone: '',
  location: '',
  skills: '',
  photo: null as File | null
})

// Mock file upload trigger
const fileInput = ref<HTMLInputElement | null>(null)
const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    profileForm.value.photo = target.files[0]
  }
}

// Handlers
const handleNextStep = () => {
  if (selectedRole.value === 'pengguna') {
    // If 'pengguna' is selected, skip profile setup and go directly to landing page
    navigateTo('/')
  } else {
    // If 'pengrajin' is selected, proceed to Step 2 form
    currentStep.value = 2
  }
}

const handleConfirm = () => {
  // Store onboarding completed flag in localStorage
  localStorage.setItem('sedalang_onboarding_completed', 'true')
  localStorage.setItem('sedalang_user_role', selectedRole.value)
  navigateTo('/')
}

const goBack = () => {
  if (currentStep.value === 2) {
    currentStep.value = 1
  } else {
    // Go back to login
    navigateTo('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6 font-inter select-none">
    
    <!-- Main Card Container (Restored to compact vertical mockup dimensions) -->
    <div class="w-full max-w-2xl bg-white border border-[#EAEAEA] rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[640px]">
      
      <!-- Top Section -->
      <div>
        <!-- Back Button -->
        <button 
          @click="goBack" 
          type="button"
          class="text-gray-900 hover:text-[#7F5539] transition-colors cursor-pointer mb-8 focus:outline-none"
          aria-label="Kembali"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        <!-- STEP 1: CHOOSE ROLE -->
        <div v-if="currentStep === 1" class="flex flex-col space-y-6">
          <div>
            <h1 class="font-poppins text-3xl font-bold text-gray-950 tracking-tight leading-tight">
              Pilih Peran Anda
            </h1>
            <p class="font-inter text-sm text-gray-500 mt-2 leading-relaxed">
              Pilih peran yang paling relevan sesuai dengan kebutuhan anda di platform SeDaLang.
            </p>
          </div>

          <!-- Role Cards Grid -->
          <div class="flex flex-col gap-5">
            
            <!-- Card: Pengguna -->
            <div 
              @click="selectedRole = 'pengguna'"
              class="w-full border rounded-[24px] p-6 flex justify-between gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden"
              :class="[
                selectedRole === 'pengguna' 
                  ? 'border-[#7F5539] bg-[#7F553912]' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              ]"
            >
              <div class="flex flex-col justify-between space-y-2 max-w-[480px]">
                <div>
                  <h3 
                    class="font-poppins text-lg font-medium transition-colors duration-300"
                    :class="selectedRole === 'pengguna' ? 'text-[#7F5539]' : 'text-gray-950'"
                  >
                    Pengguna
                  </h3>
                  <p 
                    class="font-poppins text-xs font-medium mt-1 transition-colors duration-300"
                    :class="selectedRole === 'pengguna' ? 'text-[#7F5539]' : 'text-gray-500'"
                  >
                    Pemilik Barang Bekas
                  </p>
                </div>
                <p class="font-inter text-[11px] sm:text-sm text-gray-500 leading-relaxed">
                  Cari ide daur ulang, Analis foto barang dengan AI, dan pesan jasa pengrajin relevan.
                </p>
              </div>
              <img 
                :src="'/images/onboarding_images/pengguna_img.webp'" 
                alt="Pengguna Illustration" 
                class="w-28 h-28 object-contain self-end"
              />
            </div>

            <!-- Card: Pengrajin -->
            <div 
              @click="selectedRole = 'pengrajin'"
              class="w-full border rounded-[24px] p-6 flex justify-between gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden"
              :class="[
                selectedRole === 'pengrajin' 
                  ? 'border-[#7F5539] bg-[#7F553912]' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              ]"
            >
              <div class="flex flex-col justify-between space-y-2 max-w-[480px]">
                <div>
                  <h3 
                    class="font-poppins text-lg font-medium transition-colors duration-300"
                    :class="selectedRole === 'pengrajin' ? 'text-[#7F5539]' : 'text-gray-950'"
                  >
                    Pengrajin
                  </h3>
                  <p 
                    class="font-poppins text-xs font-medium mt-1 transition-colors duration-300"
                    :class="selectedRole === 'pengrajin' ? 'text-[#7F5539]' : 'text-gray-950'"
                  >
                    Craftsman/UMKM
                  </p>
                </div>
                <p class="font-inter text-[11px] sm:text-sm text-gray-500 leading-relaxed">
                  Kelola profil portofolio, terima permintaan material, dan mengajukkan proposal kerja.
                </p>
              </div>
              <img 
                :src="'/images/onboarding_images/pengrajin_img.webp'" 
                alt="Pengrajin Illustration" 
                class="w-28 h-28 object-contain self-end"
              />
            </div>

          </div>
        </div>

        <!-- STEP 2: PROFILE FORM (Only for Pengrajin) -->
        <div v-else class="flex flex-col space-y-6">
          <div>
            <h1 class="font-poppins text-2xl font-bold text-gray-950 tracking-tight">
              Profil Pengrajin Anda
            </h1>
            <p class="font-inter text-sm text-gray-500 mt-1 leading-relaxed">
              Lengkapi informasi profil anda untuk mulai menerima permintaan kerja dari pengguna SeDaLang.
            </p>
          </div>

          <!-- Form Grid -->
          <form class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <!-- Nama -->
              <div class="flex flex-col space-y-1.5">
                <label class="font-poppins text-xs font-bold text-gray-900">Nama</label>
                <input 
                  v-model="profileForm.name"
                  type="text" 
                  placeholder="Masukkan nama"
                  class="border border-gray-200 rounded-[14px] px-4 py-3 text-sm focus:border-[#7F5539] focus:outline-none transition-colors"
                />
              </div>

              <!-- No Telepon -->
              <div class="flex flex-col space-y-1.5">
                <label class="font-poppins text-xs font-bold text-gray-900">No.telepon</label>
                <input 
                  v-model="profileForm.phone"
                  type="tel" 
                  placeholder="Masukkan no. telepon"
                  class="border border-gray-200 rounded-[14px] px-4 py-3 text-sm focus:border-[#7F5539] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Lokasi -->
              <div class="flex flex-col space-y-1.5">
                <label class="font-poppins text-xs font-bold text-gray-900">Lokasi</label>
                <input 
                  v-model="profileForm.location"
                  type="text" 
                  placeholder="Masukkan lokasi"
                  class="border border-gray-200 rounded-[14px] px-4 py-3 text-sm focus:border-[#7F5539] focus:outline-none transition-colors"
                />
              </div>

              <!-- Keahlian -->
              <div class="flex flex-col space-y-1.5">
                <label class="font-poppins text-xs font-bold text-gray-900">Keahlian</label>
                <input 
                  v-model="profileForm.skills"
                  type="text" 
                  placeholder="Masukkan Keahlian"
                  class="border border-gray-200 rounded-[14px] px-4 py-3 text-sm focus:border-[#7F5539] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <!-- Upload Photo Bar -->
            <div class="flex flex-col space-y-1.5 pt-2">
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleFileChange"
              />
              <button 
                @click="triggerFileUpload"
                type="button"
                class="w-full flex items-center justify-between border border-[#7F5539] rounded-[20px] px-5 py-4 cursor-pointer text-[#7F5539] hover:bg-[#7F553912] transition-colors focus:outline-none font-poppins text-sm font-semibold"
              >
                <div class="flex items-center gap-2">
                  <span class="text-lg">+</span>
                  <span>{{ profileForm.photo ? profileForm.photo.name : 'Tambahkan foto' }}</span>
                </div>
                <!-- Paper Plane Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 transform rotate-45">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bottom Button Section -->
      <div class="mt-10">
        
        <!-- Step 1 Button -->
        <button 
          v-if="currentStep === 1"
          @click="handleNextStep"
          type="button"
          class="w-full bg-[#7F5539] hover:bg-[#66432c] text-white font-poppins font-semibold py-4 rounded-[20px] transition-colors duration-200 flex items-center justify-center cursor-pointer shadow-sm focus:outline-none"
        >
          Lanjut Sebagai {{ selectedRole === 'pengguna' ? 'Pengguna' : 'Pengrajin' }}
        </button>

        <!-- Step 2 Button (Confirm) -->
        <button 
          v-else
          @click="handleConfirm"
          type="button"
          class="w-full bg-[#7F5539] hover:bg-[#66432c] text-white font-poppins font-semibold py-4 rounded-[20px] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm focus:outline-none"
        >
          <span>Konfirmasi</span>
          <!-- Arrow Up Right Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>

      </div>

    </div>
  </div>
</template>

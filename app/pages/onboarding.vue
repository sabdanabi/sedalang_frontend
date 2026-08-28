<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()

const currentStep = ref(1)
const selectedRole = ref<'pengguna' | 'pengrajin'>('pengrajin')
const isLoading = ref(false)
const errorMsg = ref('')

const profileForm = ref({
  location: '',
  craftType: '',
  photo: null as File | null
})

// Material tags for Pengrajin
const materials = ref([
  { name: 'Kain Perca', selected: true },
  { name: 'Elektronik', selected: false },
  { name: 'Plastik', selected: false },
  { name: 'Kertas', selected: false },
  { name: 'Kayu', selected: false },
  { name: 'Kaca', selected: false }
])

const toggleMaterial = (index: number) => {
  materials.value[index].selected = !materials.value[index].selected
}

// File upload
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

// Step 1: Select role and proceed
const handleNextStep = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const apiRole = selectedRole.value === 'pengguna' ? 'USER' : 'CRAFTSMAN'
    await authStore.updateRole(apiRole)

    if (selectedRole.value === 'pengguna') {
      // Skip onboarding for regular users → go to dashboard
      await authStore.skipOnboarding()
      navigateTo('/dashboard-aiPage')
    } else {
      // Proceed to craftsman profile form
      currentStep.value = 2
    }
  } catch (err: unknown) {
    const error = err as { data?: { message?: string } }
    errorMsg.value = error.data?.message || 'Gagal memilih peran. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

// Step 2: Submit craftsman onboarding
const handleConfirm = async () => {
  const selectedSkills = materials.value
    .filter(m => m.selected)
    .map(m => m.name)

  if (selectedSkills.length === 0) {
    errorMsg.value = 'Pilih minimal satu material yang Anda terima.'
    return
  }

  if (!profileForm.value.location.trim()) {
    errorMsg.value = 'Lokasi workshop wajib diisi.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    const formData = new FormData()
    formData.append('location', profileForm.value.location)
    formData.append('skills', selectedSkills.join(', '))

    if (profileForm.value.craftType.trim()) {
      formData.append('craftType', profileForm.value.craftType)
    }

    if (profileForm.value.photo) {
      formData.append('portfolios', profileForm.value.photo)
    }

    await authStore.completeCraftsmanOnboarding(formData)
    navigateTo('/dashboard-aiPage')
  } catch (err: unknown) {
    const error = err as { data?: { message?: string } }
    errorMsg.value = error.data?.message || 'Gagal menyimpan data pengrajin. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  errorMsg.value = ''
  if (currentStep.value === 2) {
    currentStep.value = 1
  } else {
    navigateTo('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6 font-inter select-none">
    
    <!-- Main Card Container -->
    <div class="w-full max-w-2xl bg-white border border-[#EAEAEA] rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[640px]">
      
      <!-- Top Section -->
      <div>
        <!-- Back Button -->
        <button 
          @click="goBack" 
          type="button"
          class="text-gray-900 hover:text-[#7F5539] transition-colors cursor-pointer mb-8 focus:outline-none"
          aria-label="Kembali"
          :disabled="isLoading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        <!-- Error Banner -->
        <div v-if="errorMsg" class="mb-5 p-3.5 rounded-[12px] bg-red-50 border border-red-100 text-red-600 text-xs font-semibold font-inter animate-fade-in flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>{{ errorMsg }}</span>
        </div>

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
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Lokasi -->
              <div class="flex flex-col space-y-1.5">
                <label class="font-poppins text-xs font-bold text-gray-900">Lokasi</label>
                <input 
                  v-model="profileForm.location"
                  type="text" 
                  placeholder="Contoh: Sleman, Yogyakarta"
                  class="border border-gray-200 rounded-[14px] px-4 py-3 text-sm focus:border-[#7F5539] focus:outline-none transition-colors"
                />
              </div>

              <!-- Jenis Pengrajin -->
              <div class="flex flex-col space-y-1.5">
                <label class="font-poppins text-xs font-bold text-gray-900">Jenis Pengrajin</label>
                <input 
                  v-model="profileForm.craftType"
                  type="text" 
                  placeholder="Contoh: Pengrajin Kayu & Furnitur"
                  class="border border-gray-200 rounded-[14px] px-4 py-3 text-sm focus:border-[#7F5539] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <!-- Material yang diterima -->
            <div class="flex flex-col space-y-1.5 pt-2">
              <label class="font-poppins text-xs font-bold text-gray-900">Material yang diterima</label>
              <div class="flex flex-wrap gap-2.5">
                <button
                  v-for="(material, index) in materials"
                  :key="material.name"
                  @click="toggleMaterial(index)"
                  type="button"
                  class="px-4 py-2.5 rounded-full border text-xs font-semibold font-poppins transition-all duration-200 cursor-pointer focus:outline-none"
                  :class="[
                    material.selected
                      ? 'border-[#7F5539] text-[#7F5539] bg-[#7F553912]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                  ]"
                >
                  {{ material.name }}
                </button>
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
                  <span>{{ profileForm.photo ? profileForm.photo.name : 'Tambahkan foto portofolio' }}</span>
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
          :disabled="isLoading"
          class="w-full bg-[#7F5539] hover:bg-[#66432c] text-white font-poppins font-semibold py-4 rounded-[20px] transition-colors duration-200 flex items-center justify-center cursor-pointer shadow-sm focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Memproses...' : `Lanjut Sebagai ${selectedRole === 'pengguna' ? 'Pengguna' : 'Pengrajin'}` }}
        </button>

        <!-- Step 2 Buttons (Kembali & Simpan Data) -->
        <div v-else class="grid grid-cols-2 gap-4">
          <!-- Kembali Button -->
          <button 
            @click="goBack"
            type="button"
            :disabled="isLoading"
            class="w-full border border-[#7F5539] text-[#7F5539] bg-white hover:bg-[#7F553912] font-poppins font-semibold py-4 rounded-[20px] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>Kembali</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>

          <!-- Simpan Data Button -->
          <button 
            @click="handleConfirm"
            type="button"
            :disabled="isLoading"
            class="w-full bg-[#7F5539] hover:bg-[#66432c] text-white font-poppins font-semibold py-4 rounded-[20px] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Data' }}</span>
            <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

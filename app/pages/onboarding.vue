<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'
import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(workerUrl)

definePageMeta({
  layout: false
})

const authStore = useAuthStore()

const currentStep = ref(1)
const selectedRole = ref<'pengguna' | 'pengrajin'>('pengrajin')
const isLoading = ref(false)
const isLoadingLocation = ref(false)
const errorMsg = ref('')

// Map refs
const mapContainer = ref<HTMLElement | null>(null)
let mapInstance: maplibregl.Map | null = null
let locationMarker: maplibregl.Marker | null = null

const hasLocation = computed(() => profileForm.value.latitude != null && profileForm.value.longitude != null)

const initOrUpdateMap = (lat: number, lng: number) => {
  const coords: [number, number] = [lng, lat]
  if (mapInstance && locationMarker) {
    mapInstance.flyTo({ center: coords, zoom: 14, essential: true })
    locationMarker.setLngLat(coords)
  } else if (mapContainer.value) {
    mapInstance = new maplibregl.Map({
      container: mapContainer.value,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors'
          }
        },
        layers: [{ id: 'osm-layer', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }]
      },
      center: coords,
      zoom: 14
    })
    mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right')
    locationMarker = new maplibregl.Marker({ color: '#7A4D30' }).setLngLat(coords).addTo(mapInstance)
  }
}

onBeforeUnmount(() => {
  if (locationMarker) locationMarker.remove()
  if (mapInstance) mapInstance.remove()
})

const profileForm = ref({
  fullName: '',
  phoneNumber: '',
  location: '',
  skills: '',
  photo: null as File | null,
  latitude: null as number | null,
  longitude: null as number | null
})

onMounted(async () => {
  if (!authStore.user) {
    try {
      await authStore.getMe()
    } catch (e) {
      console.error('Error loading user during onboarding mount:', e)
    }
  }
  if (authStore.user) {
    profileForm.value.fullName = authStore.user.fullName || ''
    profileForm.value.phoneNumber = authStore.user.phoneNumber || ''
  }
})

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

// Geolocation with OSM Nominatim reverse geocoding
const handleGetMyLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolokasi tidak didukung oleh browser Anda.')
    return
  }

  isLoadingLocation.value = true
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      profileForm.value.latitude = latitude
      profileForm.value.longitude = longitude

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
        const data = await response.json()
        if (data && data.address) {
          const address = data.address
          const city = address.city || address.town || address.municipality || address.county || ''
          const road = address.road || ''
          const neighborhood = address.neighbourhood || address.suburb || ''

          const formattedParts = [road, neighborhood, city].filter(Boolean)
          profileForm.value.location = formattedParts.join(', ') || data.display_name
        } else {
          profileForm.value.location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }
      } catch (err) {
        console.error('Reverse geocoding error:', err)
        profileForm.value.location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      } finally {
        isLoadingLocation.value = false
        await nextTick()
        initOrUpdateMap(latitude, longitude)
      }
    },
    (error) => {
      console.error('Geolocation acquisition error:', error)
      alert('Gagal mendapatkan lokasi. Pastikan izin akses lokasi diaktifkan di browser Anda.')
      isLoadingLocation.value = false
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
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
  if (!profileForm.value.fullName.trim()) {
    errorMsg.value = 'Nama wajib diisi.'
    return
  }

  if (!profileForm.value.phoneNumber.trim()) {
    errorMsg.value = 'No. telepon wajib diisi.'
    return
  }

  if (!profileForm.value.location.trim()) {
    errorMsg.value = 'Lokasi workshop wajib diisi.'
    return
  }

  if (!profileForm.value.skills.trim()) {
    errorMsg.value = 'Keahlian wajib diisi.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  try {
    // 1. Update user general info (fullName & phoneNumber)
    await authStore.updateUserProfile({
      fullName: profileForm.value.fullName,
      phoneNumber: profileForm.value.phoneNumber
    })

    // 2. Complete craftsman onboarding (location, skills, coordinates, portfolio)
    const formData = new FormData()
    formData.append('location', profileForm.value.location)
    formData.append('skills', profileForm.value.skills)
    formData.append('craftType', profileForm.value.skills)

    if (profileForm.value.latitude != null) {
      formData.append('latitude', String(profileForm.value.latitude))
    }
    if (profileForm.value.longitude != null) {
      formData.append('longitude', String(profileForm.value.longitude))
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
          <!-- Form Grid -->
          <form @submit.prevent="handleConfirm" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <!-- Nama -->
              <div class="flex flex-col gap-1.5 text-left">
                <label class="font-poppins text-xs font-bold text-gray-800">Nama</label>
                <input
                  v-model="profileForm.fullName"
                  type="text"
                  placeholder="Masukkan nama"
                  required
                  class="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#7A4D30]/60 rounded-xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
                />
              </div>

              <!-- No.telepon -->
              <div class="flex flex-col gap-1.5 text-left">
                <label class="font-poppins text-xs font-bold text-gray-800">No.telepon</label>
                <input
                  v-model="profileForm.phoneNumber"
                  type="text"
                  placeholder="Masukkan no. telepon"
                  required
                  class="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#7A4D30]/60 rounded-xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
                />
              </div>

              <!-- Lokasi -->
              <div class="flex flex-col gap-1.5 text-left">
                <label class="font-poppins text-xs font-bold text-gray-800">Lokasi</label>
                <input
                  v-model="profileForm.location"
                  type="text"
                  placeholder="Masukkan lokasi"
                  required
                  class="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#7A4D30]/60 rounded-xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
                />
              </div>

              <!-- Keahlian -->
              <div class="flex flex-col gap-1.5 text-left">
                <label class="font-poppins text-xs font-bold text-gray-800">Keahlian</label>
                <input
                  v-model="profileForm.skills"
                  type="text"
                  placeholder="Masukkan Keahlian"
                  required
                  class="w-full bg-white border border-gray-200 hover:border-gray-300 focus:border-[#7A4D30]/60 rounded-xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
                />
              </div>
            </div>

            <!-- Buttons Row -->
            <div class="grid grid-cols-2 gap-4 pt-2">
              <!-- Geolocation Button -->
              <button
                type="button"
                @click="handleGetMyLocation"
                :disabled="isLoadingLocation"
                class="w-full border border-[#835338] text-[#835338] hover:bg-[#835338]/5 py-3 rounded-full text-xs md:text-sm font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none disabled:opacity-60"
              >
                <!-- Location pin icon -->
                <svg v-if="!isLoadingLocation" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-[#835338]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <svg v-else class="animate-spin h-4 w-4 text-[#835338]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isLoadingLocation ? 'Mencari...' : 'Lokasi Saya' }}</span>
              </button>

              <!-- Photo Upload Button -->
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleFileChange"
              />
              <button
                type="button"
                @click="triggerFileUpload"
                class="w-full border border-[#835338] text-[#835338] hover:bg-[#835338]/5 py-3 rounded-full text-xs md:text-sm font-bold font-inter transition-all duration-300 flex items-center justify-between px-6 cursor-pointer focus:outline-none"
              >
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-base font-semibold flex-shrink-0">+</span>
                  <span class="truncate">{{ profileForm.photo ? profileForm.photo.name : 'Tambahkan foto' }}</span>
                </div>
                <!-- Paper plane/share icon rotated -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-[#835338] transform rotate-45 flex-shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>

          <!-- Map Preview setelah lokasi didapat -->
          <Transition name="fade">
            <div v-if="hasLocation" class="w-full h-48 rounded-[24px] overflow-hidden border border-gray-150 shadow-sm mt-2 relative z-10">
              <div ref="mapContainer" class="w-full h-full"></div>
            </div>
          </Transition>
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

        <!-- Step 2 Button (Konfirmasi) -->
        <button 
          v-else
          @click="handleConfirm"
          type="button"
          :disabled="isLoading"
          class="w-full bg-[#835338] hover:bg-[#6e432c] text-white font-poppins font-semibold py-4 rounded-full transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else class="flex items-center gap-1.5 font-bold font-poppins">
            Konfirmasi
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </span>
        </button>

      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

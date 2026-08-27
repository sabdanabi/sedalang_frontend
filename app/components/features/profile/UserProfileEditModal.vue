<script setup lang="ts">
import { ref, watch } from 'vue'

interface UserProfile {
  name: string
  location: string
  email: string
  phone: string
  avatar: string
}

const props = defineProps<{
  show: boolean
  profile: UserProfile
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: UserProfile): void
}>()

const formName = ref('')
const formLocation = ref('')
const formEmail = ref('')
const formPhone = ref('')
const formAvatar = ref('')

// Watch changes to populate form
watch(() => props.profile, (newVal) => {
  if (newVal) {
    formName.value = newVal.name
    formLocation.value = newVal.location
    formEmail.value = newVal.email
    formPhone.value = newVal.phone
    formAvatar.value = newVal.avatar
  }
}, { immediate: true })

const fileInput = ref<HTMLInputElement | null>(null)

const triggerAvatarUpload = () => {
  fileInput.value?.click()
}

const onAvatarSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        formAvatar.value = event.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

// Geolocation lookup for current location address text
const handleGetMyLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation tidak didukung browser Anda.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Mocking lookups to Semarang based coordinates
      formLocation.value = 'Semarang Tengah, Jawa Tengah'
      alert('Lokasi dideteksi: Semarang Tengah, Jawa Tengah')
    },
    (err) => {
      console.error(err)
      alert('Gagal melacak lokasi. Pastikan GPS aktif dan izin diberikan.')
    }
  )
}

const handleFormSubmit = () => {
  if (!formName.value.trim() || !formLocation.value.trim() || !formEmail.value.trim()) {
    alert('Nama, Lokasi, dan Email tidak boleh kosong.')
    return
  }

  emit('submit', {
    name: formName.value.trim(),
    location: formLocation.value.trim(),
    email: formEmail.value.trim(),
    phone: formPhone.value.trim(),
    avatar: formAvatar.value
  })
}
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="scale">
        <div class="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-6 md:p-8 text-left max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <!-- Close Button -->
          <button 
            @click="$emit('close')"
            class="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white border border-gray-150 hover:border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4.5 h-4.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="mb-6">
            <h3 class="font-poppins text-xl font-bold text-gray-950">
              Edit Profil Pengguna
            </h3>
            <p class="font-inter text-xs text-gray-400 mt-1">
              Perbarui informasi identitas dan detail kontak profil Anda
            </p>
          </div>

          <!-- Form Area -->
          <form @submit.prevent="handleFormSubmit" class="space-y-4">
            
            <!-- Avatar Upload Row -->
            <div class="flex items-center gap-4 py-2">
              <div class="relative w-20 h-20 rounded-[20px] overflow-hidden bg-gray-50 border border-gray-150 flex-shrink-0">
                <img
                  :src="formAvatar || '/images/landing_page_images/default_pp.webp'"
                  alt="Avatar Preview"
                  class="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="hidden"
                @change="onAvatarSelected"
              />
              <button
                type="button"
                @click="triggerAvatarUpload"
                class="border border-[#7A4D30]/60 text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2 px-4 rounded-full text-xs font-bold font-inter cursor-pointer focus:outline-none"
              >
                Ganti Foto Profil
              </button>
            </div>

            <!-- Nama Pemilik -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Nama Pemilik</label>
              <input
                v-model="formName"
                type="text"
                placeholder="Contoh: Bruno James"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
              />
            </div>

            <!-- Lokasi Input with Lokasi Saya button -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Lokasi</label>
              <div class="flex gap-2">
                <input
                  v-model="formLocation"
                  type="text"
                  placeholder="Contoh: Semarang Tengah, Jawa Tengah"
                  class="flex-grow bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
                />
                <button
                  type="button"
                  @click="handleGetMyLocation"
                  class="bg-[#7A4D30]/5 text-[#7A4D30] border border-[#7A4D30]/20 hover:bg-[#7A4D30]/10 px-4 rounded-2xl text-xs font-bold font-inter cursor-pointer focus:outline-none flex-shrink-0 flex items-center justify-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Lokasi Saya
                </button>
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Email</label>
              <input
                v-model="formEmail"
                type="email"
                placeholder="Contoh: brunojames@gmail.com"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
              />
            </div>

            <!-- No. Telepon -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">No. Telepon</label>
              <input
                v-model="formPhone"
                type="text"
                placeholder="Contoh: +62 812-9753-6492"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
              />
            </div>

            <!-- Action buttons -->
            <div class="grid grid-cols-2 gap-3.5 pt-4">
              <button
                type="button"
                @click="$emit('close')"
                class="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer focus:outline-none"
              >
                Batal
              </button>
              <button
                type="submit"
                class="w-full bg-[#7A4D30] hover:bg-[#683E25] text-white py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
              >
                Simpan Perubahan
              </button>
            </div>

          </form>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #FAF3EE;
  border-radius: 999px;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ProfileData {
  name: string
  description: string
  location: string
  projectsCount: number
  avatar: string
  skills: string[]
}

const props = defineProps<{
  show: boolean
  profile: ProfileData
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: ProfileData): void
}>()

const formName = ref('')
const formDesc = ref('')
const formLocation = ref('')
const formProjects = ref(0)
const formAvatar = ref('')
const formSkills = ref<string[]>([])
const newSkillInput = ref('')

// Watch changes to populate form
watch(() => props.profile, (newVal) => {
  if (newVal) {
    formName.value = newVal.name
    formDesc.value = newVal.description
    formLocation.value = newVal.location
    formProjects.value = newVal.projectsCount
    formAvatar.value = newVal.avatar
    formSkills.value = [...(newVal.skills || [])]
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
      formLocation.value = 'Pedurungan, Semarang'
      alert('Lokasi dideteksi: Pedurungan, Semarang')
    },
    (err) => {
      console.error(err)
      alert('Gagal melacak lokasi. Pastikan GPS aktif dan izin diberikan.')
    }
  )
}

// Add skill to temporary local state inside form modal
const handleAddSkill = () => {
  const trimmed = newSkillInput.value.trim()
  if (!trimmed) return
  if (!formSkills.value.includes(trimmed)) {
    formSkills.value.push(trimmed)
  }
  newSkillInput.value = ''
}

// Remove skill from temporary local state inside form modal
const handleRemoveSkill = (skillToRemove: string) => {
  formSkills.value = formSkills.value.filter(s => s !== skillToRemove)
}

const handleFormSubmit = () => {
  if (!formName.value.trim() || !formLocation.value.trim()) {
    alert('Nama dan Lokasi tidak boleh kosong.')
    return
  }

  emit('submit', {
    name: formName.value.trim(),
    description: formDesc.value.trim(),
    location: formLocation.value.trim(),
    projectsCount: Number(formProjects.value) || 0,
    avatar: formAvatar.value,
    skills: formSkills.value
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
              Edit Profil Pengrajin
            </h3>
            <p class="font-inter text-xs text-gray-400 mt-1">
              Perbarui informasi identitas dan detail pengerjaan profil Anda
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

            <!-- Nama Pengrajin -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Nama Pengrajin</label>
              <input
                v-model="formName"
                type="text"
                placeholder="Contoh: KaryaLoka Craft"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
              />
            </div>

            <!-- Deskripsi Pengrajin -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Deskripsi / Slogan</label>
              <input
                v-model="formDesc"
                type="text"
                placeholder="Contoh: Pengrajin Kaca & Kreator Vas"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
              />
            </div>

            <!-- Lokasi Input with Lokasi Saya button -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Lokasi / Alamat</label>
              <div class="flex gap-2">
                <input
                  v-model="formLocation"
                  type="text"
                  placeholder="Contoh: Tembalang, Semarang"
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

            <!-- Keahlian & Material Editor -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Keahlian & Material</label>
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newSkillInput"
                  type="text"
                  placeholder="Keahlian baru..."
                  class="flex-grow bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
                  @keydown.enter.prevent="handleAddSkill"
                />
                <button
                  type="button"
                  @click="handleAddSkill"
                  class="bg-[#7A4D30] hover:bg-[#683E25] text-white px-5 rounded-2xl text-xs font-bold font-inter cursor-pointer focus:outline-none flex-shrink-0"
                >
                  Tambah
                </button>
              </div>

              <!-- List of current skills with delete 'x' button -->
              <div class="flex flex-wrap gap-2 pt-1">
                <span
                  v-for="skill in formSkills"
                  :key="skill"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-150 text-gray-700 text-[11px] font-bold font-inter bg-white select-none"
                >
                  {{ skill }}
                  <button
                    type="button"
                    @click="handleRemoveSkill(skill)"
                    class="text-gray-400 hover:text-[#7A4D30] transition-colors focus:outline-none cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>

            <!-- Proyek Selesai -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Jumlah Proyek Selesai</label>
              <input
                v-model="formProjects"
                type="number"
                min="0"
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

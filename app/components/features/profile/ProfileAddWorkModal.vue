<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: { title: string; image: string; description: string }): void
}>()

const workTitle = ref('')
const workImage = ref('')
const workDesc = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const triggerImageUpload = () => {
  fileInput.value?.click()
}

const onImageSelected = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        workImage.value = event.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

const handleFormSubmit = () => {
  if (!workTitle.value.trim() || !workDesc.value.trim()) {
    alert('Judul dan Deskripsi karya tidak boleh kosong.')
    return
  }

  emit('submit', {
    title: workTitle.value.trim(),
    image: workImage.value, // falls back to default inside grid if empty
    description: workDesc.value.trim()
  })

  // Clear inputs
  workTitle.value = ''
  workImage.value = ''
  workDesc.value = ''
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
        <div class="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-6 md:p-8 text-left">
          
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
              Tambah Karya Baru
            </h3>
            <p class="font-inter text-xs text-gray-400 mt-1">
              Tambahkan hasil karya terbaik untuk melengkapi portofolio profil
            </p>
          </div>

          <!-- Form Area -->
          <form @submit.prevent="handleFormSubmit" class="space-y-4">
            
            <!-- Image Upload Preview Box -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Foto Karya</label>
              <div 
                @click="triggerImageUpload"
                class="w-full h-40 border border-dashed border-gray-200 hover:border-[#7A4D30]/40 rounded-2xl bg-[#FAF8F5]/80 flex flex-col items-center justify-center cursor-pointer overflow-hidden group select-none"
              >
                <img
                  v-if="workImage"
                  :src="workImage"
                  alt="Work Preview"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-center space-y-1.5 p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-8 h-8 text-gray-400 group-hover:text-[#7A4D30] mx-auto transition-colors">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  </svg>
                  <span class="text-xs text-gray-400 group-hover:text-[#7A4D30] font-medium transition-colors font-inter block">Pilih File Gambar</span>
                </div>
              </div>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="hidden"
                @change="onImageSelected"
              />
            </div>

            <!-- Judul Karya -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Judul Karya</label>
              <input
                v-model="workTitle"
                type="text"
                placeholder="Contoh: Vas Bunga Botol Kaca"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter"
              />
            </div>

            <!-- Deskripsi Karya -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Deskripsi Karya</label>
              <textarea
                v-model="workDesc"
                rows="4"
                placeholder="Jelaskan proses pembuatan dan bahan yang digunakan..."
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter resize-none"
              ></textarea>
            </div>

            <!-- Action buttons -->
            <div class="grid grid-cols-2 gap-3 pt-2">
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
                Simpan Karya
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
</style>

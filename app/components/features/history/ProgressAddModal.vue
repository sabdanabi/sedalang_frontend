<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: { title: string; description: string; status: string; imageFile: File | null }): void
}>()

const progressTitle = ref('')
const progressDesc = ref('')
const progressStatus = ref('Pending')

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

const handleFormSubmit = () => {
  if (!progressTitle.value.trim() || !progressDesc.value.trim()) {
    alert('Silakan isi judul dan deskripsi progres.')
    return
  }

  emit('submit', {
    title: progressTitle.value.trim(),
    description: progressDesc.value.trim(),
    status: progressStatus.value,
    imageFile: selectedFile.value
  })

  // Clear inputs
  progressTitle.value = ''
  progressDesc.value = ''
  progressStatus.value = 'Pending'
  removeFile()
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
              Tambah Progres Baru
            </h3>
            <p class="font-inter text-xs text-gray-400 mt-1">
              Tambahkan detail pengerjaan terkini untuk memantau pesanan
            </p>
          </div>

          <!-- Form Area -->
          <form @submit.prevent="handleFormSubmit" class="space-y-4">
            
            <!-- Judul Progres -->
            <div class="flex flex-col gap-1.5 text-left">
              <label class="font-poppins text-xs font-bold text-gray-950">Judul Progres</label>
              <input
                v-model="progressTitle"
                type="text"
                placeholder="Contoh: Produksi Selesai, Finishing"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
              />
            </div>

            <!-- Deskripsi Progres -->
            <div class="flex flex-col gap-1.5 text-left">
              <label class="font-poppins text-xs font-bold text-gray-950">Deskripsi Progres</label>
              <textarea
                v-model="progressDesc"
                rows="4"
                placeholder="Jelaskan detail progres pengerjaan saat ini..."
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter resize-none"
              ></textarea>
            </div>

            <!-- Status Pesanan Dropdown -->
            <div class="flex flex-col gap-1.5 text-left">
              <label class="font-poppins text-xs font-bold text-gray-950">Status Pesanan</label>
              <select
                v-model="progressStatus"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter appearance-none cursor-pointer"
                style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke-width=%222.5%22 stroke=%22%237A4D30%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19.5 8.25l-7.5 7.5-7.5-7.5%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1rem;"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="In Progress">In Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </div>

            <!-- Unggah Gambar Progres (Opsional) -->
            <div class="flex flex-col gap-1.5 text-left">
              <label class="font-poppins text-xs font-bold text-gray-950">Foto Progres (Opsional)</label>
              
              <!-- File selector trigger -->
              <div 
                v-if="!previewUrl"
                class="border-2 border-dashed border-gray-200 hover:border-[#7A4D30]/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-[#FAF8F5]/40"
                @click="($refs.fileInput as HTMLInputElement).click()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                <span class="font-inter text-xs text-gray-500 font-medium">Klik untuk pilih gambar</span>
                <input 
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
              </div>

              <!-- File preview with remove button -->
              <div 
                v-else
                class="relative rounded-2xl overflow-hidden border border-gray-100 h-32 w-full bg-gray-50"
              >
                <img :src="previewUrl" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removeFile"
                  class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors cursor-pointer focus:outline-none"
                  title="Hapus"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit Button (Solid brown, full-width) -->
            <div class="pt-2">
              <button
                type="submit"
                class="w-full bg-[#7A4D30] hover:bg-[#683E25] text-white py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
              >
                Simpan Progres
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

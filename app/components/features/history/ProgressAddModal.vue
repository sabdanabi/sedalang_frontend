<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: { title: string; description: string }): void
}>()

const progressTitle = ref('')
const progressDesc = ref('')

const handleFormSubmit = () => {
  if (!progressTitle.value.trim() || !progressDesc.value.trim()) {
    alert('Silakan isi judul dan deskripsi progres.')
    return
  }

  emit('submit', {
    title: progressTitle.value.trim(),
    description: progressDesc.value.trim()
  })

  // Clear inputs
  progressTitle.value = ''
  progressDesc.value = ''
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

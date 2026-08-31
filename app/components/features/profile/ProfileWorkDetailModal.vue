<script setup lang="ts">
interface WorkItem {
  id: number
  title: string
  description: string
  image: string
}

defineProps<{
  show: boolean
  work: WorkItem | null
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="show && work" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="scale">
        <div class="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-6 md:p-8 text-left">
          
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

          <!-- Detail Work Image -->
          <div class="w-full h-56 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 mb-5">
            <img
              :src="work.image || '/images/default_images/default_img.webp'"
              alt="Detail Work"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Header -->
          <div class="mb-4">
            <h3 class="font-poppins text-lg md:text-xl font-bold text-gray-950">
              {{ work.title }}
            </h3>
          </div>

          <!-- Description Text -->
          <div class="space-y-4 max-h-[25vh] overflow-y-auto pr-2 custom-scrollbar text-left">
            <p class="font-inter text-xs md:text-sm text-gray-500 leading-relaxed">
              {{ work.description }}
            </p>
          </div>

          <!-- Bottom close action -->
          <div class="pt-5 border-t border-gray-100 mt-5">
            <button
              type="button"
              @click="$emit('close')"
              class="w-full bg-[#7A4D30] hover:bg-[#683E25] text-white py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Tutup
            </button>
          </div>

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

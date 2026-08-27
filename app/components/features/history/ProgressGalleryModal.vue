<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
  photos: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const activeIndex = ref(0)

const prevSlide = () => {
  if (props.photos.length === 0) return
  activeIndex.value = (activeIndex.value - 1 + props.photos.length) % props.photos.length
}

const nextSlide = () => {
  if (props.photos.length === 0) return
  activeIndex.value = (activeIndex.value + 1) % props.photos.length
}
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="show && photos.length > 0" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      @click.self="$emit('close')"
    >
      <!-- Close (X) Button -->
      <button 
        @click="$emit('close')"
        class="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer focus:outline-none"
        aria-label="Tutup"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Carousel Content Frame -->
      <div class="relative w-full max-w-4xl flex items-center justify-center">
        
        <!-- Left Arrow Trigger -->
        <button
          v-if="photos.length > 1"
          @click="prevSlide"
          class="absolute left-0 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer focus:outline-none"
          title="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <!-- Active Media Picture Preview -->
        <div class="w-full max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl select-none">
          <img
            :src="photos[activeIndex]"
            alt="Gallery Photo"
            class="max-w-full max-h-[70vh] object-contain transition-all duration-350"
          />
        </div>

        <!-- Right Arrow Trigger -->
        <button
          v-if="photos.length > 1"
          @click="nextSlide"
          class="absolute right-0 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer focus:outline-none"
          title="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      </div>

      <!-- Photo Index Indicator Footer -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-inter tracking-wider">
        {{ activeIndex + 1 }} / {{ photos.length }}
      </div>

    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

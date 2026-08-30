<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="scale">
        <div class="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-6 md:p-8 text-center">
          
          <!-- Warning Icon -->
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 text-red-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          <!-- Header -->
          <div class="mb-6">
            <h3 class="font-poppins text-lg font-bold text-gray-950">
              Hapus Karya?
            </h3>
            <p class="font-inter text-xs md:text-sm text-gray-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus karya ini dari portofolio Anda? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <!-- Action buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="w-full border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Tidak
            </button>
            <button
              type="button"
              @click="$emit('confirm')"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full text-xs font-bold transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
            >
              Iya
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
</style>

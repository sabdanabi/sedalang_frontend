<script setup lang="ts">
interface WorkItem {
  id: number
  title: string
  description: string
  image: string
}

withDefaults(
  defineProps<{
    works: WorkItem[]
    isOwnProfile?: boolean
  }>(),
  {
    isOwnProfile: true
  }
)

defineEmits<{
  (e: 'add-work'): void
  (e: 'delete-work', url: string): void
}>()
</script>

<template>
  <div class="space-y-6 text-left">
    
    <!-- Header control row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="font-poppins text-lg md:text-xl font-bold text-gray-950">
          Portofolio Karya
        </h3>
        <p class="font-inter text-xs md:text-sm text-gray-500 mt-1">
          Tampilkan hasil karya terbaik untuk membantu pengguna mengenal karya kita
        </p>
      </div>

      <!-- Tambah Karya Trigger -->
      <button
        v-if="isOwnProfile"
        type="button"
        @click="$emit('add-work')"
        class="border border-[#7A4D30]/60 hover:border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2.5 px-6 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none flex-shrink-0"
      >
        <!-- Plus icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Karya
      </button>
    </div>

    <!-- Gallery Grid (3 columns wrapping automatically) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="item in works" 
        :key="item.id"
        class="group bg-white border border-[#EAEAEA] rounded-[32px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.012)] hover:shadow-[0_12px_40px_rgba(122,77,48,0.08)] transition-all duration-500 text-left"
      >
        <!-- Work Image with fallback default_img.webp -->
        <div class="w-full h-64 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
          <img
            :src="item.image || '/images/default_images/default_img.webp'"
            alt="Work Image"
            class="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
          />
          <!-- Premium hover effect overlay -->
          <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <!-- Delete button (X) on top-right -->
          <button
            v-if="isOwnProfile"
            type="button"
            @click.stop="$emit('delete-work', item.image)"
            class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 shadow-md flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none"
            title="Hapus Karya"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

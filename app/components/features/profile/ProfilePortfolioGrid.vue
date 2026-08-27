<script setup lang="ts">
interface WorkItem {
  id: number
  title: string
  description: string
  image: string
}

defineProps<{
  works: WorkItem[]
}>()

defineEmits<{
  (e: 'add-work'): void
  (e: 'view-detail', item: WorkItem): void
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
        class="bg-white border border-[#EAEAEA] rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.012)] flex flex-col justify-between space-y-4 text-left h-full"
      >
        <!-- Work Image with fallback default_img.webp -->
        <div class="w-full h-48 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          <img
            :src="item.image || '/images/default_images/default_img.webp'"
            alt="Work Image"
            class="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
          />
        </div>

        <!-- Detail info -->
        <div class="space-y-1.5 flex-grow">
          <h4 class="font-poppins text-base font-bold text-gray-950 truncate">
            {{ item.title }}
          </h4>
          <p class="font-inter text-xs text-gray-500 leading-relaxed line-clamp-3">
            {{ item.description }}
          </p>
        </div>

        <!-- Bottom Action button: Selengkapnya -->
        <div class="pt-2 select-none">
          <button
            type="button"
            @click="$emit('view-detail', item)"
            class="w-full border border-[#7A4D30]/60 text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2.5 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
          >
            Selengkapnya
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

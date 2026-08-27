<script setup lang="ts">
interface Craftsman {
  id: string
  name: string
  location: string
  avatar: string
  heroImage: string
  specialty: string
  rating: number
  description: string
  tags: string[]
  thumbnails: string[]
}

defineProps<{
  craftsman: Craftsman
}>()

defineEmits<{
  (e: 'select-craftsman', id: string): void
}>()
</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.012)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.025)] transition-all duration-350 flex flex-col justify-between text-left space-y-5 h-full">
    
    <!-- Top Row: Profile Avatar, Artisan Name, and Location -->
    <div class="flex items-center gap-3">
      <!-- Avatar -->
      <img
        :src="craftsman.avatar || '/images/landing_page_images/default_pp.webp'"
        alt="Artisan Avatar"
        class="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
      />
      <div class="space-y-0.5">
        <h4 class="font-poppins text-base font-bold text-gray-950 leading-none">
          {{ craftsman.name }}
        </h4>
        <div class="flex items-center gap-1 text-gray-400 font-inter text-[11px] font-semibold">
          <!-- Pin Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3 text-[#7A4D30]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {{ craftsman.location }}
        </div>
      </div>
    </div>

    <!-- Middle Hero Image -->
    <div class="w-full h-40 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
      <img
        :src="craftsman.heroImage || '/images/default_images/default_img.webp'"
        alt="Workshop Hero"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Specialty Title & Rating -->
    <div class="flex items-center justify-between gap-3 pt-0.5">
      <h5 class="font-poppins text-sm md:text-base font-extrabold text-gray-950 truncate">
        {{ craftsman.specialty }}
      </h5>
      <div class="flex items-center gap-1 text-amber-500 font-inter text-xs font-bold flex-shrink-0 select-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.378 21.268c-1.017.607-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
        </svg>
        {{ craftsman.rating }}
      </div>
    </div>

    <!-- Bio Description -->
    <p class="font-inter text-xs text-gray-500 leading-relaxed line-clamp-2">
      {{ craftsman.description }}
    </p>

    <!-- Handled Material Pills -->
    <div class="flex flex-wrap gap-2 pt-1">
      <span 
        v-for="tag in craftsman.tags" 
        :key="tag"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-gray-100 text-gray-500 text-[10px] font-bold font-inter select-none"
      >
        <!-- Bullet point representation in badge -->
        <span class="w-1.5 h-1.5 rounded-full bg-[#7A4D30]/40"></span>
        {{ tag }}
      </span>
    </div>

    <!-- Prev Crafts Thumbnail Row -->
    <div class="grid grid-cols-3 gap-3.5 pt-2">
      <div 
        v-for="(thumb, idx) in craftsman.thumbnails.slice(0, 3)" 
        :key="idx"
        class="h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0"
      >
        <img
          :src="thumb || '/images/default_images/default_img.webp'"
          alt="Craft Work Thumbnail"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Actions Row Buttons -->
    <div class="grid grid-cols-2 gap-3 pt-3">
      <!-- Lihat Profile Button -->
      <button
        type="button"
        class="w-full border border-[#7A4D30]/60 text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2.5 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
      >
        Lihat Profile
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button>

      <!-- Pilih Pengrajin Button -->
      <button
        type="button"
        @click="$emit('select-craftsman', craftsman.name)"
        class="w-full bg-[#7A4D30] hover:bg-[#683E25] text-white py-2.5 rounded-full text-xs font-bold font-inter shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
      >
        Pilih Pengrajin
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </button>
    </div>

  </div>
</template>

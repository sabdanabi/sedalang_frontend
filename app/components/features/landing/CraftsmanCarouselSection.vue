<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCraftsmanStore } from '~/stores/craftsman'
import { useApi } from '~/composables/useApiFetch'

const route = useRoute()
const craftsmanStore = useCraftsmanStore()

// Define default images as requested
const defaultImg = '/images/default_images/default_img.webp'

const ideaId = ref<string | null>(null)
const isFallback = ref(false)

// Proxy matching store values to UI mapped craftsman structure
const craftsmen = computed(() => {
  return craftsmanStore.matchedCraftsmen.map((c: any) => {
    const rawPortfolio = c.portfolioUrls || []
    const portfolio = rawPortfolio.length > 0
      ? [...rawPortfolio.slice(0, 3), ...Array(Math.max(0, 3 - rawPortfolio.length)).fill(defaultImg)]
      : [defaultImg, defaultImg, defaultImg]

    // Construct a premium and beautiful description
    const skillsStr = c.skills && c.skills.length > 0 ? c.skills.join(', ') : ''
    const description = skillsStr
      ? `Mengkhususkan diri sebagai ${c.craftType || 'pengrajin kreatif'}. Ahli dalam mengolah dan mendaur ulang bahan ${skillsStr} menjadi produk berkualitas.`
      : `Pengrajin terampil yang berfokus pada bidang ${c.craftType || 'kerajinan tangan'} berkualitas tinggi.`

    return {
      id: c.id,
      name: c.user?.fullName || c.fullName || 'Pengrajin',
      location: c.location || 'Semarang Tengah',
      category: c.craftType || 'Pengrajin Kreatif',
      rating: c.averageRating || 5.0,
      description,
      badges: c.skills || [],
      mainImage: rawPortfolio.length > 0 ? rawPortfolio[0] : defaultImg,
      portfolio,
      avatarUrl: c.user?.avatarUrl || c.avatarUrl || null
    }
  })
})

const isLoading = computed(() => craftsmanStore.isLoading)
const errorMessage = computed(() => craftsmanStore.errorMessage)

const currentIndex = ref(0)
const total = computed(() => craftsmen.value.length)

onMounted(async () => {
  if (import.meta.client) {
    const queryId = route.query.ideaId as string
    if (queryId) {
      ideaId.value = queryId
      try {
        await craftsmanStore.getMatchedCraftsmen(queryId)
        
        // If matched list is empty, load general recommended list as fallback
        if (craftsmanStore.matchedCraftsmen.length === 0) {
          console.log('No matched craftsmen. Loading general list as fallback...')
          const api = useApi()
          const res = await api('/api/v1/craftsmen?page=1&limit=6') as any
          if (res?.data?.data) {
            craftsmanStore.matchedCraftsmen = res.data.data
            isFallback.value = true
          }
        }

        if (craftsmen.value.length > 0) {
          currentIndex.value = Math.min(1, craftsmen.value.length - 1)
        } else {
          currentIndex.value = 0
        }
      } catch (err) {
        console.error('Failed to load matched craftsmen:', err)
      }
    }
  }
})

const next = () => {
  if (total.value === 0) return
  currentIndex.value = (currentIndex.value + 1) % total.value
}

const prev = () => {
  if (total.value === 0) return
  currentIndex.value = (currentIndex.value - 1 + total.value) % total.value
}

const setIndex = (index: number) => {
  if (total.value === 0) return
  currentIndex.value = index
}

// Navigation helpers
const goToProfile = (craftsmanId: string | number) => {
  navigateTo(`/profile-pengrajin?id=${craftsmanId}&ideaId=${ideaId.value || ''}`)
}

const goToChat = (craftsmanName: string) => {
  const c = craftsmanStore.matchedCraftsmen.find(item => 
    (item.user?.fullName || item.fullName || '') === craftsmanName
  )
  if (c) {
    navigateTo(`/chat?craftsmanId=${c.id}&ideaId=${ideaId.value || ''}&craftsmanName=${encodeURIComponent(craftsmanName)}`)
  } else {
    navigateTo(`/chat?craftsman=${encodeURIComponent(craftsmanName)}`)
  }
}

// Helper to determine order of cards to display them side-by-side cleanly
const getPositionIndex = (index: number) => {
  if (total.value === 0) return 99
  const diff = (index - currentIndex.value + total.value) % total.value
  if (diff === 0) return 0 // Center/Active
  if (diff === 1) return 1 // Right card
  if (diff === total.value - 1) return -1 // Left card
  return 99 // Off-screen / Hidden
}
</script>

<template>
  <section id="craftsman-carousel" class="w-full bg-[#FFFFFF] py-20 md:py-28 select-none relative overflow-hidden border-b border-gray-100/50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center">
      
      <!-- Headline & Subheadline -->
      <div class="text-center mb-5 max-w-2xl">
        <h2 class="font-poppins text-3xl sm:text-4xl font-semibold tracking-tight text-gray-950">
          Memilih Opsi <span class="text-[#7A4D30]">Pengrajin</span> Berikut
        </h2>
        <p v-if="isFallback" class="font-inter text-xs text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-full inline-block mt-3 font-semibold">
          💡 Tidak ada pengrajin dengan keahlian yang spesifik, menampilkan rekomendasi pengrajin umum.
        </p>
        <p v-else class="font-inter text-sm sm:text-base text-gray-500 mt-3">
          Pilihlah pengrajin terbaik yang sesuai dengan kebutuhanmu
        </p>
      </div>

      <!-- State 1: Missing Idea ID -->
      <div v-if="!ideaId" class="w-full flex flex-col items-center justify-center text-center py-20 px-6 max-w-lg mx-auto border border-dashed border-gray-200 rounded-[32px] bg-[#FAF8F5]/30 mt-10">
        <div class="w-16 h-16 bg-[#7A4D30]/5 rounded-full flex items-center justify-center text-[#7A4D30] mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 21m0 0-.813-5.096L9 21Zm0 0h5.096H9.813ZM3 16.5v-6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 10.5v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 16.5Zm0-6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 10.5v6" />
          </svg>
        </div>
        <h3 class="font-poppins text-lg font-bold text-gray-900">Belum Ada Ide Terpilih</h3>
        <p class="font-inter text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
          Silakan pilih ide daur ulang berbasis AI terlebih dahulu agar kami dapat mencocokkan pengrajin dengan keahlian yang sesuai.
        </p>
        <NuxtLink 
          to="/dashboard-aiPage"
          class="mt-6 bg-[#7A4D30] hover:bg-[#683f26] text-white text-sm font-bold font-inter py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
        >
          Pilih Ide AI
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </NuxtLink>
      </div>

      <!-- State 2: Loading State -->
      <div v-else-if="isLoading" class="relative w-full flex items-center justify-center min-h-[600px] px-4 md:px-0 mt-8">
        <div class="w-full max-w-[440px] h-[600px] bg-white border border-gray-150 rounded-[32px] p-6 shadow-xl flex flex-col justify-between animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gray-200"></div>
            <div class="flex flex-col flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              <div class="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div class="w-full h-44 mt-4 bg-gray-200 rounded-[20px]"></div>
          <div class="flex flex-col mt-4 space-y-2 flex-grow">
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div class="flex gap-2 mt-4">
            <div class="h-6 bg-gray-200 rounded-full w-20"></div>
            <div class="h-6 bg-gray-200 rounded-full w-24"></div>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-4">
            <div class="h-16 bg-gray-200 rounded-[12px]"></div>
            <div class="h-16 bg-gray-200 rounded-[12px]"></div>
            <div class="h-16 bg-gray-200 rounded-[12px]"></div>
          </div>
          <div class="flex gap-3 mt-6">
            <div class="flex-1 h-11 bg-gray-200 rounded-full"></div>
            <div class="flex-1 h-11 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- State 3: Error State -->
      <div v-else-if="errorMessage" class="w-full flex flex-col items-center justify-center text-center py-20 px-6 max-w-lg mx-auto border border-dashed border-red-200 rounded-[32px] bg-red-50/20 mt-10">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 class="font-poppins text-lg font-bold text-gray-900">Gagal Memuat Data</h3>
        <p class="font-inter text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
          {{ errorMessage }}
        </p>
        <button 
          @click="ideaId && craftsmanStore.getMatchedCraftsmen(ideaId)"
          type="button"
          class="mt-6 bg-[#7A4D30] hover:bg-[#683f26] text-white text-sm font-bold font-inter py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
        >
          Coba Lagi
        </button>
      </div>

      <!-- State 4: Empty Match State -->
      <div v-else-if="craftsmen.length === 0" class="w-full flex flex-col items-center justify-center text-center py-20 px-6 max-w-lg mx-auto border border-dashed border-gray-200 rounded-[32px] bg-[#FAF8F5]/30 mt-10">
        <div class="w-16 h-16 bg-[#7A4D30]/5 rounded-full flex items-center justify-center text-[#7A4D30] mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <h3 class="font-poppins text-lg font-bold text-gray-900">Tidak Ada Pengrajin yang Cocok</h3>
        <p class="font-inter text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
          Maaf, saat ini tidak ada pengrajin dengan keahlian yang cocok untuk merealisasikan ide ini.
        </p>
        <NuxtLink 
          to="/search-craftsman"
          class="mt-6 bg-[#7A4D30] hover:bg-[#683f26] text-white text-sm font-bold font-inter py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
        >
          Cari Pengrajin Manual
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </NuxtLink>
      </div>

      <!-- State 5: Normal Carousel View -->
      <template v-else>
        <!-- 3D Carousel Wrapper -->
        <div class="relative w-full flex items-center justify-center min-h-[660px] md:min-h-[720px] px-4 md:px-0">
          
          <!-- Left Nav Arrow Button -->
          <button 
            @click="prev"
            type="button"
            aria-label="Previous craftsman"
            class="absolute left-2 md:left-6 lg:left-12 z-40 w-12 h-12 rounded-full border border-gray-200 hover:border-[#7A4D30] hover:bg-[#7A4D30]/5 flex items-center justify-center text-[#7A4D30] bg-white transition-all duration-300 cursor-pointer shadow-sm active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <!-- Cards Container -->
          <div class="relative w-full max-w-[440px] h-[600px] flex items-center justify-center">
            <FeaturesLandingCraftsmanCarouselCard 
              v-for="(craftsman, index) in craftsmen" 
              :key="craftsman.id"
              :craftsman="craftsman"
              :positionIndex="getPositionIndex(index)"
              @click-profile="goToProfile"
              @click-chat="goToChat"
            />
          </div>

          <!-- Right Nav Arrow Button -->
          <button 
            @click="next"
            type="button"
            aria-label="Next craftsman"
            class="absolute right-2 md:right-6 lg:right-12 z-40 w-12 h-12 rounded-full border border-gray-200 hover:border-[#7A4D30] hover:bg-[#7A4D30]/5 flex items-center justify-center text-[#7A4D30] bg-white transition-all duration-300 cursor-pointer shadow-sm active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </div>

        <!-- Description Footer -->
        <p class="font-inter text-xs sm:text-sm text-gray-400 text-center max-w-xl leading-relaxed mt-10">
          Temukan pengrajin yang tepat untuk mewujudkan ide daur ulangmu. Sesuaikan pilihan berdasarkan keahlian, material, serta portofolio karya.
        </p>

        <!-- Pagination Indicators -->
        <div class="flex items-center justify-center gap-2 mt-6">
          <button 
            v-for="(dot, idx) in total" 
            :key="idx"
            @click="setIndex(idx)"
            type="button"
            :aria-label="`Go to slide ${idx + 1}`"
            class="transition-all duration-300 cursor-pointer"
            :class="[
              currentIndex === idx ? 'w-6 h-2 rounded-full bg-[#7A4D30]' : 'w-2 h-2 rounded-full bg-gray-200 hover:bg-gray-300'
            ]"
          ></button>
        </div>
      </template>

    </div>
  </section>
</template>

<style scoped>
/* High visual transitions using 3D perspective adjustments */
section {
  perspective: 1000px;
}
</style>

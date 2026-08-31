<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSearchCraftsmanStore } from '~/stores/searchCraftsman'
import { useApi } from '~/composables/useApiFetch'
import { navigateTo } from '#app'

definePageMeta({
  layout: 'dashboard'
})

const searchStore = useSearchCraftsmanStore()

// Active Filter States
const search = ref('')
const location = ref('Semua Lokasi')
const specialty = ref('Semua Keahlian')
const rating = ref('Semua Penilaian')
const currentPage = ref(1)

// Onboarding validation & Initial fetches
onMounted(async () => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    // Fetch filters and initial craftsmen list
    await searchStore.fetchFilters()
    loadCraftsmen()
  }
})

// Mapped listing data
const craftsmenList = computed(() => {
  return searchStore.mapCraftsmenList(searchStore.rawCraftsmen)
})

// API Query Trigger helper
const loadCraftsmen = () => {
  searchStore.searchCraftsmen({
    page: currentPage.value,
    limit: 9,
    search: search.value,
    skill: specialty.value,
    location: location.value,
    minRating: rating.value
  })
}

// Watch filters to trigger reloading and reset page to 1
watch([location, specialty, rating], () => {
  currentPage.value = 1
  loadCraftsmen()
})

// Watch search query with simple input debounce (400ms)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  currentPage.value = 1
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loadCraftsmen()
  }, 400)
})

// Trigger page changes
const changePage = (page: number) => {
  if (page < 1 || page > searchStore.meta.totalPages) return
  currentPage.value = page
  loadCraftsmen()
  // Scroll page to top smoothly
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSelectCraftsman = async (craftsmanId: string, craftsmanName: string) => {
  let finalIdeaId = ''
  if (import.meta.client) {
    finalIdeaId = localStorage.getItem('sedalang_active_idea_id') || ''
  }

  let chatUrl = `/chat?craftsmanId=${craftsmanId}&craftsmanName=${encodeURIComponent(craftsmanName)}`
  if (finalIdeaId) {
    chatUrl += `&ideaId=${finalIdeaId}&sendIdea=true`
  }

  navigateTo(chatUrl)
}

const handleViewProfile = (id: string) => {
  navigateTo(`/profile-pengrajin?id=${id}`)
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-white py-10">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20 space-y-10">
      
      <!-- Header Section -->
      <header class="text-left">
        <h1 class="font-poppins text-3xl md:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
          Cari Pengrajin Terbaik
        </h1>
        <p class="font-inter text-sm md:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Hubungkan dengan pengrajin lokal di Semarang yang terampil mengolah dan mendaur ulang berbagai limbah material Anda.
        </p>
      </header>

      <!-- Filter Controls Row -->
      <FeaturesSearchCraftsmanSearchFilters
        v-model:search="search"
        v-model:location="location"
        v-model:specialty="specialty"
        v-model:rating="rating"
        :locations="searchStore.locations"
        :specialties="searchStore.skills"
      />

      <!-- Loading State Skeleton Grid -->
      <div v-if="searchStore.isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="i in 6" 
          :key="i" 
          class="w-full h-[400px] bg-white border border-gray-150 rounded-[32px] p-6 shadow-sm flex flex-col justify-between animate-pulse"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-150"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 bg-gray-150 rounded w-2/3"></div>
              <div class="h-2.5 bg-gray-150 rounded w-1/3"></div>
            </div>
          </div>
          <div class="w-full h-36 bg-gray-150 rounded-2xl my-3"></div>
          <div class="space-y-2 flex-grow">
            <div class="h-3 bg-gray-150 rounded w-1/2"></div>
            <div class="h-2.5 bg-gray-150 rounded w-full"></div>
            <div class="h-2.5 bg-gray-150 rounded w-5/6"></div>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-3">
            <div class="h-10 bg-gray-150 rounded-full"></div>
            <div class="h-10 bg-gray-150 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Search results list with scrollable container -->
      <div 
        v-else-if="craftsmenList.length > 0" 
        class="space-y-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
          <div 
            v-for="item in craftsmenList" 
            :key="item.id"
            class="h-full"
          >
            <FeaturesSearchCraftsmanCard 
              :craftsman="item" 
              @select-craftsman="handleSelectCraftsman"
              @view-profile="handleViewProfile"
            />
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="searchStore.meta.totalPages > 1" class="flex items-center justify-center gap-4 pt-6 select-none">
          <button
            @click="changePage(searchStore.meta.page - 1)"
            :disabled="searchStore.meta.page === 1"
            class="px-5 py-2.5 border border-[#7A4D30]/20 hover:bg-[#7A4D30]/5 disabled:opacity-30 disabled:pointer-events-none text-[#7A4D30] font-bold text-xs rounded-full transition-all cursor-pointer focus:outline-none"
          >
            Sebelumnya
          </button>
          <span class="font-inter text-xs text-gray-500 font-semibold">
            Halaman {{ searchStore.meta.page }} dari {{ searchStore.meta.totalPages }}
          </span>
          <button
            @click="changePage(searchStore.meta.page + 1)"
            :disabled="searchStore.meta.page === searchStore.meta.totalPages"
            class="px-5 py-2.5 border border-[#7A4D30]/20 hover:bg-[#7A4D30]/5 disabled:opacity-30 disabled:pointer-events-none text-[#7A4D30] font-bold text-xs rounded-full transition-all cursor-pointer focus:outline-none"
          >
            Selanjutnya
          </button>
        </div>
      </div>

      <!-- Empty state filters -->
      <div v-else class="text-center py-20 border border-dashed border-gray-200 rounded-[32px] bg-[#FAF8F5]/30">
        <div class="w-12 h-12 rounded-full bg-[#7A4D30]/5 flex items-center justify-center text-[#7A4D30] mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="font-poppins text-base font-bold text-gray-950">Tidak ada pengrajin ditemukan</h4>
        <p class="font-inter text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
          Coba hapus filter pencarian Anda atau gunakan keyword penelusuran yang berbeda.
        </p>
      </div>

      <!-- Bottom help guide banner -->
      <FeaturesSearchCraftsmanBanner class="pt-4" />

    </div>
  </div>
</template>

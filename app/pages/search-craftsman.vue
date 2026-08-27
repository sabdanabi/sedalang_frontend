<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// Onboarding validation
onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
    }
  }
})

// Types
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

// Active Filter States
const search = ref('')
const location = ref('Semua Lokasi')
const specialty = ref('Semua Keahlian')
const rating = ref('Semua Penilaian')

// List of Mock Craftsmen (6 data entries to demonstrate grid auto wrapping)
const craftsmen = ref<Craftsman[]>([
  {
    id: '1',
    name: 'KaryaLoka Craft',
    location: 'Tembalang',
    avatar: '/images/landing_page_images/default_pp.webp',
    heroImage: '/images/landing_page_images/tracking_progres_img.webp',
    specialty: 'Pengrajin Kaca',
    rating: 4.9,
    description: 'Ahli mengolah botol kaca bekas menjadi lampu dekoratif, vas, dan berbagai karya rumah tangga bernuansa elegan.',
    tags: ['Botol kaca', 'Kaca bekas'],
    thumbnails: [
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp'
    ]
  },
  {
    id: '2',
    name: 'Paper Play Art',
    location: 'Pedurungan',
    avatar: '/images/landing_page_images/default_pp.webp',
    heroImage: '/images/landing_page_images/ai_page_img.webp',
    specialty: 'Pengrajin Kayu',
    rating: 4.8,
    description: 'Mengubah kertas, kardus bekas, dan potongan papan kayu sisa menjadi perlengkapan kreatif sederhana dan fungsional.',
    tags: ['Kertas', 'Kardus', 'Kayu Sisa'],
    thumbnails: [
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp'
    ]
  },
  {
    id: '3',
    name: 'Plastik Fantastic',
    location: 'Ngaliyan',
    avatar: '/images/landing_page_images/default_pp.webp',
    heroImage: '/images/landing_page_images/discussion_room_img.webp',
    specialty: 'Pengrajin Kaca',
    rating: 4.7,
    description: 'Spesialis mengolah botol dan kemasan plastik bekas serta ornamen kaca sisa menjadi aksesoris dekorasi bernilai seni tinggi.',
    tags: ['Botol plastik', 'Plastik', 'Mika'],
    thumbnails: [
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp'
    ]
  },
  {
    id: '4',
    name: 'Logam Abadi',
    location: 'Tembalang',
    avatar: '/images/landing_page_images/default_pp.webp',
    heroImage: '/images/auth_img.webp',
    specialty: 'Pengrajin Besi',
    rating: 4.9,
    description: 'Memanfaatkan potongan besi sisa industri dan pipa bekas untuk dikreasikan menjadi rak estetik bergaya industrial.',
    tags: ['Besi bekas', 'Pipa', 'Seng'],
    thumbnails: [
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp'
    ]
  },
  {
    id: '5',
    name: 'Woodsy Studio',
    location: 'Ngaliyan',
    avatar: '/images/landing_page_images/default_pp.webp',
    heroImage: '/images/landing_page_images/looking_for_a_craftsman_img.png',
    specialty: 'Pengrajin Kayu',
    rating: 4.6,
    description: 'Slicing palet kayu bekas peti kemas menjadi meja kopi minimalis, ambalan dinding, dan jam kayu dekorasi unik.',
    tags: ['Palet kayu', 'Paku', 'Finishing'],
    thumbnails: [
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp'
    ]
  },
  {
    id: '6',
    name: 'Karya Logam Mulia',
    location: 'Pedurungan',
    avatar: '/images/landing_page_images/default_pp.webp',
    heroImage: '/images/default_images/default_img.webp',
    specialty: 'Pengrajin Besi',
    rating: 4.5,
    description: 'Merangkai kawat baja bekas dan lembaran seng sisa proyek menjadi lampu hias gantung bertema rustic modern.',
    tags: ['Kawat baja', 'Seng sisa', 'Logam'],
    thumbnails: [
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp',
      '/images/default_images/default_img.webp'
    ]
  }
])

// Computed reactive filtering
const filteredCraftsmen = computed(() => {
  return craftsmen.value.filter(item => {
    // 1. Text Search matching
    const query = search.value.trim().toLowerCase()
    if (query) {
      const matchName = item.name.toLowerCase().includes(query)
      const matchSpecialty = item.specialty.toLowerCase().includes(query)
      const matchDesc = item.description.toLowerCase().includes(query)
      if (!matchName && !matchSpecialty && !matchDesc) {
        return false
      }
    }

    // 2. Location matching
    if (location.value !== 'Semua Lokasi') {
      if (item.location.toLowerCase() !== location.value.toLowerCase()) {
        return false
      }
    }

    // 3. Specialty matching
    if (specialty.value !== 'Semua Keahlian') {
      if (item.specialty.toLowerCase() !== specialty.value.toLowerCase()) {
        return false
      }
    }

    // 4. Rating matching
    if (rating.value !== 'Semua Penilaian') {
      const ratingLimit = parseFloat(rating.value)
      if (item.rating < ratingLimit) {
        return false
      }
    }

    return true
  })
})

const handleSelectCraftsman = (name: string) => {
  // Navigate directly to /chat page with parameters to initiate obrolan
  navigateTo(`/chat?craftsman=${encodeURIComponent(name)}`)
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-white py-10">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20 space-y-10">
      
      <!-- Header Section -->
      <header class="text-left">
        <h1 class="font-poppins text-3xl md:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
          Find the Right Craftsman
        </h1>
        <p class="font-inter text-sm md:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Connect with local artisans in Semarang who can transform your used materials.
        </p>
      </header>

      <!-- Filter Controls Row -->
      <FeaturesSearchCraftsmanSearchFilters
        v-model:search="search"
        v-model:location="location"
        v-model:specialty="specialty"
        v-model:rating="rating"
      />

      <!-- Search results list with scrollable container -->
      <div 
        v-if="filteredCraftsmen.length > 0" 
        class="overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
          <div 
            v-for="item in filteredCraftsmen" 
            :key="item.id"
            class="h-full"
          >
            <FeaturesSearchCraftsmanCard 
              :craftsman="item" 
              @select-craftsman="handleSelectCraftsman"
            />
          </div>
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #FAF3EE;
  border-radius: 999px;
  border: 1px solid #7A4D30/10;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #7A4D30/20;
}
</style>

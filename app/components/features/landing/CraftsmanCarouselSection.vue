<script setup lang="ts">
import { ref, computed } from 'vue'

// Define default images as requested
const defaultPP = '/images/landing_page_images/default_pp.webp'
const defaultImg = '/images/default_images/default_img.webp'

// Define craftsmen data based on the screenshot and realistic Semarang details
interface Craftsman {
  id: number
  name: string
  location: string
  category: string
  rating: number
  description: string
  badges: string[]
  mainImage: string
  portfolio: string[]
}

const craftsmen = ref<Craftsman[]>([
  {
    id: 1,
    name: 'KaryaLoka Craft',
    location: 'Semarang Tengah',
    category: 'Kerajinan Kaca & Dekorasi',
    rating: 4.9,
    description: 'Ahli mengolah botol kaca bekas menjadi lampu dekoratif, vas, dan berbagai karya rumah tangga bernuansa elegan.',
    badges: ['Botol kaca', 'Kaca bekas'],
    mainImage: defaultImg,
    portfolio: [defaultImg, defaultImg, defaultImg]
  },
  {
    id: 2,
    name: 'Plastik Fantastic',
    location: 'Banyumanik',
    category: 'Daur Ulang Plastik & Aksesoris',
    rating: 4.7,
    description: 'Spesialis mengolah botol dan kemasan plastik bekas menjadi produk fungsional seperti aksesoris, karya kreatif dan desain unik.',
    badges: ['Botol plastik', 'Plastik'],
    mainImage: defaultImg,
    portfolio: [defaultImg, defaultImg, defaultImg]
  },
  {
    id: 3,
    name: 'Sirkula Woodcraft',
    location: 'Semarang Barat',
    category: 'Kayu & Dekorasi Rumah',
    rating: 4.8,
    description: 'Mengubah sisa palet kayu peti kemas dan potongan kayu bekas konstruksi menjadi rak estetik, vas bunga, serta wall art minimalis.',
    badges: ['Kayu palet', 'Kayu bekas'],
    mainImage: defaultImg,
    portfolio: [defaultImg, defaultImg, defaultImg]
  },
  {
    id: 4,
    name: 'Metalindo Art',
    location: 'Genuk',
    category: 'Kerajinan Logam & Besi',
    rating: 4.6,
    description: 'Mengolah sisa kawat besi, lempengan seng, dan kaleng bekas menjadi miniatur kendaraan berdaya seni tinggi dan fungsional.',
    badges: ['Besi bekas', 'Kaleng bekas'],
    mainImage: defaultImg,
    portfolio: [defaultImg, defaultImg, defaultImg]
  },
  {
    id: 5,
    name: 'Eco Paper Craft',
    location: 'Tembalang',
    category: 'Kerajinan Kertas & Karton',
    rating: 4.8,
    description: 'Mengolah limbah koran lama, kardus bekas, dan kertas kantor menjadi kertas daur ulang bertekstur, journal book, dan kotak kado unik.',
    badges: ['Kertas koran', 'Kardus bekas'],
    mainImage: defaultImg,
    portfolio: [defaultImg, defaultImg, defaultImg]
  }
])

const currentIndex = ref(1) // Default to second craftsman (index 1, Plastik Fantastic / KaryaLoka Center)
const total = computed(() => craftsmen.value.length)

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % total.value
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + total.value) % total.value
}

const setIndex = (index: number) => {
  currentIndex.value = index
}

// Navigation helpers
const goToProfile = () => {
  navigateTo('/profile-pengrajin')
}

const goToChat = (craftsmanName: string) => {
  navigateTo(`/chat?craftsman=${encodeURIComponent(craftsmanName)}`)
}

// Helper to determine order of cards to display them side-by-side cleanly
const getPositionIndex = (index: number) => {
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
        <p class="font-inter text-sm sm:text-base text-gray-500 mt-3">
          Pilihlah pengrajin terbaik yang sesuai dengan kebutuhanmu
        </p>
      </div>

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
          <div 
            v-for="(craftsman, index) in craftsmen" 
            :key="craftsman.id"
            class="absolute w-full bg-white border border-gray-150 rounded-[32px] p-6 shadow-xl transition-all duration-500 ease-out origin-center flex flex-col justify-between"
            :class="[
              getPositionIndex(index) === 0 ? 'z-30 scale-100 opacity-100 shadow-[0_20px_50px_rgba(122,77,48,0.08)] pointer-events-auto' : '',
              getPositionIndex(index) === 1 ? 'z-20 scale-90 translate-x-[45%] md:translate-x-[65%] opacity-40 md:opacity-60 pointer-events-none select-none filter blur-[1px] md:blur-0' : '',
              getPositionIndex(index) === -1 ? 'z-20 scale-90 -translate-x-[45%] md:-translate-x-[65%] opacity-40 md:opacity-60 pointer-events-none select-none filter blur-[1px] md:blur-0' : '',
              getPositionIndex(index) === 99 ? 'opacity-0 scale-75 pointer-events-none z-10' : ''
            ]"
          >
            <!-- Card Header -->
            <div class="flex items-center gap-3">
              <img 
                :src="defaultPP" 
                alt="Profile Picture" 
                class="w-12 h-12 rounded-full object-cover border border-gray-100" 
              />
              <div class="flex flex-col text-left">
                <h3 class="font-poppins font-bold text-gray-950 text-base md:text-lg leading-snug">
                  {{ craftsman.name }}
                </h3>
                <span class="font-inter text-xs md:text-sm text-gray-400 font-medium flex items-center gap-1">
                  <!-- Pin icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {{ craftsman.location }}
                </span>
              </div>
            </div>

            <!-- Workspace Main Image -->
            <div class="w-full h-44 mt-4 overflow-hidden rounded-[20px] border border-gray-100 bg-gray-50">
              <img 
                :src="craftsman.mainImage" 
                alt="Craftsman Workspace" 
                class="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300" 
              />
            </div>

            <!-- Content Area: Category & Rating & Description -->
            <div class="flex flex-col text-left mt-4 flex-grow">
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-poppins font-semibold text-gray-950 text-sm md:text-[15px] leading-snug truncate">
                  {{ craftsman.category }}
                </h4>
                <div class="flex items-center gap-1 text-amber-500 font-bold text-xs md:text-sm flex-shrink-0">
                  <span>★</span>
                  <span>{{ craftsman.rating.toFixed(1) }}</span>
                </div>
              </div>
              <p class="font-inter text-xs md:text-sm text-gray-500 leading-relaxed mt-2 line-clamp-3">
                {{ craftsman.description }}
              </p>
            </div>

            <!-- Badges List -->
            <div class="flex flex-wrap gap-2 mt-4">
              <span 
                v-for="badge in craftsman.badges" 
                :key="badge"
                class="bg-gray-50 border border-gray-200/60 text-gray-500 rounded-full py-1 px-3 text-xs font-semibold font-inter flex items-center gap-1"
              >
                <!-- Small recycle/leaf icon placeholder -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3 text-[#7A4D30]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                {{ badge }}
              </span>
            </div>

            <!-- Portfolio Thumbnails -->
            <div class="grid grid-cols-3 gap-2 mt-4">
              <div 
                v-for="(thumb, thumbIdx) in craftsman.portfolio" 
                :key="thumbIdx"
                class="h-16 rounded-[12px] overflow-hidden border border-gray-150 bg-gray-50"
              >
                <img 
                  :src="thumb" 
                  alt="Portfolio item" 
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" 
                />
              </div>
            </div>

            <!-- Card Actions -->
            <div class="flex gap-3 mt-6">
              <button 
                @click.stop="goToProfile"
                type="button"
                class="flex-1 border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 text-xs font-bold font-inter py-3 px-2 rounded-full transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none"
              >
                Lihat Profile
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>

              <button 
                @click.stop="goToChat(craftsman.name)"
                type="button"
                class="flex-1 bg-[#7A4D30] hover:bg-[#683f26] text-white text-xs font-bold font-inter py-3 px-2 rounded-full transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none shadow-sm hover:shadow active:scale-[0.98]"
              >
                Pilih Pengrajin
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
            </div>
          </div>
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

    </div>
  </section>
</template>

<style scoped>
/* High visual transitions using 3D perspective adjustments */
section {
  perspective: 1000px;
}
</style>

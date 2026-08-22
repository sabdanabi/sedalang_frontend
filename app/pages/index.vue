<script setup lang="ts">
import { ref, computed } from 'vue'
import * as turf from '@turf/turf'
import { mockCraftsmen } from '~/utils/mockCraftsmen'
import type { Craftsman } from '~/types/craftsman'

// Filter States
const searchQuery = ref('')
const selectedRadius = ref<number | null>(null) // in km
const selectedMaterial = ref('')
const selectedAvailability = ref('')
const selectedCraftsmanId = ref<string | null>(null)

// Geolocation States
const userLocation = ref<{ latitude: number; longitude: number } | null>(null)
const locationError = ref<string | null>(null)

// FAQ Open States (1-indexed for accordions)
const openFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

// Handler for user location update from the map
const handleUserLocationUpdate = (loc: { latitude: number; longitude: number }) => {
  userLocation.value = loc
  locationError.value = null
}

const handleLocationError = (msg: string) => {
  locationError.value = msg
}

// Calculate distances dynamically using Turf.js if user location is available
const craftsmenWithDistance = computed(() => {
  return mockCraftsmen.map((c) => {
    if (!userLocation.value) {
      return { ...c, distance: undefined }
    }
    // Turf point coordinates format: [longitude, latitude]
    const from = turf.point([userLocation.value.longitude, userLocation.value.latitude])
    const to = turf.point([c.longitude, c.latitude])
    const distance = turf.distance(from, to, { units: 'kilometers' })
    return { ...c, distance }
  })
})

// Apply search & side filters to craftsmen list
const filteredCraftsmen = computed(() => {
  return craftsmenWithDistance.value.filter((c) => {
    // 1. Search Query filter (checks name, address, materials, skills)
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchesName = c.name.toLowerCase().includes(q)
      const matchesAddress = c.address.toLowerCase().includes(q)
      const matchesMaterials = c.materials.some((m) => m.toLowerCase().includes(q))
      const matchesSkills = c.skills.some((s) => s.toLowerCase().includes(q))
      if (!matchesName && !matchesAddress && !matchesMaterials && !matchesSkills) {
        return false
      }
    }

    // 2. Material Category filter
    if (selectedMaterial.value) {
      const matchesMat = c.materials.includes(selectedMaterial.value)
      if (!matchesMat) return false
    }

    // 3. Availability filter
    if (selectedAvailability.value) {
      if (c.availability !== selectedAvailability.value) return false
    }

    // 4. Radius filter (requires user location)
    if (selectedRadius.value !== null && userLocation.value) {
      if (c.distance === undefined || c.distance > selectedRadius.value) {
        return false
      }
    }

    return true
  })
})

// Focus map and popup on a specific craftsman card click
const handleSelectCraftsman = (id: string) => {
  selectedCraftsmanId.value = id
  
  // Smooth scroll to map section on mobile if clicked list card
  const mapElement = document.getElementById('craftsman-map-section')
  if (mapElement && window.innerWidth < 768) {
    mapElement.scrollIntoView({ behavior: 'smooth' })
  }
}

// Materials available for filter dropdown
const allMaterials = ['Kayu', 'Bambu', 'Kain Perca', 'Besi Scrap', 'Botol Plastik']

// FAQs Dataset
const faqs = [
  {
    question: 'Apa itu platform SeDaLang?',
    answer: 'SeDaLang (Siklus Daur Ulang) adalah platform upcycling berbasis AI yang menghubungkan masyarakat pemilik barang/bahan bekas dengan pengrajin lokal UMKM di Semarang untuk diolah menjadi produk baru yang bernilai tinggi.'
  },
  {
    question: 'Bagaimana proses daur ulang barang bekas berlangsung?',
    answer: 'Pengguna mengunggah foto bahan bekas, AI mencocokkan bahan dengan spesialisasi pengrajin terdekat, pengguna berdiskusi harga di chat, mengirimkan bahan ke bengkel pengrajin, memantau kemajuan pembuatan secara real-time, dan menerima produk jadi hasil daur ulang.'
  },
  {
    question: 'Bagaimana fitur Smart Matching bekerja mencari pengrajin?',
    answer: 'Mesin pencocokan pintar (Smart Matching) menganalisis keselarasan bahan baku yang Anda miliki dengan spesifikasi keahlian pengrajin, lokasi terdekat (dihitung menggunakan Turf.js), ketersediaan jadwal, serta rating untuk merekomendasikan UMKM terbaik.'
  },
  {
    question: 'Apakah saya bisa berdiskusi desain dan biaya dengan pengrajin?',
    answer: 'Ya, SeDaLang menyediakan ruang diskusi chat langsung untuk membahas rancangan desain, perkiraan bahan baku tambahan yang diperlukan, serta kesepakatan harga pengerjaan sebelum pesanan dimulai.'
  },
  {
    question: 'Bagaimana cara mengirimkan bahan bekas saya ke pengrajin?',
    answer: 'Bahan bekas dapat dikirimkan langsung menggunakan ekspedisi logistik lokal, jasa pengantaran online, atau diantarkan sendiri secara manual ke alamat bengkel pengrajin yang tertera pada profil peta interaktif.'
  }
]

// Client feedback mock dataset
const testimonials = [
  {
    id: 1,
    name: 'Budi Hartono',
    role: 'Pengusaha Kafe',
    text: 'Sangat terbantu! Kayu palet bekas di gudang disulap menjadi kursi cafe industrial estetis oleh Budi Woodcraft. Desainnya rapi dan kokoh.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Siti Rahma',
    role: 'Pecinta Fashion',
    text: 'Upcycling pakaian lama saya di Kebaya Bu Siti hasilnya luar biasa indah. Perca jeans tua digabung batik lama jadi jaket patchwork modern!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Agus Santoso',
    role: 'Pegiat Seni',
    text: 'Kreativitas Agus Metalworks sangat luar biasa. Besi scrap dan onderdil motor bekas saya dirakit jadi lampu meja futuristik bermutu tinggi.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80'
  }
]
</script>

<template>
  <div class="min-h-screen bg-stone-50 font-sans selection:bg-[#7A4D30]/20 selection:text-[#7A4D30]">
    <!-- NAVBAR -->
    <nav class="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200 z-50 px-6 lg:px-16 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Logo Icon -->
          <svg viewBox="0 0 100 100" class="w-7 h-7 text-[#7A4D30] fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15 L85 45 C88 47.5 88 51.5 85 54 L75 78 C73 83 68 85 62 85 L38 85 C32 85 27 83 25 78 L15 54 C12 51.5 12 47.5 15 45 Z" />
            <path d="M50 35 C42 45 42 55 50 65 C58 55 58 45 50 35 Z" fill="#FFFFFF" />
            <circle cx="50" cy="50" r="4" fill="#7A4D30" />
          </svg>
          <span class="text-xl font-bold tracking-tight text-stone-900">
            SEDALANG
          </span>
        </div>
        
        <!-- Navigation Links -->
        <div class="hidden md:flex items-center gap-8">
          <a href="#" class="text-sm font-semibold text-stone-900 hover:text-[#7A4D30] transition-colors">Home</a>
          <a href="#explore-sections" class="text-sm font-semibold text-stone-600 hover:text-[#7A4D30] transition-colors">Explore</a>
          <a href="#craftsman-map-section" class="text-sm font-semibold text-stone-600 hover:text-[#7A4D30] transition-colors">Chat</a>
          <a href="#testimonials-section" class="text-sm font-semibold text-stone-600 hover:text-[#7A4D30] transition-colors">Testimonial</a>
        </div>

        <!-- Auth Actions -->
        <div class="flex items-center gap-4">
          <NuxtLink to="/login" class="text-sm font-bold text-stone-700 hover:text-[#7A4D30] transition-colors">
            Login
          </NuxtLink>
          <NuxtLink 
            to="/register" 
            class="px-5 py-2.5 bg-[#7A4D30] hover:bg-[#683F25] text-white text-xs font-bold rounded-full transition-colors active:scale-[0.98]"
          >
            SIGN UP
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- HERO SECTION -->
    <header class="relative bg-white pt-12 pb-20 px-6 lg:px-16 overflow-hidden">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Text Hero -->
        <div class="lg:col-span-7 flex flex-col items-start">
          <span class="px-4 py-1.5 bg-[#7A4D30]/10 text-[#7A4D30] text-xs font-bold rounded-full uppercase tracking-wider mb-6">
            Smart & Happy Waste to Sustainable Consumption Platform
          </span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-none mb-6">
            Recycling Becomes Valuable <br class="hidden sm:inline" />
            <span class="text-[#7A4D30]">Together Local Artisans</span>
          </h1>
          <p class="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mb-8">
            Transform waste products into items of value together with local artisans in Semarang. Connect, create, and track environmental impacts collectively.
          </p>
          <div class="flex flex-wrap gap-4 w-full sm:w-auto">
            <a 
              href="#craftsman-map-section"
              class="flex-1 sm:flex-initial text-center px-6 py-3.5 border border-stone-300 hover:border-stone-400 text-stone-800 text-sm font-semibold rounded-full transition-colors"
            >
              Looking for a craftsman
            </a>
            <a 
              href="#craftsman-map-section"
              class="flex-1 sm:flex-initial text-center px-6 py-3.5 bg-[#7A4D30] hover:bg-[#683F25] text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
            >
              Finding craftsman
            </a>
          </div>
        </div>

        <!-- Banner Cycle Info -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="relative w-full max-w-[380px] aspect-square rounded-2xl bg-stone-100/50 p-6 border border-stone-200 shadow-inner flex items-center justify-center">
            <!-- Reuse translated branding message logo cycle visual -->
            <img 
              src="/images/auth_img.webp" 
              alt="Artisan cycle" 
              class="w-full max-w-[320px] h-auto object-contain animate-[pulse_6s_infinite]" 
            />
          </div>
        </div>
      </div>
      
      <!-- Key Statistics Line -->
      <div class="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-150 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <h4 class="text-2xl font-extrabold text-[#7A4D30]">50+</h4>
          <p class="text-xs text-stone-500 font-semibold uppercase mt-1">UMKM Pengrajin</p>
        </div>
        <div>
          <h4 class="text-2xl font-extrabold text-[#7A4D30]">1.2 Ton</h4>
          <p class="text-xs text-stone-500 font-semibold uppercase mt-1">Sampah Terolah</p>
        </div>
        <div>
          <h4 class="text-2xl font-extrabold text-[#7A4D30]">95%</h4>
          <p class="text-xs text-stone-500 font-semibold uppercase mt-1">Tingkat Kecocokan</p>
        </div>
        <div>
          <h4 class="text-2xl font-extrabold text-[#7A4D30]">Semarang</h4>
          <p class="text-xs text-stone-500 font-semibold uppercase mt-1">Area Operasional</p>
        </div>
      </div>
    </header>

    <!-- QUOTE & ABOUT SECTION -->
    <section id="explore-sections" class="bg-stone-100 py-16 px-6 lg:px-16 border-y border-stone-200">
      <div class="max-w-4xl mx-auto text-center">
        <span class="text-[#7A4D30] text-2xs uppercase tracking-widest font-black">About SeDaLang</span>
        <blockquote class="text-xl sm:text-2xl font-bold text-stone-900 mt-4 leading-relaxed">
          "Transform used items into something valuable, together with local artisans in Semarang."
        </blockquote>
        <p class="text-sm sm:text-base text-stone-600 mt-6 leading-relaxed max-w-2xl mx-auto">
          Kami menyediakan tiga aksi utama: melakukan daur ulang barang bekas dan mempromosikan gerakan ramah lingkungan, pencarian pengrajin terdekat (Smart Craftsman Matching), ruang diskusi chat transaksi pemesanan, pelacakan proses daur ulang secara berkala, dan dokumentasi dampak lingkungan pada platform Eco Impact Record.
        </p>
        <div class="mt-8">
          <a 
            href="#craftsman-map-section" 
            class="inline-block px-6 py-3 bg-stone-900 hover:bg-stone-950 text-white text-xs font-bold rounded-full transition-colors"
          >
            Lihat Dashboard
          </a>
        </div>
      </div>
    </section>

    <!-- CORE FEATURES SECTION -->
    <section class="py-20 px-6 lg:px-16 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-xl mx-auto mb-16">
          <span class="text-xs uppercase tracking-wider font-bold text-[#7A4D30]">Layanan Utama</span>
          <h2 class="text-3xl font-black text-stone-900 mt-2">
            Turn Used Items Into More Valuable
          </h2>
          <p class="text-sm text-stone-500 mt-2 leading-relaxed">
            Kelola barang bekas dengan solusi menyeluruh bersama mitra pengrajin berpengalaman.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- CARD 1: Join Page -->
          <div class="bg-stone-50 border border-stone-200 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all group">
            <div>
              <div class="w-full aspect-square bg-stone-200/50 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                <img 
                  src="/images/landing_page_images/Maskgroup-ezgif.com-png-to-webp-converter.png" 
                  alt="Join Page" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 class="font-extrabold text-stone-900 text-lg">Join Page</h3>
              <p class="text-xs text-stone-500 mt-2 leading-relaxed">
                Bergabunglah bersama para pengrajin kreatif lainnya untuk membangun ekosistem upcycling berkelanjutan. Saling berbagi sumber daya dan berkolaborasi.
              </p>
            </div>
            <span class="text-xs font-bold text-[#7A4D30] hover:underline inline-block mt-4 cursor-pointer">Selengkapnya &rarr;</span>
          </div>

          <!-- CARD 2: Discussion Room -->
          <div class="bg-stone-50 border border-stone-200 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all group">
            <div>
              <div class="w-full aspect-square bg-stone-200/50 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                <img 
                  src="/images/landing_page_images/discussion_room_img.webp" 
                  alt="Discussion Room" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 class="font-extrabold text-stone-900 text-lg">Discussion Room</h3>
              <p class="text-xs text-stone-500 mt-2 leading-relaxed">
                Diskusikan berbagai ide kerajinan daur ulang kreatif, tips menarik, tutorial praktis, serta solusi pengelolaan limbah rumah tangga di area Anda.
              </p>
            </div>
            <span class="text-xs font-bold text-[#7A4D30] hover:underline inline-block mt-4 cursor-pointer">Selengkapnya &rarr;</span>
          </div>

          <!-- CARD 3: Tracking Progress -->
          <div class="bg-stone-50 border border-stone-200 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all group">
            <div>
              <div class="w-full aspect-square bg-stone-200/50 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                <img 
                  src="/images/landing_page_images/tracking_progres_img.webp" 
                  alt="Tracking Progress" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 class="font-extrabold text-stone-900 text-lg">Tracking Progress</h3>
              <p class="text-xs text-stone-500 mt-2 leading-relaxed">
                Pantau langsung seluruh tahapan pemrosesan bahan baku daur ulang Anda mulai dari proses pemilahan, produksi upcycling, hingga siap dikirim kembali.
              </p>
            </div>
            <span class="text-xs font-bold text-[#7A4D30] hover:underline inline-block mt-4 cursor-pointer">Selengkapnya &rarr;</span>
          </div>

          <!-- CARD 4: Looking for a craftsman -->
          <div class="bg-stone-50 border border-stone-200 p-6 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all group">
            <div>
              <div class="w-full aspect-square bg-stone-200/50 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
                <img 
                  src="/images/landing_page_images/looking_for_a_craftsman_img.png" 
                  alt="Looking for a craftsman" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 class="font-extrabold text-stone-900 text-lg">Looking for a craftsman</h3>
              <p class="text-xs text-stone-500 mt-2 leading-relaxed">
                Cari pengrajin khusus yang memiliki keahlian mengolah sampah kayu, logam, tekstil, atau plastik menjadi furnitur, dekorasi rumah, dan fashion unik.
              </p>
            </div>
            <span class="text-xs font-bold text-[#7A4D30] hover:underline inline-block mt-4 cursor-pointer">Selengkapnya &rarr;</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MAP & SMART MATCHING SECTION -->
    <section id="craftsman-map-section" class="py-20 px-6 lg:px-16 bg-stone-100 border-t border-stone-200">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div class="lg:col-span-8">
            <span class="text-[#7A4D30] text-xs uppercase tracking-widest font-black">Interaktif Map</span>
            <h2 class="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight mt-2 uppercase">
              PLACES TO FIND ARTISANS
            </h2>
            <p class="text-sm sm:text-base text-stone-600 mt-2 max-w-2xl leading-relaxed">
              Temukan lokasi workshop pengrajin kreatif UMKM terbaik di Kota Semarang secara interaktif. Aktifkan lokasi Anda untuk mendapatkan info jarak terdekat secara akurat menggunakan Turf.js.
            </p>
          </div>
          <div class="lg:col-span-4 lg:text-right">
            <!-- Quick reset button -->
            <button 
              type="button" 
              @click="searchQuery = ''; selectedRadius = null; selectedMaterial = ''; selectedAvailability = ''; selectedCraftsmanId = null"
              class="px-4 py-2 border border-stone-300 hover:bg-stone-200/50 rounded-xl text-xs font-bold text-stone-700 transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>

        <!-- Location Permission Warning Overlay Alert -->
        <div v-if="locationError" class="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>⚠️ {{ locationError }}</span>
          <button @click="locationError = null" class="text-amber-500 hover:text-amber-700 font-bold ml-2">×</button>
        </div>

        <!-- Split Layout Map + Sidebar -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <!-- Sidebar: Filter & Craftsman list (Col span 5 on Desktop) -->
          <div class="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between max-h-[620px] overflow-hidden">
            
            <!-- Filters Section -->
            <div class="space-y-4">
              <h3 class="font-extrabold text-stone-950 text-base border-b border-stone-150 pb-2">Filter Pencarian</h3>
              
              <!-- Text search -->
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Cari Nama atau Spesialisasi</label>
                <div class="relative">
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Contoh: Kayu, Jahit, Budi..."
                    class="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-2.5 focus:border-[#7A4D30] focus:bg-white focus:outline-none transition-colors"
                  />
                  <svg class="absolute left-2.5 top-3 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <!-- Dropdown Material -->
                <div>
                  <label class="block text-xs font-bold text-stone-700 mb-1">Bahan Baku</label>
                  <select 
                    v-model="selectedMaterial" 
                    class="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 focus:border-[#7A4D30] focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="">Semua Bahan</option>
                    <option v-for="mat in allMaterials" :key="mat" :value="mat">{{ mat }}</option>
                  </select>
                </div>

                <!-- Dropdown Availability -->
                <div>
                  <label class="block text-xs font-bold text-stone-700 mb-1">Status Ketersediaan</label>
                  <select 
                    v-model="selectedAvailability" 
                    class="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 focus:border-[#7A4D30] focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="">Semua Status</option>
                    <option value="available">Tersedia</option>
                    <option value="busy">Sibuk</option>
                  </select>
                </div>
              </div>

              <!-- Radius Geolocation Filter -->
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-xs font-bold text-stone-700">Radius Terdekat (Turf.js)</label>
                  <span class="text-2xs font-extrabold text-[#7A4D30] uppercase">
                    {{ userLocation ? (selectedRadius ? `${selectedRadius} Km` : 'Semua Jarak') : 'Gunakan Geolocation' }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <input 
                    v-model.number="selectedRadius" 
                    type="range" 
                    min="1" 
                    max="20" 
                    step="1"
                    :disabled="!userLocation"
                    class="w-full accent-[#7A4D30] disabled:opacity-50 cursor-pointer"
                  />
                  <button 
                    v-if="selectedRadius !== null"
                    type="button" 
                    @click="selectedRadius = null"
                    class="text-[10px] text-[#7A4D30] font-bold hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <!-- List Results -->
            <div class="flex-1 mt-6 overflow-y-auto pr-1 border-t border-stone-150 pt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="text-2xs font-bold text-stone-500 uppercase">Daftar Pengrajin ({{ filteredCraftsmen.length }})</span>
                <span class="text-3xs bg-stone-150 px-2 py-0.5 rounded font-black text-stone-700">SEMARANG</span>
              </div>

              <!-- Empty state -->
              <div v-if="filteredCraftsmen.length === 0" class="text-center py-10">
                <p class="text-stone-400 text-sm font-semibold">Tidak ada pengrajin yang cocok.</p>
                <p class="text-stone-400 text-2xs mt-1">Coba sesuaikan atau reset filter pencarian Anda.</p>
              </div>

              <!-- List card items -->
              <div v-else class="space-y-3">
                <div 
                  v-for="c in filteredCraftsmen" 
                  :key="c.id"
                  @click="handleSelectCraftsman(c.id)"
                  :class="[
                    'p-3 border rounded-xl cursor-pointer transition-all hover:bg-stone-50 flex gap-3',
                    selectedCraftsmanId === c.id ? 'border-[#7A4D30] bg-[#7A4D30]/5 ring-1 ring-[#7A4D30]' : 'border-stone-200'
                  ]"
                >
                  <!-- Avatar -->
                  <img :src="c.profileImage" :alt="c.name" class="w-12 h-12 rounded-lg object-cover bg-stone-200" />
                  
                  <!-- Info details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <h4 class="font-extrabold text-stone-900 text-sm truncate">{{ c.name }}</h4>
                      <span class="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-full tracking-wider shrink-0"
                        :class="c.availability === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ c.availability === 'available' ? 'Tersedia' : 'Sibuk' }}
                      </span>
                    </div>
                    
                    <div class="flex items-center gap-1.5 text-xs text-amber-500 mt-1 select-none font-bold">
                      <span>★</span>
                      <span class="text-stone-700 font-extrabold text-2xs">{{ c.rating.toFixed(1) }}</span>
                      <span class="text-stone-300">|</span>
                      <span class="text-stone-500 font-bold text-3xs bg-stone-100 px-1.5 py-0.5 rounded">
                        {{ c.matchScore }}% Match
                      </span>
                      <span v-if="c.distance !== undefined" class="text-stone-300">|</span>
                      <span v-if="c.distance !== undefined" class="text-stone-600 font-bold text-3xs">
                        📍 {{ c.distance.toFixed(1) }} km
                      </span>
                    </div>

                    <p class="text-3xs text-stone-500 mt-1 leading-snug line-clamp-1">
                      {{ c.address }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Map interactive Canvas (Col span 7 on Desktop) -->
          <div id="craftsman-map-section" class="lg:col-span-7 h-[420px] lg:h-auto min-h-[500px]">
            <MapCraftsmanMap 
              :craftsmen="filteredCraftsmen"
              :selected-id="selectedCraftsmanId"
              :user-location="userLocation"
              @select-craftsman="handleSelectCraftsman"
              @update-user-location="handleUserLocationUpdate"
              @location-error="handleLocationError"
            />
          </div>

        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="py-20 px-6 lg:px-16 bg-white">
      <div class="max-w-4xl mx-auto">
        <div class="text-center max-w-xl mx-auto mb-16">
          <span class="text-xs uppercase tracking-wider font-bold text-[#7A4D30]">Tanya Jawab</span>
          <h2 class="text-3xl font-black text-stone-900 mt-2 leading-tight">
            Feel free to <span class="text-[#7A4D30] font-black underline decoration-2">ask anything</span> we're here to <span class="text-[#7A4D30] font-black underline decoration-2">answer</span> your questions!
          </h2>
        </div>

        <!-- Accordions -->
        <div class="space-y-4">
          <div 
            v-for="(faq, idx) in faqs" 
            :key="idx"
            class="border border-stone-200 rounded-2xl overflow-hidden transition-all bg-stone-50/50"
          >
            <button
              type="button"
              @click="toggleFaq(idx + 1)"
              class="w-full flex items-center justify-between p-5 text-left text-stone-900 font-bold text-sm sm:text-base hover:bg-stone-50 transition-colors focus:outline-none cursor-pointer"
            >
              <span>{{ faq.question }}</span>
              <svg 
                class="w-5 h-5 text-stone-500 transition-transform duration-200 shrink-0 ml-4"
                :class="{ 'rotate-180': openFaq === idx + 1 }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              v-show="openFaq === idx + 1"
              class="p-5 border-t border-stone-200 bg-white text-stone-600 text-xs sm:text-sm leading-relaxed"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS SECTION -->
    <section id="testimonials-section" class="py-20 px-6 lg:px-16 bg-stone-100 border-t border-stone-200">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-xl mx-auto mb-16">
          <span class="text-xs uppercase tracking-wider font-bold text-[#7A4D30]">Testimoni</span>
          <h2 class="text-3xl font-black text-stone-900 mt-2">
            Feedback From Client
          </h2>
          <p class="text-sm text-stone-500 mt-2 leading-relaxed">
            Apa saja tanggapan masyarakat yang telah sukses mengolah barang bekasnya di SeDaLang.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="t in testimonials" 
            :key="t.id"
            class="bg-white border border-stone-200 p-6 rounded-2xl hover:shadow-sm transition-all"
          >
            <!-- Rating stars -->
            <div class="flex text-amber-500 gap-1 mb-4 select-none">
              <span v-for="star in t.rating" :key="star" class="text-sm font-bold">★</span>
            </div>
            
            <!-- Review text -->
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 italic">
              "{{ t.text }}"
            </p>

            <!-- User profile info -->
            <div class="flex items-center gap-3 border-t border-stone-150 pt-4">
              <img :src="t.avatar" :alt="t.name" class="w-10 h-10 rounded-full object-cover bg-stone-200" />
              <div>
                <h4 class="font-extrabold text-stone-900 text-xs">{{ t.name }}</h4>
                <p class="text-3xs text-stone-400 font-bold uppercase tracking-wider mt-0.5">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-stone-900 text-stone-300 py-16 px-6 lg:px-16 border-t border-stone-950">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        <!-- Logo and Slogan -->
        <div class="lg:col-span-4 space-y-6">
          <div class="flex items-center gap-2">
            <svg viewBox="0 0 100 100" class="w-8 h-8 text-[#7A4D30] fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 15 L85 45 C88 47.5 88 51.5 85 54 L75 78 C73 83 68 85 62 85 L38 85 C32 85 27 83 25 78 L15 54 C12 51.5 12 47.5 15 45 Z" />
              <path d="M50 35 C42 45 42 55 50 65 C58 55 58 45 50 35 Z" fill="#292524" />
              <circle cx="50" cy="50" r="4" fill="#7A4D30" />
            </svg>
            <span class="text-xl font-bold tracking-tight text-white">
              SEDALANG
            </span>
          </div>
          <p class="text-xs text-stone-400 leading-relaxed max-w-sm">
            SeDaLang adalah platform digital daur ulang berbasis kecerdasan buatan untuk mereduksi limbah rumah tangga dan memajukan perekonomian pengrajin lokal di Kota Semarang.
          </p>
        </div>

        <!-- Footer link blocks -->
        <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Col 1: Features -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Features</h4>
            <ul class="space-y-2 text-3xs text-stone-400">
              <li><a href="#" class="hover:text-white transition-colors">Join Page</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Discussion Room</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Tracking Progress</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Matching Map</a></li>
            </ul>
          </div>
          <!-- Col 2: Legal -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul class="space-y-2 text-3xs text-stone-400">
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Cookie Preferences</a></li>
            </ul>
          </div>
          <!-- Col 3: Service -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Service</h4>
            <ul class="space-y-2 text-3xs text-stone-400">
              <li><a href="#" class="hover:text-white transition-colors">Hubungi Kami</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Bantuan FAQ</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Layanan Pengrajin</a></li>
            </ul>
          </div>
          <!-- Col 4: Social Media -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Social Media</h4>
            <ul class="space-y-2 text-3xs text-stone-400">
              <li><a href="#" class="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" class="hover:text-white transition-colors">TikTok</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-3xs text-stone-500 font-medium">
        <p>&copy; 2026 SEDALANG. Hak Cipta Dilindungi.</p>
        <div class="flex gap-4">
          <a href="#" class="hover:text-stone-400">Syarat Ketentuan</a>
          <a href="#" class="hover:text-stone-400">Kebijakan Privasi</a>
        </div>
      </div>
    </footer>
  </div>
</template>

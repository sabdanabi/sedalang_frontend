<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// States for interactive upload simulation
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedImage = ref<string | null>(null)
const isAnalyzing = ref(false)
const detectedMaterial = ref<string>('Plastik') // Default material matched to mockup

const triggerFileSelect = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Simulate uploading / analysis spinner
    isAnalyzing.value = true
    const reader = new FileReader()
    reader.onload = (event) => {
      setTimeout(() => {
        uploadedImage.value = event.target?.result as string
        isAnalyzing.value = false
        // Simulate material detection
        detectedMaterial.value = file.name.toLowerCase().includes('botol') || file.name.toLowerCase().includes('plastik') 
          ? 'Plastik' 
          : 'Logam / Campuran'
      }, 1000)
    }
    reader.readAsDataURL(file)
  }
}

// Interactive recommendation ideas
const selectedIdeaIndex = ref(0)
const recommendations = ref([
  {
    title: 'Dekorasi Lampu Meja',
    description: 'Ubah botol bekas menjadi lampu dekoratif menggunakan LED.',
    // In our design, when Dekorasi Lampu Meja is active, we display the bottle lamp simulation image
    image: '/images/default_images/default_img.webp'
  },
  {
    title: 'Pot Tanaman Penyiram Otomatis',
    description: 'botol bekas menjadi pot dengan sistem pengaturan kelembapan.',
    image: '/images/default_images/default_img.webp'
  },
  {
    title: 'Kotak Penyimpan Modular',
    description: 'Sistem penyimpanan modular untuk menata meja',
    image: '/images/default_images/default_img.webp'
  }
])

const selectRecommendation = (index: number) => {
  selectedIdeaIndex.value = index
}

const handleConsultation = (craftsmanName: string) => {
  alert(`Memulai konsultasi desain dengan ${craftsmanName}...`)
}
</script>

<template>
  <div class="min-h-screen bg-white select-none py-10">
    <div class="max-w-8xl mx-auto px-16 lg:px-20">
      
      <!-- Top Page Title Block -->
      <header class="mb-10 text-left">
        <h1 class="font-poppins text-3xl font-bold text-gray-950 tracking-tight leading-tight">
          Ide Daur Ulang Berbasis AI
        </h1>
        <p class="font-inter text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Unggah foto barang bekas Anda dan biarkan AI memberikan rekomendasi kreatif untuk mengolahnya menjadi produk bernilai.
        </p>
      </header>

      <!-- Main Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Panel: Interactive Upload and AI Analysis results (lg:col-span-7) -->
        <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          
          <!-- Image Upload Area Card -->
          <div 
            @click="triggerFileSelect"
            class="border-2 border-dashed border-gray-200/80 rounded-[28px] p-8 md:p-12 flex flex-col items-center justify-center bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/60 hover:border-[#7A4D30]/40 transition-all duration-300 cursor-pointer text-center relative overflow-hidden"
          >
            <!-- File Input (Hidden) -->
            <input 
              ref="fileInput"
              type="file" 
              class="hidden" 
              accept="image/*" 
              @change="handleFileChange"
            />

            <!-- Preview Image if uploaded -->
            <div v-if="uploadedImage && !isAnalyzing" class="absolute inset-0 w-full h-full">
              <img 
                :src="uploadedImage" 
                alt="Uploaded item" 
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span class="text-white text-sm font-semibold bg-[#7A4D30] px-4 py-2 rounded-full shadow">
                  Ganti Gambar
                </span>
              </div>
            </div>

            <!-- Upload placeholder content -->
            <div v-else-if="!isAnalyzing" class="flex flex-col items-center">
              <div class="w-14 h-14 rounded-full bg-[#7A4D30]/10 flex items-center justify-center text-[#7A4D30] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <h3 class="font-poppins text-lg font-bold text-gray-950">
                Unggah foto barang bekas anda
              </h3>
              <p class="font-inter text-sm text-gray-400 mt-1.5 max-w-sm">
                Ambil foto barang bekas yang ingin anda daur ulang
              </p>
              
              <button 
                type="button" 
                class="mt-6 bg-[#7A4D30] hover:bg-[#6A3F25] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
              >
                Pilih Gambar
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
            </div>

            <!-- Analysis loader spinner -->
            <div v-else class="flex flex-col items-center py-6">
              <svg class="animate-spin h-10 w-10 text-[#7A4D30] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <h3 class="font-poppins text-base font-bold text-gray-950 animate-pulse">
                Menganalisis Material...
              </h3>
            </div>
          </div>

          <!-- Hasil Analisis Container -->
          <div class="flex flex-col text-left">
            <h2 class="font-poppins text-xl font-bold text-gray-950">
              Hasil Analisis
            </h2>
            <p class="font-inter text-sm text-gray-500 mt-1">
              Material terdeteksi berbahan : <span class="font-bold text-[#7A4D30]">{{ detectedMaterial }}</span>
            </p>

            <!-- Split results: recommendations on the left, simulation on the right -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-start">
              
              <!-- Idea Recommendation List (md:col-span-7) -->
              <div class="md:col-span-7 flex flex-col gap-4">
                <span class="font-poppins text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Rekomendasi Ide
                </span>
                
                <div 
                  v-for="(rec, idx) in recommendations" 
                  :key="rec.title"
                  @click="selectRecommendation(idx)"
                  class="border rounded-[20px] p-4 cursor-pointer transition-all duration-300 text-left select-none"
                  :class="[
                    selectedIdeaIndex === idx 
                      ? 'border-[#7A4D30] bg-[#FAF8F5]' 
                      : 'border-gray-200/70 hover:border-gray-300 bg-white'
                  ]"
                >
                  <h4 
                    class="font-poppins text-sm md:text-base font-bold"
                    :class="selectedIdeaIndex === idx ? 'text-[#7A4D30]' : 'text-gray-950'"
                  >
                    {{ rec.title }}
                  </h4>
                  <p class="font-inter text-xs text-gray-500 mt-1 leading-relaxed">
                    {{ rec.description }}
                  </p>
                </div>
              </div>

              <!-- Simulation Image Preview (md:col-span-5) -->
              <div class="md:col-span-5 flex flex-col gap-4">
                <span class="font-poppins text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Simulasi Gambar
                </span>
                
                <div class="w-full rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] bg-[#FAF8F5] relative group">
                  <!-- Simulated rendering image -->
                  <img 
                    :src="recommendations[selectedIdeaIndex].image" 
                    alt="Simulation preview" 
                    class="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <!-- Glassy overlay title -->
                  <div class="absolute bottom-3 left-3 right-3 bg-white/85 backdrop-blur-md py-2.5 px-4 rounded-[16px] border border-white/40 shadow-sm text-left">
                    <span class="text-xs font-bold text-gray-900 block leading-tight truncate">
                      {{ recommendations[selectedIdeaIndex].title }}
                    </span>
                    <span class="text-[9px] text-gray-400 font-medium block mt-0.5 leading-none uppercase tracking-wide">
                      AI Generated Render
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- Right Panel: Craftsman Consultation Sidebar (lg:col-span-5) -->
        <aside class="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 text-left">
          
          <!-- Card 1: Spesialis Plastik -->
          <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-md transition-all duration-300 flex flex-col gap-4">
            <!-- Header -->
            <div class="flex justify-between items-baseline select-none">
              <div>
                <h3 class="font-poppins text-base lg:text-lg font-bold text-gray-950 leading-tight">
                  Spesialis Plastik
                </h3>
                <p class="font-inter text-xs text-gray-400 mt-0.5">
                  Pengrajin yang menerima material ini
                </p>
              </div>
              <button class="text-xs font-bold text-[#7A4D30] hover:text-[#6A3F25] transition-colors focus:outline-none cursor-pointer">
                See All
              </button>
            </div>

            <!-- Illustration with Location Badge -->
            <div class="relative w-full h-[180px] rounded-[20px] overflow-hidden select-none bg-gray-50 border border-gray-100">
              <img 
                src="/images/default_images/default_img.webp" 
                alt="KaryaLoka Craft portfolio" 
                class="w-full h-full object-cover"
              />
              <div class="absolute top-3 left-3 bg-white px-3 py-1 rounded-full border border-gray-100/50 shadow-sm">
                <span class="text-[9px] font-bold text-gray-900 uppercase tracking-wider">
                  SEMARANG TENGAH
                </span>
              </div>
            </div>

            <!-- Title & Rating -->
            <div class="flex justify-between items-center mt-1 select-none">
              <h4 class="font-poppins text-base font-bold text-gray-950 leading-none">
                KaryaLoka Craft
              </h4>
              <div class="flex items-center gap-1 text-[#D4A373]">
                <span class="text-xs font-bold">★</span>
                <span class="text-xs font-bold text-gray-900">4.9</span>
              </div>
            </div>

            <!-- Description -->
            <p class="font-inter text-xs text-gray-500 leading-relaxed">
              Spesialis dalam pembuatan dekorasi rumah dan produk pencahayaan dari material daur ulang.
            </p>

            <!-- Action button -->
            <button 
              @click="handleConsultation('KaryaLoka Craft')"
              type="button" 
              class="w-full py-2.5 rounded-full border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer active:scale-[0.99]"
            >
              Konsultasikan Desain
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
          </div>

          <!-- Card 2: Plastic Specialists -->
          <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-md transition-all duration-300 flex flex-col gap-4">
            <!-- Header -->
            <div class="flex justify-between items-baseline select-none">
              <div>
                <h3 class="font-poppins text-base lg:text-lg font-bold text-gray-950 leading-tight">
                  Plastic Specialists
                </h3>
                <p class="font-inter text-xs text-gray-400 mt-0.5">
                  Craftsmen near you for this material
                </p>
              </div>
              <button class="text-xs font-bold text-[#7A4D30] hover:text-[#6A3F25] transition-colors focus:outline-none cursor-pointer">
                See All
              </button>
            </div>

            <!-- Illustration with Location Badge -->
            <div class="relative w-full h-[180px] rounded-[20px] overflow-hidden select-none bg-gray-50 border border-gray-100">
              <img 
                src="/images/default_images/default_img.webp" 
                alt="KaryaLoka Craft profile photo" 
                class="w-full h-full object-cover"
              />
              <div class="absolute top-3 left-3 bg-white px-3 py-1 rounded-full border border-gray-100/50 shadow-sm">
                <span class="text-[9px] font-bold text-gray-900 uppercase tracking-wider">
                  SEMARANG TENGAH
                </span>
              </div>
            </div>

            <!-- Title & Rating -->
            <div class="flex justify-between items-center mt-1 select-none">
              <h4 class="font-poppins text-base font-bold text-gray-950 leading-none">
                KaryaLoka Craft
              </h4>
              <div class="flex items-center gap-1 text-[#D4A373]">
                <span class="text-xs font-bold">★</span>
                <span class="text-xs font-bold text-gray-900">4.9</span>
              </div>
            </div>

            <!-- Description -->
            <p class="font-inter text-xs text-gray-500 leading-relaxed">
              Expert in high-end recycled home decor and lighting solutions.
            </p>

            <!-- Action button -->
            <button 
              @click="handleConsultation('KaryaLoka Craft (International)')"
              type="button" 
              class="w-full py-2.5 rounded-full border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer active:scale-[0.99]"
            >
              Konsultasikan Desain
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
          </div>

        </aside>

      </div>
    </div>
  </div>
</template>

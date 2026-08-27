<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// User profile state
const userName = ref('Bruno')
const selectedFile = ref<File | null>(null)
const previewImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const promptText = ref('')
const isAnalyzing = ref(false)
const detectedMaterial = ref('Plastik')
const showModal = ref(false)
const selectedProduct = ref<Product | null>(null)

// Onboarding verification check
onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
    } else {
      userName.value = localStorage.getItem('sedalang_user_name') || 'Bruno'
    }
  }
})

// Recommendation list structures
interface Tool {
  name: string
  icon: string
}

interface Skill {
  name: string
  icon: string
  desc: string
  color: string
}

interface Step {
  title: string
  desc: string
}

interface Product {
  id: number
  title: string
  subtitle: string
  description: string
  detailDescription: string
  tools: Tool[]
  materials: string[]
  skills: Skill[]
  steps: Step[]
  image: string
  materialType: string
}

const defaultProducts: Product[] = [
  {
    id: 1,
    title: 'Tempat Pensil Kaleng Bekas',
    subtitle: 'Ubah limbah anorganik menjadi dekorasi meja yang fungsional dan estetis.',
    description: 'Kaleng bekas dimanfaatkan kembali menjadi tempat pensil yang sederhana dan fungsional. Dengan tambahan dekorasi bernuansa natural, karya ini memberikan tampilan yang menarik sekaligus mengurangi limbah kemasan.',
    detailDescription: 'Proyek ini mengusung konsep ekonomi sirkular dengan memanfaatkan kaleng bekas makanan atau minuman. Melalui sentuhan cat organik dan dekorasi minimalis, kaleng yang semula menjadi limbah ditransformasikan menjadi wadah alat tulis premium yang tahan lama dan ramah lingkungan. Cocok untuk mempercantik ruang kerja bergaya Japandi atau Industrial.',
    tools: [
      { name: 'Gunting', icon: '✂' },
      { name: 'Kuas', icon: '🖌' },
      { name: 'Cutter', icon: '🔪' },
      { name: 'Amplas', icon: '▤' },
      { name: 'Penggaris', icon: '📏' }
    ],
    materials: ['Kaleng Bekas', 'Kertas Dekorasi', 'Lem Serbaguna', 'Cat Akrilik', 'Lapisan Pelindung'],
    skills: [
      {
        name: 'Upcycling',
        icon: '♻',
        desc: 'Mengelola kaleng bekas menjadi produk baru yang memiliki nilai guna dan estetika',
        color: 'bg-[#F2FAF3] text-[#2D7A41] border-[#D6EFE0]'
      },
      {
        name: 'Kerajinan Dekoratif',
        icon: '🎨',
        desc: 'Membuat serta menerapkan motif atau dekorasi agar produk memiliki tampilan yang menarik.',
        color: 'bg-[#FFF8F2] text-[#B25E15] border-[#FCE9D8]'
      },
      {
        name: 'Pengolahan Material',
        icon: '🛠',
        desc: 'Memotong, membersihkan, dan membentuk material bekas agar siap digunakan sebagai bahan karya.',
        color: 'bg-[#F5F7FA] text-[#475569] border-[#E2E8F0]'
      }
    ],
    steps: [
      { title: 'Persiapan', desc: 'Membersihkan kaleng dari sisa makanan dan label yang terpasang' },
      { title: 'Perapian', desc: 'Menghaluskankan bagian pinggir kaleng dengan amplas supaya aman' },
      { title: 'Dekorasi', desc: 'Pengecatan dasar dan pembuatan motif atau kertas dekorasi' },
      { title: 'Finishing', desc: 'Pemberian lapisan pelindung untuk ketahanan cat atau motif' },
      { title: 'Pemeriksaan', desc: 'Pengecekan kualitas produk sebelum digunakan' }
    ],
    image: '/images/default_images/default_img.webp',
    materialType: 'Logam / Kaleng'
  },
  {
    id: 2,
    title: 'Lampu Meja Dekorasi',
    subtitle: 'Ubah botol bekas menjadi penerangan ruang yang estetik dan hangat.',
    description: 'Ubah botol bekas menjadi lampu meja dekoratif yang unik dengan tambahan LED. Hasilnya memberikan kesan hangat dan estetik sekaligus memanfaatkan kembali barang yang sudah tidak terpakai.',
    detailDescription: 'Lampu meja estetik dengan efek cahaya hangat yang dibuat dari botol bekas terpilih. Dilengkapi dengan dudukan kayu minimalis dan lampu LED hemat energi. Mengubah limbah botol kaca atau plastik tebal menjadi dekorasi interior premium bernuansa hangat dan nyaman untuk kamar tidur atau ruang tamu.',
    tools: [
      { name: 'Solder', icon: '🔌' },
      { name: 'Lem Tembak', icon: '🔫' },
      { name: 'Bor Kecil', icon: '⚙' },
      { name: 'Cutter', icon: '🔪' },
      { name: 'Penggaris', icon: '📏' }
    ],
    materials: ['Botol Kaca Bekas', 'Lampu LED Strip', 'Kabel & Sakelar', 'Dudukan Kayu', 'Cat Transparan'],
    skills: [
      {
        name: 'Rangkaian Listrik',
        icon: '⚡',
        desc: 'Menyusun kabel LED dan sakelar sederhana untuk kelistrikan yang aman.',
        color: 'bg-[#FFF5F5] text-[#C53030] border-[#FEB2B2]/40'
      },
      {
        name: 'Upcycling',
        icon: '♻',
        desc: 'Mengubah struktur limbah botol kaca menjadi fungsi pencahayaan yang fungsional.',
        color: 'bg-[#F2FAF3] text-[#2D7A41] border-[#D6EFE0]'
      },
      {
        name: 'Pengolahan Kayu',
        icon: '🪵',
        desc: 'Membuat potongan dudukan kayu dan merapikannya dengan pernis.',
        color: 'bg-[#FFF8F2] text-[#B25E15] border-[#FCE9D8]'
      }
    ],
    steps: [
      { title: 'Pembersihan', desc: 'Mencuci botol kaca bekas hingga bersih dan mengeringkannya sepenuhnya' },
      { title: 'Melubangi Botol', desc: 'Melubangi bagian bawah botol kaca dengan bor khusus secara perlahan' },
      { title: 'Merangkai LED', desc: 'Memasukkan kabel lampu LED ke dalam botol dan merangkainya' },
      { title: 'Dudukan Kayu', desc: 'Memasang botol pada dudukan kayu minimalis menggunakan lem rekat kuat' },
      { title: 'Pengujian', desc: 'Menghubungkan ke sakelar dan baterai untuk memastikan lampu berfungsi' }
    ],
    image: '/images/default_images/default_img.webp',
    materialType: 'Plastik / Kaca'
  },
  {
    id: 3,
    title: 'Tote Bag Denim',
    subtitle: 'Ubah celana jeans bekas menjadi tas jinjing modis yang kuat dan ramah lingkungan.',
    description: 'Ubah celana jeans bekas menjadi tas tote yang praktis dan stylish. Bahan denim yang sudah tidak terpakai dimanfaatkan kembali menjadi tas yang kuat, fungsional, dan karya ini sekaligus mengurangi limbah tekstil.',
    detailDescription: 'Tas tote bag kasual yang dijahit dari celana jeans denim yang sudah tidak digunakan lagi. Dengan pegangan kulit sintetis berwarna cokelat dan saku jeans asli di bagian depan untuk fungsionalitas ekstra. Kuat untuk membawa buku, tablet, atau belanjaan sehari-hari.',
    tools: [
      { name: 'Gunting Kain', icon: '✂' },
      { name: 'Mesin Jahit', icon: '🧵' },
      { name: 'Jarum Pentul', icon: '📍' },
      { name: 'Kapur Jahit', icon: '✏' },
      { name: 'Penggaris', icon: '📏' }
    ],
    materials: ['Celana Jeans Bekas', 'Benang Jahit Tebal', 'Tali Kulit Sintetis', 'Kain Furing', 'Paku Keling (Rivet)'],
    skills: [
      {
        name: 'Teknik Jahit',
        icon: '🧵',
        desc: 'Menjahit material denim tebal menggunakan mesin jahit secara presisi dan kuat.',
        color: 'bg-[#F0F5FF] text-[#1E3A8A] border-[#D1E2FF]'
      },
      {
        name: 'Desain Pola',
        icon: '📐',
        desc: 'Merancang potongan jeans agar sesuai dengan pola tas yang bervolume.',
        color: 'bg-[#FDF2F8] text-[#9D174D] border-[#FCE7F3]'
      },
      {
        name: 'Upcycling',
        icon: '♻',
        desc: 'Mengolah sisa pakaian jeans denim tidak terpakai menjadi barang baru.',
        color: 'bg-[#F2FAF3] text-[#2D7A41] border-[#D6EFE0]'
      }
    ],
    steps: [
      { title: 'Pola Potong', desc: 'Membuat garis potong pada celana jeans bekas sesuai ukuran tinggi tas' },
      { title: 'Jahit Alas', desc: 'Membalik kain jeans dan menjahit bagian bawah potongan untuk menutup dasar tas' },
      { title: 'Kain Furing', desc: 'Memasang kain furing pelapis bagian dalam tas agar penyimpanan lebih rapi' },
      { title: 'Pegangan Tas', desc: 'Memasang tali kulit sintetis pada bibir tas menggunakan rivet atau jahitan ganda' },
      { title: 'Aksesoris Saku', desc: 'Memindahkan saku celana belakang ke bagian depan tas sebagai saku luar' }
    ],
    image: '/images/default_images/default_img.webp',
    materialType: 'Kain Perca / Denim'
  }
]

const products = ref<Product[]>(defaultProducts)

// Handle trigger file upload
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Handle file change & validate only images
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Validate file type is image
    if (!file.type.startsWith('image/')) {
      alert('File tidak valid! Hanya diperbolehkan menambahkan file gambar.')
      // Reset input
      target.value = ''
      return
    }

    selectedFile.value = file
    
    // Create image preview url
    const reader = new FileReader()
    reader.onload = (event) => {
      previewImage.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Remove selected image
const removeSelectedImage = () => {
  selectedFile.value = null
  previewImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Simulated AI search / send prompt
const handleSendPrompt = () => {
  if (!promptText.value.trim() && !selectedFile.value) {
    alert('Silakan masukkan pertanyaan atau unggah foto terlebih dahulu.')
    return
  }

  isAnalyzing.value = true

  // Simulate AI processing delay
  setTimeout(() => {
    isAnalyzing.value = false
    
    // Determine detected material dynamically based on image or text prompt
    const contentText = (promptText.value + (selectedFile.value?.name || '')).toLowerCase()
    
    if (contentText.includes('kaleng') || contentText.includes('seng') || contentText.includes('besi') || contentText.includes('logam') || contentText.includes('can')) {
      detectedMaterial.value = 'Logam'
      // Reorder products to put metal first
      products.value = [
        defaultProducts[0],
        defaultProducts[1],
        defaultProducts[2]
      ]
    } else if (contentText.includes('jeans') || contentText.includes('baju') || contentText.includes('kain') || contentText.includes('denim') || contentText.includes('perca') || contentText.includes('tas')) {
      detectedMaterial.value = 'Kain Perca / Tekstil'
      // Reorder products to put textile first
      products.value = [
        defaultProducts[2],
        defaultProducts[1],
        defaultProducts[0]
      ]
    } else {
      detectedMaterial.value = 'Plastik'
      // Reorder products to put plastic/glass first
      products.value = [
        defaultProducts[1],
        defaultProducts[0],
        defaultProducts[2]
      ]
    }
  }, 1200)
}

// Open Detail Popup
const openProductDetail = (product: Product) => {
  selectedProduct.value = product
  showModal.value = true
}

// Close Detail Popup
const closeProductDetail = () => {
  showModal.value = false
  selectedProduct.value = null
}
</script>

<template>
  <div class="min-h-screen bg-white select-none py-10">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20">
      
      <!-- Header Title Section -->
      <header class="mb-10 text-left">
        <h1 class="font-poppins text-3xl md:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
          Ide Daur Ulang Berbasis AI
        </h1>
        <p class="font-inter text-sm md:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Unggah foto barang bekas Anda dan biarkan AI memberikan rekomendasi kreatif untuk mengolahnya menjadi produk bernilai.
        </p>
      </header>

      <!-- Welcome and Prompt Input Card -->
      <section class="mb-14 max-w-5xl mx-auto">
        <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col items-center justify-center text-center">
          
          <div class="mb-6">
            <h2 class="font-poppins text-2xl md:text-3xl font-bold text-gray-950">
              Selamat Datang, <span class="text-[#7A4D30]">{{ userName }}</span>
            </h2>
            <p class="font-inter text-sm md:text-base text-gray-400 mt-1">
              Kita mulai mengerjakan dari mana hari ini?
            </p>
          </div>

          <!-- Interactive Textarea Container -->
          <div class="w-full max-w-3xl border-2 border-[#849CFC]/70 hover:border-[#849CFC] focus-within:border-[#5A80F9] focus-within:ring-4 focus-within:ring-[#5A80F9]/10 rounded-[24px] p-4 bg-white transition-all duration-300 flex flex-col relative text-left">
            
            <!-- Textarea Prompt -->
            <textarea
              v-model="promptText"
              rows="3"
              placeholder="Tanyakan apa saja disini..."
              class="w-full bg-transparent text-gray-800 placeholder-gray-400 text-sm md:text-base outline-none resize-none font-inter leading-relaxed"
              @keydown.enter.prevent="handleSendPrompt"
            ></textarea>

            <!-- File Upload & Actions Row -->
            <div class="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
              
              <!-- Left Action: Plus Button & Upload Preview -->
              <div class="flex items-center gap-3">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="w-10 h-10 rounded-full border border-gray-200 hover:border-[#7A4D30]/40 flex items-center justify-center text-gray-400 hover:text-[#7A4D30] bg-white transition-all duration-200 hover:bg-[#7A4D30]/5 cursor-pointer focus:outline-none"
                  title="Tambah File Gambar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>

                <!-- Thumbnail Image Preview -->
                <div v-if="previewImage" class="relative flex items-center bg-gray-50 border border-gray-100 rounded-lg p-1.5 pr-8">
                  <img :src="previewImage" alt="Preview" class="w-8 h-8 object-cover rounded-md" />
                  <span class="text-[11px] text-gray-500 ml-2 max-w-[120px] truncate font-inter">
                    {{ selectedFile?.name }}
                  </span>
                  <button
                    type="button"
                    @click="removeSelectedImage"
                    class="absolute -top-1.5 -right-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-4.5 h-4.5 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-2.5 h-2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Right Action: Submit Button -->
              <button
                type="button"
                @click="handleSendPrompt"
                class="w-10 h-10 rounded-full bg-[#7A4D30] hover:bg-[#6A3F25] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none"
                title="Kirim"
              >
                <!-- Send Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 transform rotate-45 -translate-x-0.5 translate-y-0.5">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.53 60.53 0 0 0 18.257-8.305.75.75 0 0 0 0-1.238 60.53 60.53 0 0 0-18.257-8.305Z" />
                </svg>
              </button>

            </div>

          </div>

        </div>
      </section>

      <!-- Analysis Results Header Section -->
      <section class="mb-8 border-t border-gray-100 pt-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="text-left">
            <h2 class="font-poppins text-2xl md:text-3xl font-bold text-gray-950">
              Hasil Analisis
            </h2>
            <p class="font-inter text-sm md:text-base text-gray-500 mt-1.5">
              Material terdeteksi berbahan : 
              <span class="text-[#7A4D30] font-bold">{{ detectedMaterial }}</span>
            </p>
          </div>
          <!-- Loader indicator -->
          <div v-if="isAnalyzing" class="flex items-center gap-2 text-[#7A4D30] text-sm font-semibold">
            <svg class="animate-spin h-5 w-5 text-[#7A4D30]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            AI sedang menganalisis...
          </div>
        </div>
      </section>

      <!-- Product Cards Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="bg-white rounded-[24px] overflow-hidden flex flex-col justify-between text-left group transition-all duration-300 hover:translate-y-[-4px]"
        >
          <!-- Product Card Image -->
          <div class="relative aspect-[4/3] rounded-[24px] overflow-hidden mb-5">
            <img 
              :src="product.image" 
              :alt="product.title" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <!-- Material Category tag -->
            <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#7A4D30] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              {{ product.materialType }}
            </span>
          </div>

          <!-- Product Card Content -->
          <div class="flex-grow flex flex-col justify-between">
            <div class="mb-6">
              <h3 class="font-poppins text-lg font-bold text-gray-950 group-hover:text-[#7A4D30] transition-colors duration-200">
                {{ product.title }}
              </h3>
              <p class="font-inter text-xs md:text-sm text-gray-400 mt-2 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Card Action Button -->
            <button
              type="button"
              @click="openProductDetail(product)"
              class="w-full md:w-auto self-start border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30] hover:text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 group cursor-pointer focus:outline-none"
            >
              Selengkapnya
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>

    <!-- Product Detail Popup Modal -->
    <Transition name="fade">
      <div 
        v-if="showModal && selectedProduct" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="closeProductDetail"
      >
        <Transition name="scale">
          <div class="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] text-left p-6 md:p-8">
            
            <!-- Modal Header -->
            <div class="flex items-start justify-between pb-6 border-b border-gray-100">
              <div class="pr-8 text-left">
                <h3 class="font-poppins text-2xl font-bold text-gray-950 leading-snug">
                  {{ selectedProduct.title }}
                </h3>
                <p class="font-inter text-sm text-gray-400 mt-1">
                  {{ selectedProduct.subtitle }}
                </p>
              </div>
              
              <!-- Close Button -->
              <button 
                @click="closeProductDetail"
                class="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all duration-200 cursor-pointer focus:outline-none flex-shrink-0"
                aria-label="Tutup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Scrollable Content Container -->
            <div class="flex-grow overflow-y-auto mt-6 pr-2">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                <!-- Left Column: Image and Timeline -->
                <div class="md:col-span-5 flex flex-col">
                  <!-- Product Image -->
                  <div class="w-full aspect-[4/3] md:aspect-square rounded-[24px] overflow-hidden bg-gray-50">
                    <img 
                      :src="selectedProduct.image" 
                      :alt="selectedProduct.title" 
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Timeline: Proses Pembuatan -->
                  <div class="mt-8 text-left">
                    <h4 class="font-poppins text-base font-bold text-gray-950 mb-6">
                      Proses Pembuatan
                    </h4>
                    
                    <div class="flex flex-col">
                      <div 
                        v-for="(step, index) in selectedProduct.steps" 
                        :key="index"
                        class="flex gap-4 relative pb-6 last:pb-0"
                      >
                        <!-- Timeline circle connecting line -->
                        <div 
                          v-if="index < selectedProduct.steps.length - 1" 
                          class="absolute top-8 left-[15px] w-[2px] h-[calc(100%-8px)] bg-gray-100"
                        ></div>

                        <!-- Step badge index circle -->
                        <div class="w-8 h-8 rounded-full bg-[#7A4D30] text-white flex items-center justify-center font-poppins text-xs font-bold flex-shrink-0 z-10">
                          {{ index + 1 }}
                        </div>

                        <!-- Step text content -->
                        <div class="flex flex-col text-left pt-0.5">
                          <span class="font-poppins text-sm font-bold text-gray-950">
                            {{ step.title }}
                          </span>
                          <span class="font-inter text-xs text-gray-400 mt-1 leading-relaxed">
                            {{ step.desc }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Details descriptions and badges -->
                <div class="md:col-span-7 flex flex-col gap-6">
                  
                  <!-- Description -->
                  <div>
                    <h4 class="font-poppins text-base font-bold text-gray-950 mb-2">
                      Deskripsi Produk
                    </h4>
                    <p class="font-inter text-sm text-gray-400 leading-relaxed">
                      {{ selectedProduct.detailDescription }}
                    </p>
                  </div>

                  <!-- Tools Badges -->
                  <div>
                    <h4 class="font-poppins text-base font-bold text-gray-950 mb-3">
                      Alat yang Digunakan
                    </h4>
                    <div class="flex flex-wrap gap-2.5">
                      <div 
                        v-for="(tool, index) in selectedProduct.tools" 
                        :key="index"
                        class="px-4 py-2 rounded-full bg-[#7A4D30] text-white text-xs font-medium shadow-sm transition-all duration-200 hover:opacity-90"
                      >
                        {{ tool.name }}
                      </div>
                    </div>
                  </div>

                  <!-- Materials Badges -->
                  <div>
                    <h4 class="font-poppins text-base font-bold text-gray-950 mb-3">
                      Bahan Material
                    </h4>
                    <div class="flex flex-wrap gap-2.5">
                      <div 
                        v-for="(material, index) in selectedProduct.materials" 
                        :key="index"
                        class="px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200/60"
                      >
                        {{ material }}
                      </div>
                    </div>
                  </div>

                  <!-- Skills Required cards -->
                  <div>
                    <h4 class="font-poppins text-base font-bold text-gray-950 mb-3">
                      Keahlian yang Dibutuhkan
                    </h4>
                    <div class="flex flex-col gap-3">
                      <div 
                        v-for="(skill, index) in selectedProduct.skills" 
                        :key="index"
                        class="p-4 rounded-[18px] border transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-1.5"
                        :class="skill.color"
                      >
                        <div class="flex items-center gap-1.5">
                          <span class="text-xs font-bold font-inter tracking-wide uppercase px-2.5 py-0.5 rounded-md border border-current bg-white/60">
                            {{ skill.name }}
                          </span>
                        </div>
                        <p class="font-inter text-xs leading-relaxed opacity-85">
                          {{ skill.desc }}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            <!-- Modal Footer button -->
            <div class="mt-6 pt-4 border-t border-gray-100 flex justify-center">
              <button
                type="button"
                @click="closeProductDetail"
                class="w-full border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30] hover:text-white py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 group cursor-pointer focus:outline-none"
              >
                Gunakan Ide Ini
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Page & Modal Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.92);
  opacity: 0;
}
</style>

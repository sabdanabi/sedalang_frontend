<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// User profile state
const userName = ref('Bruno')
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
    description: 'Kaleng bekas dimanfaatkan kembali menjadi tempat pencil yang sederhana dan fungsional. Dengan tambahan dekorasi bernuansa natural, karya ini memberikan tampilan yang menarik sekaligus mengurangi limbah kemasan.',
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
      { title: 'Jahit Alas', desc: 'Membalik kain jeans and menjahit bagian bawah potongan untuk menutup dasar tas' },
      { title: 'Kain Furing', desc: 'Memasang kain furing pelapis bagian dalam tas agar penyimpanan lebih rapi' },
      { title: 'Pegangan Tas', desc: 'Memasang tali kulit sintetis pada bibir tas menggunakan rivet atau jahitan ganda' },
      { title: 'Aksesoris Saku', desc: 'Memindahkan saku celana belakang ke bagian depan tas sebagai saku luar' }
    ],
    image: '/images/default_images/default_img.webp',
    materialType: 'Kain Perca / Denim'
  }
]

const products = ref<Product[]>(defaultProducts)

// AI prompt history state
interface HistoryItem {
  id: string
  promptText: string
  previewImage: string | null
  detectedMaterial: string
  products: Product[]
}

const history = ref<HistoryItem[]>([])

const recallHistoryItem = (item: HistoryItem) => {
  detectedMaterial.value = item.detectedMaterial
  products.value = [...item.products]
}

// Simulated AI search / send prompt
const handlePromptSubmit = (data: { promptText: string; selectedFile: File | null; previewImage: string | null }) => {
  isAnalyzing.value = true

  // Simulate AI processing delay
  setTimeout(() => {
    isAnalyzing.value = false
    
    // Determine detected material dynamically based on image or text prompt
    const contentText = (data.promptText + (data.selectedFile?.name || '')).toLowerCase()
    
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

    // Capture in history
    history.value.unshift({
      id: Date.now().toString(),
      promptText: data.promptText.trim() || (data.selectedFile ? `Foto: ${data.selectedFile.name}` : 'Tanya AI'),
      previewImage: data.previewImage,
      detectedMaterial: detectedMaterial.value,
      products: [...products.value]
    })
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
  <div class="min-h-screen bg-white py-10">
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
      <section class="mb-14 max-w-8xl mx-auto">
        <FeaturesDashboardWelcomeCard
          :userName="userName"
          :isAnalyzing="isAnalyzing"
          @submit="handlePromptSubmit"
        />
      </section>

      <!-- History Section -->
      <section v-if="history.length > 0" class="mb-10 text-left">
        <h3 class="font-poppins text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Pencarian Terakhir
        </h3>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="item in history"
            :key="item.id"
            @click="recallHistoryItem(item)"
            class="flex items-center gap-2 px-4 py-2 rounded-[16px] border border-gray-200 bg-white hover:border-[#7A4D30] hover:bg-[#7A4D30]/5 text-gray-700 hover:text-[#7A4D30] transition-all duration-200 cursor-pointer shadow-sm text-xs font-semibold focus:outline-none"
          >
            <!-- Tiny Image Preview if uploaded -->
            <img 
              v-if="item.previewImage" 
              :src="item.previewImage" 
              alt="History Thumbnail" 
              class="w-5 h-5 rounded-full object-cover border border-gray-150" 
            />
            <span class="max-w-[150px] truncate font-inter">
              {{ item.promptText }}
            </span>
            <span class="text-[10px] text-gray-400 font-normal ml-0.5">
              ({{ item.detectedMaterial }})
            </span>
          </button>
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
        <FeaturesDashboardProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @select="openProductDetail"
        />
      </section>

    </div>

    <!-- Product Detail Popup Modal -->
    <FeaturesDashboardDetailModal
      :show="showModal"
      :product="selectedProduct"
      @close="closeProductDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useAIStore } from '~/stores/ai'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'dashboard'
})

const aiStore = useAIStore()
const authStore = useAuthStore()

// User profile state derived from authStore
const userName = computed(() => {
  return authStore.user?.fullName?.split(' ')[0] || 'User'
})

const isAnalyzing = ref(false)

// AI loading cycling messages
const AI_LOADING_MESSAGES = [
  'AI menganalis perintah...', 
  'Sedang memuat gambar...',
  'Sedang merancang ide yang sesuai...',
  'Sedang menyusun rekomendasi...',
  'Hampir selesai...',
]
const aiMsgIndex = ref(0)
let aiMsgInterval: ReturnType<typeof setInterval> | null = null

watch(isAnalyzing, (val) => {
  if (val) {
    aiMsgIndex.value = 0
    aiMsgInterval = setInterval(() => {
      aiMsgIndex.value = (aiMsgIndex.value + 1) % AI_LOADING_MESSAGES.length
    }, 2000)
  } else {
    if (aiMsgInterval) clearInterval(aiMsgInterval)
    aiMsgInterval = null
  }
})

onBeforeUnmount(() => {
  if (aiMsgInterval) clearInterval(aiMsgInterval)
})
const detectedMaterial = ref('')
const showModal = ref(false)
const selectedProduct = ref<Product | null>(null)

// Onboarding verification check
onMounted(async () => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    if (!authStore.user) {
      try {
        await authStore.getMe()
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }

    await loadAILearning()
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

const products = ref<Product[]>([])

const mapIdeaToProduct = (idea: any, materialName: string, defaultImage?: string): Product => {
  return {
    id: idea.id,
    title: idea.ideaTitle || 'Ide Daur Ulang',
    subtitle: idea.description || 'Deskripsi ide',
    description: idea.description || 'Deskripsi ide',
    detailDescription: idea.description || 'Deskripsi ide',
    tools: (idea.toolsNeeded || []).map((tool: string) => ({
      name: tool,
      icon: '🛠'
    })),
    materials: idea.materialsNeeded || [],
    skills: (idea.craftsmanSkills || []).map((skill: string) => ({
      name: skill,
      icon: '♻',
      desc: skill,
      color: 'bg-[#F2FAF3] text-[#2D7A41] border-[#D6EFE0]'
    })),
    steps: (idea.steps || []).map((stepDesc: string, idx: number) => ({
      title: `Langkah ${idx + 1}`,
      desc: stepDesc
    })),
    image: idea.imageUrl || defaultImage || '/images/default_images/default_img.webp',
    materialType: materialName
  }
}

// Map real API history records to history items expected by the UI
const history = computed(() => {
  return aiStore.historyList.map(record => {
    return {
      id: record.id,
      promptText: record.detectedMaterial,
      previewImage: record.rawImageUrl,
      detectedMaterial: record.detectedMaterial,
      products: record.ideas.map(idea => mapIdeaToProduct(idea, record.detectedMaterial, record.rawImageUrl))
    }
  })
})

const recallHistoryItem = (item: any) => {
  detectedMaterial.value = item.detectedMaterial
  products.value = [...item.products]
}

// Load history and automatically show the latest result on page load
const loadAILearning = async () => {
  try {
    const hist = await aiStore.getHistory()
    if (hist && hist.length > 0) {
      const latest = hist[0]
      detectedMaterial.value = latest.detectedMaterial
      products.value = latest.ideas.map(idea => mapIdeaToProduct(idea, latest.detectedMaterial, latest.rawImageUrl))
    }
  } catch (err) {
    console.error('Error loading AI history:', err)
  }
}

// Call backend API to analyze image
const handlePromptSubmit = async (data: { promptText: string; selectedFile: File | null; previewImage: string | null }) => {
  if (!data.selectedFile) {
    alert('Silakan unggah foto barang bekas terlebih dahulu untuk dianalisis oleh AI.')
    return
  }

  isAnalyzing.value = true
  try {
    const record = await aiStore.analyzeIdeas(data.selectedFile)
    detectedMaterial.value = record.detectedMaterial
    products.value = record.ideas.map(idea => mapIdeaToProduct(idea, record.detectedMaterial, record.rawImageUrl))
  } catch (err) {
    console.error('AI Analysis failed:', err)
    alert('Gagal menganalisis gambar. Pastikan Anda mengunggah berkas gambar yang valid.')
  } finally {
    isAnalyzing.value = false
  }
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

const handleUseIdea = () => {
  const ideaId = selectedProduct.value?.id
  showModal.value = false
  selectedProduct.value = null
  if (ideaId) {
    if (import.meta.client) {
      localStorage.setItem('sedalang_active_idea_id', String(ideaId))
    }
    navigateTo(`/select-craftsman?ideaId=${ideaId}`)
  } else {
    navigateTo('/select-craftsman')
  }
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

      <!-- Empty State Section -->
      <section v-if="products.length === 0 && !isAnalyzing" class="mb-10 text-center py-16 px-4 border border-dashed border-gray-200 rounded-[32px] bg-gray-50/50">
        <div class="w-16 h-16 bg-[#7A4D30]/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#7A4D30]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 21m0 0-.813-5.096L9 21Zm0 0h5.096H9.813ZM3 16.5v-6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 10.5v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 16.5Zm0-6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 10.5v6" />
          </svg>
        </div>
        <h3 class="font-poppins text-lg font-bold text-gray-900">Belum Ada Hasil Analisis</h3>
        <p class="font-inter text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
          Silakan unggah foto barang bekas Anda pada kotak di atas untuk mendeteksi material dan mendapatkan ide daur ulang kreatif dari AI.
        </p>
      </section>

      <!-- Analysis Results Section -->
      <template v-else>
        <section class="mb-8 border-t border-gray-100 pt-10">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="text-left">
              <h2 class="font-poppins text-2xl md:text-3xl font-bold text-gray-950">
                Hasil Analisis
              </h2>
              <p v-if="detectedMaterial" class="font-inter text-sm md:text-base text-gray-500 mt-1.5">
                Material terdeteksi berbahan: 
                <span class="text-[#7A4D30] font-bold">{{ detectedMaterial }}</span>
              </p>
            </div>
            <!-- Loader indicator -->
            <div v-if="isAnalyzing" class="flex items-center gap-2 text-[#7A4D30] text-sm font-semibold">
              <svg class="animate-spin h-5 w-5 text-[#7A4D30]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <Transition name="ai-msg" mode="out-in">
                <span :key="aiMsgIndex" class="font-semibold text-sm text-[#7A4D30]">
                  {{ AI_LOADING_MESSAGES[aiMsgIndex] }}
                </span>
              </Transition>
            </div>
          </div>
        </section>

        <!-- Product Cards Grid -->
        <section v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeaturesDashboardProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @select="openProductDetail"
          />
        </section>
      </template>

    </div>

    <!-- Product Detail Popup Modal -->
    <FeaturesDashboardDetailModal
      :show="showModal"
      :product="selectedProduct"
      @close="closeProductDetail"
      @use-idea="handleUseIdea"
    />
  </div>
</template>

<style scoped>
.ai-msg-enter-active,
.ai-msg-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.ai-msg-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.ai-msg-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

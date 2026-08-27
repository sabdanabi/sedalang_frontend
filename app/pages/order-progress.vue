<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const orderId = (route.query.id as string) || 'LMD95628654'

// Onboarding validation
onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    // Load persisted timeline steps
    const savedSteps = localStorage.getItem(`sedalang_timeline_steps_${orderId}`)
    if (savedSteps) {
      try {
        steps.value = JSON.parse(savedSteps)
      } catch (e) {
        console.error('Failed to parse timeline steps', e)
      }
    }
  }
})

// Types
interface TimelineStep {
  id: number
  title: string
  description: string
  date: string
  status: 'completed' | 'in_progress' | 'pending'
}

// Summary details (Mock order resolver)
const summary = ref({
  name: 'Lampu Meja Dekoratif',
  artisan: 'KaryaLoka Craft',
  price: 'Rp 150.000',
  materialDetail: 'Botol Kaca (3 unit)',
  shippingDetail: 'GoSend by Craftsman',
  targetDate: 'Oct 24, 2024',
  image: '/images/default_images/default_img.webp'
})

// Timeline Steps
const steps = ref<TimelineStep[]>([
  {
    id: 1,
    title: 'Material Diterima',
    description: 'Bahan sudah kami terima dan sudah kami verifikasi kondisinya.',
    date: 'Oct 12, 14:30',
    status: 'completed'
  },
  {
    id: 2,
    title: 'Proses Awal',
    description: 'Bahan sedang dibersihkan dan label botol sudah dilepas seluruhnya.',
    date: 'Oct 13, 09:15',
    status: 'completed'
  },
  {
    id: 3,
    title: 'Produksi',
    description: 'Proses pemotongan kaca sesuai desain vas. Sedang masuk tahap pembentukan tekstur.',
    date: 'Dalam proses',
    status: 'in_progress'
  },
  {
    id: 4,
    title: 'Penyelesaian',
    description: 'Pengecatan, perakitan kabel kelistrikan, dan pemasangan kap lampu.',
    date: 'Expected Oct 18',
    status: 'pending'
  },
  {
    id: 5,
    title: 'Siap untuk Dikirim',
    description: 'Produk dibungkus gelembung (bubble wrap) tebal dan diserahkan ke kurir.',
    date: 'Expected Oct 20',
    status: 'pending'
  }
])

// Photos Gallery
const photos = ref<string[]>([
  '/images/landing_page_images/tracking_progres_img.webp', // Main image
  '/images/landing_page_images/ai_page_img.webp',
  '/images/landing_page_images/discussion_room_img.webp',
  '/images/auth_img.webp',
  '/images/default_images/default_img.webp'
])

// Billing Breakdown
const billing = ref({
  productPrice: 'Rp 150.000',
  shippingFee: 'Rp 12.500',
  totalPrice: 'Rp 162.500'
})

// Modals State
const showAddModal = ref(false)
const showGalleryModal = ref(false)

const handleAddProgress = (formData: { title: string; description: string }) => {
  showAddModal.value = false

  // Find index of currently 'in_progress' step
  const inProgressIndex = steps.value.findIndex(s => s.status === 'in_progress')
  
  if (inProgressIndex !== -1) {
    // Complete the previous active step
    steps.value[inProgressIndex].status = 'completed'
    steps.value[inProgressIndex].date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`
  }

  // Create new active step
  const newStep: TimelineStep = {
    id: Date.now(),
    title: formData.title,
    description: formData.description,
    date: 'Dalam proses',
    status: 'in_progress'
  }

  // Insert before the pending steps
  const firstPendingIndex = steps.value.findIndex(s => s.status === 'pending')
  if (firstPendingIndex !== -1) {
    steps.value.splice(firstPendingIndex, 0, newStep)
  } else {
    steps.value.push(newStep)
  }

  // Update indexes of subsequent timeline items
  // Persist timeline steps
  if (import.meta.client) {
    localStorage.setItem(`sedalang_timeline_steps_${orderId}`, JSON.stringify(steps.value))
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-white py-10">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20">
      
      <!-- Header Section -->
      <header class="mb-10 text-left">
        <h1 class="font-poppins text-3xl md:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
          Progres Pesanan
        </h1>
        <p class="font-inter text-sm md:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Pantau progres daur ulang anda secara real time
        </p>
      </header>

      <!-- Split Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Side: Order specs & timeline steps (lg:col-span-8) -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Summary specs card -->
          <FeaturesHistoryProgressSummaryCard :summary="summary" />

          <!-- Timeline progress pengerjaan steps -->
          <FeaturesHistoryProgressTimeline 
            :steps="steps" 
            @add-progress="showAddModal = true" 
          />

        </div>

        <!-- Right Side: Photo updates & billing info (lg:col-span-4) -->
        <div class="lg:col-span-4 space-y-8">
          
          <!-- Photo updates card -->
          <FeaturesHistoryProgressPhotosCard 
            :photos="photos" 
            @open-gallery="showGalleryModal = true" 
          />

          <!-- Billing breakdown description card -->
          <FeaturesHistoryProgressBillingCard 
            :productPrice="billing.productPrice"
            :shippingFee="billing.shippingFee"
            :totalPrice="billing.totalPrice"
          />

        </div>

      </div>

    </div>

    <!-- Modals -->
    <FeaturesHistoryProgressAddModal
      :show="showAddModal"
      @close="showAddModal = false"
      @submit="handleAddProgress"
    />

    <FeaturesHistoryProgressGalleryModal
      :show="showGalleryModal"
      :photos="photos"
      @close="showGalleryModal = false"
    />
  </div>
</template>

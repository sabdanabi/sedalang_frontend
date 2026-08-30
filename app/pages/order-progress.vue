<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore, type Order } from '~/stores/orders'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()
const orderId = (route.query.id as string) || 'LMD95628654'

// Check if current user is craftsman
const isCraftsman = computed(() => authStore.user?.role === 'CRAFTSMAN')

// Onboarding validation & Fetching order detail
onMounted(async () => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    // Fetch order detail from backend
    if (orderId && orderId !== 'LMD95628654') {
      try {
        await ordersStore.fetchOrderById(orderId)
      } catch (err) {
        console.error('Failed to load order detail from backend:', err)
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
const summary = computed(() => {
  const activeOrder = ordersStore.activeOrder
  const priceVal = activeOrder?.proposal?.price || activeOrder?.totalAmount || 0
  const formattedPrice = 'Rp ' + Number(priceVal).toLocaleString('id-ID')

  return {
    name: activeOrder?.proposal?.productName || 'Detail Pesanan',
    artisan: activeOrder?.craftsman?.user?.fullName || 'Pengrajin',
    price: formattedPrice,
    materialDetail: activeOrder?.proposal?.materialsNeeded?.join(', ') || 'Material Limbah',
    shippingDetail: activeOrder?.proposal?.deliveryMethod === 'DROP_OFF' ? 'Ambil Sendiri (DROP_OFF)' : 'GOSEND',
    targetDate: activeOrder?.proposal?.estimatedCompletionDate
      ? new Date(activeOrder.proposal.estimatedCompletionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '-',
    image: '/images/default_images/default_img.webp'
  }
})

// Local override for steps if updated during current session
const localSteps = ref<TimelineStep[] | null>(null)

// Timeline Steps
const steps = computed<TimelineStep[]>({
  get() {
    if (localSteps.value) return localSteps.value

    const activeOrder = ordersStore.activeOrder
    
    // If there are no progressSteps from the server, we fallback to standard/localStorage steps
    if (!activeOrder || !activeOrder.progressSteps || activeOrder.progressSteps.length === 0) {
      if (import.meta.client) {
        const savedSteps = localStorage.getItem(`sedalang_timeline_steps_${orderId}`)
        if (savedSteps) {
          try {
            return JSON.parse(savedSteps)
          } catch (e) {
            console.error('Failed to parse timeline steps', e)
          }
        }
      }

      // Default mock timeline steps
      return [
        {
          id: 1,
          title: 'Material Diterima',
          description: 'Bahan sudah kami terima dan sudah kami verifikasi kondisinya.',
          date: activeOrder ? new Date(activeOrder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '12 Okt',
          status: 'completed'
        },
        {
          id: 2,
          title: 'Proses Awal',
          description: 'Bahan sedang dibersihkan dan label botol sudah dilepas seluruhnya.',
          date: activeOrder ? new Date(activeOrder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '13 Okt',
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
      ]
    }

    // Map backend progressSteps dynamically
    return activeOrder.progressSteps.map((step, idx) => {
      const isLast = idx === activeOrder.progressSteps!.length - 1
      return {
        id: idx + 1,
        title: step.title,
        description: step.description,
        date: new Date(step.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        status: isLast ? 'in_progress' : 'completed'
      } as TimelineStep
    })
  },
  set(val) {
    localSteps.value = val
  }
})

// Photos Gallery
const photos = computed<string[]>(() => {
  const activeOrder = ordersStore.activeOrder
  if (activeOrder?.progressSteps) {
    const urls = activeOrder.progressSteps
      .flatMap(s => s.mediaUrls || [])
      .filter(Boolean)
    if (urls.length > 0) return urls
  }
  return ['/images/default_images/default_img.webp']
})

// Billing Breakdown
const billing = computed(() => {
  const activeOrder = ordersStore.activeOrder
  const priceVal = activeOrder?.proposal?.price || activeOrder?.totalAmount || 0

  return {
    productPrice: 'Rp ' + Number(priceVal).toLocaleString('id-ID'),
    shippingFee: activeOrder?.proposal?.deliveryMethod === 'DROP_OFF' ? 'Rp 0' : 'Rp 15.000',
    totalPrice: 'Rp ' + Number(activeOrder?.totalAmount || priceVal).toLocaleString('id-ID')
  }
})

// Modals State
const showAddModal = ref(false)
const showGalleryModal = ref(false)

const handleAddProgress = async (formData: { title: string; description: string; status: string; imageFile: File | null }) => {
  showAddModal.value = false

  // Upload progress image to backend if provided
  if (formData.imageFile && orderId && orderId !== 'LMD95628654') {
    try {
      await ordersStore.uploadOrderMedia(orderId, formData.imageFile)
    } catch (err: any) {
      alert('Gagal mengunggah foto progres ke server: ' + (err.message || err))
    }
  }

  // Save order status
  if (import.meta.client) {
    localStorage.setItem(`sedalang_order_status_${orderId}`, formData.status)
  }

  // Create mutable copy of steps to modify
  const stepsCopy = [...steps.value]

  // Find index of currently 'in_progress' step
  const inProgressIndex = stepsCopy.findIndex(s => s.status === 'in_progress')
  
  if (inProgressIndex !== -1) {
    // Complete the previous active step
    stepsCopy[inProgressIndex].status = 'completed'
    stepsCopy[inProgressIndex].date = new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`
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
  const firstPendingIndex = stepsCopy.findIndex(s => s.status === 'pending')
  if (firstPendingIndex !== -1) {
    stepsCopy.splice(firstPendingIndex, 0, newStep)
  } else {
    stepsCopy.push(newStep)
  }

  // Update steps computed property (triggers localSteps ref)
  steps.value = stepsCopy

  // Persist timeline steps
  if (import.meta.client) {
    localStorage.setItem(`sedalang_timeline_steps_${orderId}`, JSON.stringify(stepsCopy))
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
            :show-add-button="isCraftsman"
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

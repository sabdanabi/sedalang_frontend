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
        // Sync payment status with Midtrans first
        await ordersStore.checkOrderPayment(orderId)
      } catch (err) {
        console.error('Failed to sync payment status with Midtrans:', err)
      }
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
  const priceVal = activeOrder?.price || activeOrder?.proposal?.price || activeOrder?.totalAmount || 0
  const formattedPrice = 'Rp ' + Number(priceVal).toLocaleString('id-ID')
  const deliveryMethod = activeOrder?.deliveryMethod || activeOrder?.proposal?.deliveryMethod
  const materials = activeOrder?.materialsNeeded || activeOrder?.proposal?.materialsNeeded
  const estDate = activeOrder?.estimatedCompletionDate || activeOrder?.proposal?.estimatedCompletionDate

  return {
    name: activeOrder?.productName || activeOrder?.proposal?.productName || 'Detail Pesanan',
    artisan: activeOrder?.craftsman?.user?.fullName || 'Pengrajin',
    price: formattedPrice,
    materialDetail: materials?.join(', ') || 'Material Limbah',
    shippingDetail: deliveryMethod === 'DROP_OFF' ? 'Ambil Sendiri (DROP_OFF)' : 'GOSEND',
    targetDate: estDate
      ? new Date(estDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
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
    const orderStatus = activeOrder?.status || 'PENDING'
    const paymentDate = activeOrder?.paidAt || activeOrder?.createdAt

    // 1. Construct first step: Payment Step (System/Mock step)
    const paymentStep: TimelineStep = {
      id: 0,
      title: orderStatus === 'PENDING' ? 'Menunggu Pembayaran' : 'Pembayaran Berhasil Dilakukan',
      description: orderStatus === 'PENDING'
        ? 'Silakan selesaikan pembayaran untuk memulai pengerjaan.'
        : 'Pembayaran telah dikonfirmasi. Pesanan segera diproses oleh pengrajin.',
      date: orderStatus === 'PENDING'
        ? 'Menunggu'
        : paymentDate ? new Date(paymentDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '',
      status: orderStatus === 'PENDING' ? 'in_progress' : 'completed'
    }

    // 2. Map database progress steps
    const dbSteps = (activeOrder?.progressSteps || []).map((step, idx) => {
      return {
        id: idx + 1,
        title: step.title,
        description: step.description,
        createdAt: step.createdAt
      }
    })

    // Sort DB steps chronologically (oldest first)
    dbSteps.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    // Map to TimelineStep format
    const mappedDbSteps = dbSteps.map((step, idx) => {
      const isLast = idx === dbSteps.length - 1
      let status: 'completed' | 'in_progress' | 'pending' = 'completed'

      if (isLast) {
        if (orderStatus === 'COMPLETED') {
          status = 'completed'
        } else if (orderStatus === 'IN_PROGRESS') {
          status = 'in_progress'
        } else {
          status = 'completed'
        }
      }

      return {
        id: idx + 1,
        title: step.title,
        description: step.description,
        date: new Date(step.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status
      } as TimelineStep
    })

    return [paymentStep, ...mappedDbSteps]
  },
  set(val) {
    localSteps.value = val
  }
})

// Photos Gallery
const photos = computed<string[]>(() => {
  const activeOrder = ordersStore.activeOrder

  // 0. Primary: check progressImages from backend
  if (activeOrder?.progressImages && activeOrder.progressImages.length > 0) {
    return activeOrder.progressImages
  }

  // 1. Gathers media from progressSteps
  if (activeOrder?.progressSteps) {
    const urls = activeOrder.progressSteps
      .flatMap(s => s.mediaUrls || [])
      .filter(Boolean)
    if (urls.length > 0) return urls
  }

  // 2. Fallback to direct media properties on the order object if present
  const rawOrder = activeOrder as any
  if (rawOrder?.mediaUrls && Array.isArray(rawOrder.mediaUrls)) {
    const urls = rawOrder.mediaUrls.filter(Boolean)
    if (urls.length > 0) return urls
  }

  if (rawOrder?.media && Array.isArray(rawOrder.media)) {
    const urls = rawOrder.media.filter(Boolean)
    if (urls.length > 0) return urls
  }

  return ['/images/default_images/default_img.webp']
})

// Billing Breakdown
const billing = computed(() => {
  const activeOrder = ordersStore.activeOrder
  const priceVal = activeOrder?.price || activeOrder?.proposal?.price || activeOrder?.totalAmount || 0
  const deliveryMethod = activeOrder?.deliveryMethod || activeOrder?.proposal?.deliveryMethod

  return {
    productPrice: 'Rp ' + Number(priceVal).toLocaleString('id-ID'),
    shippingFee: deliveryMethod === 'DROP_OFF' ? 'Rp 0' : 'Rp 15.000',
    totalPrice: 'Rp ' + Number(activeOrder?.totalAmount || priceVal).toLocaleString('id-ID')
  }
})

// Modals State
const showAddModal = ref(false)
const showGalleryModal = ref(false)

const handleAddProgress = async (formData: { title: string; description: string; status: string; imageFile: File | null }) => {
  showAddModal.value = false

  if (orderId && orderId !== 'LMD95628654') {
    try {
      // 1. Upload progress image if provided
      if (formData.imageFile) {
        await ordersStore.uploadOrderMedia(orderId, formData.imageFile)
      }

      // 2. Map status selection to backend OrderStatus
      const statusMap: Record<string, string> = {
        'Pending': 'PENDING',
        'Paid': 'PAID',
        'In Progress': 'IN_PROGRESS',
        'Complete': 'COMPLETED'
      }
      const backendStatus = statusMap[formData.status]

      // 3. Add progress step to backend
      await ordersStore.addOrderProgress(orderId, formData.title, formData.description, backendStatus)

      // 4. Force reload order details from backend to ensure consistent state
      await ordersStore.fetchOrderById(orderId)

      // Clear localSteps override
      localSteps.value = null
    } catch (err: any) {
      alert('Gagal menyimpan progres ke server: ' + (err.data?.message || err.message || err))
    }
    return
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

const isPaying = ref(false)
const handlePayment = async () => {
  const activeOrder = ordersStore.activeOrder
  if (!activeOrder) return
  isPaying.value = true
  try {
    // 1. If midtransRedirectUrl exists, redirect immediately
    if (activeOrder.midtransRedirectUrl) {
      window.location.href = activeOrder.midtransRedirectUrl
      return
    }

    // 2. Otherwise retry/regenerate payment link
    if (activeOrder.proposal?.id) {
      const data = await ordersStore.retryOrderPayment(activeOrder.proposal.id)
      if (data && data.midtransRedirectUrl) {
        window.location.href = data.midtransRedirectUrl
      } else {
        alert('Gagal mendapatkan link pembayaran baru.')
      }
    } else {
      alert('Informasi proposal tidak ditemukan.')
    }
  } catch (err: any) {
    alert('Gagal memproses pembayaran: ' + (err.data?.message || err.message || err))
  } finally {
    isPaying.value = false
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

          <!-- Payment Action for Buyer -->
          <div v-if="!isCraftsman && ordersStore.activeOrder?.status === 'PENDING'" class="bg-[#FDF8F5] border border-[#F2DEC9] rounded-[32px] p-6 space-y-4 text-left">
            <div>
              <h5 class="font-poppins text-sm font-bold text-gray-900 leading-none">
                Selesaikan Pembayaran
              </h5>
              <p class="font-inter text-[10px] text-gray-500 font-semibold mt-1">
                Lakukan pembayaran agar pesanan segera diproses
              </p>
            </div>
            <button
              @click="handlePayment"
              :disabled="isPaying"
              class="w-full py-3 px-6 bg-[#7A4D30] hover:bg-[#5C3A24] text-white font-poppins font-bold text-sm rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span v-if="isPaying">Memproses...</span>
              <span v-else>Bayar Sekarang</span>
            </button>
          </div>

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

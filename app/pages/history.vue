<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// Validate onboarding complete status
onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
    }
  }
})

// Interfaces
interface Order {
  id: string
  date: string
  status: string
  productName: string
  artisan: string
  material: string
  shipping: string
  price: string
  totalItem: string
  totalPrice: string
  payment: string
  image: string
}

// Mock order history data matching mockup design screenshot
const orders = ref<Order[]>([
  {
    id: 'TPK94745186',
    date: '24 Agustus 2026, 10.28',
    status: 'Selesai',
    productName: 'Tempat Pensil Kemasan Kaleng',
    artisan: 'KaryaLoka Craft',
    material: 'Material : Kemasan Kaleng (7 item)',
    shipping: 'Pengiriman : GoSend dari pengrajin',
    price: 'Rp 5.000',
    totalItem: 'Total 7 item',
    totalPrice: 'Rp 35.000',
    payment: 'OVO',
    image: '/images/default_images/default_img.webp'
  },
  {
    id: 'LMD95628654',
    date: '21 Agustus 2026, 17.01',
    status: 'Selesai',
    productName: 'Lampu Meja Dekorasi',
    artisan: 'KaryaLoka Craft',
    material: 'Material : Kemasan botol (12 item)',
    shipping: 'Pengiriman : GoSend dari pengrajin',
    price: 'Rp 12.000',
    totalItem: 'Total 12 item',
    totalPrice: 'Rp 144.000',
    payment: 'BCA',
    image: '/images/default_images/default_img.webp'
  },
  {
    id: 'TBD84174520',
    date: '19 Agustus 2026, 22.33',
    status: 'Selesai',
    productName: 'Tote Bag Denim',
    artisan: 'KaryaLoka Craft',
    material: 'Material : Celana denim (9 item)',
    shipping: 'Pengiriman : GoSend dari pengrajin',
    price: 'Rp 35.500',
    totalItem: 'Total 9 item',
    totalPrice: 'Rp 315.000',
    payment: 'DANA',
    image: '/images/default_images/default_img.webp'
  }
])

const selectedOrder = ref<Order | null>(null)
const showDetailModal = ref(false)

const openDetailModal = (order: Order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

const handleReorder = (order: Order) => {
  alert(`Pesanan #${order.id} (${order.productName}) berhasil dipesan kembali!`)
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-white py-10">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20">
      
      <!-- Header Section -->
      <header class="mb-10 text-left">
        <h1 class="font-poppins text-3xl md:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
          Riwayat Pesanan
        </h1>
        <p class="font-inter text-sm md:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Lihat semua pesanan anda
        </p>
      </header>

      <!-- Order History List -->
      <section class="mt-8 border-t border-[#DEDEDE] divide-y divide-[#DEDEDE]">
        <FeaturesHistoryOrderCard
          v-for="order in orders"
          :key="order.id"
          :order="order"
          @select-detail="openDetailModal"
          @reorder="handleReorder"
        />
      </section>

    </div>

    <!-- Order Detail modal -->
    <FeaturesHistoryDetailModal
      :show="showDetailModal"
      :order="selectedOrder"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrdersStore } from '~/stores/orders'
import type { Order } from '~/stores/orders'

definePageMeta({
  layout: 'dashboard'
})

const ordersStore = useOrdersStore()

onMounted(async () => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    await ordersStore.fetchOrders()
  }
})

const openDetailModal = (order: Order) => {
  navigateTo(`/order-progress?id=${order.id}`)
}

const handleReorder = (order: Order) => {
  // Navigate to chat with the craftsman to initiate a new order
  if (order.craftsman?.id) {
    navigateTo(`/chat?craftsmanId=${order.craftsman.id}`)
  } else {
    navigateTo('/search-craftsman')
  }
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

      <!-- Loading State -->
      <div v-if="ordersStore.isLoading" class="space-y-8 mt-8 border-t border-[#DEDEDE] pt-8">
        <div
          v-for="i in 3"
          :key="i"
          class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-pulse pb-8 border-b border-[#DEDEDE]"
        >
          <!-- Left: Image + texts -->
          <div class="lg:col-span-6 flex gap-5 items-start">
            <div class="w-44 h-32 rounded-2xl bg-gray-100 flex-shrink-0"></div>
            <div class="flex-1 space-y-3 pt-2">
              <div class="h-4 bg-gray-100 rounded w-2/3"></div>
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
              <div class="h-3 bg-gray-100 rounded w-3/4"></div>
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
          <!-- Center: Pricing -->
          <div class="lg:col-span-3 space-y-3">
            <div class="h-4 bg-gray-100 rounded w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
            <div class="h-3 bg-gray-100 rounded w-2/3"></div>
          </div>
          <!-- Right: Buttons -->
          <div class="lg:col-span-3 space-y-3 w-36 ml-auto">
            <div class="h-8 bg-gray-100 rounded-full"></div>
            <div class="h-8 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="ordersStore.error" class="mt-16 text-center py-20 border border-dashed border-red-200 rounded-[32px] bg-red-50/30">
        <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h4 class="font-poppins text-base font-bold text-gray-950">Gagal Memuat Riwayat</h4>
        <p class="font-inter text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
          {{ ordersStore.error }}
        </p>
        <button
          @click="ordersStore.fetchOrders()"
          type="button"
          class="mt-6 bg-[#7A4D30] hover:bg-[#683f26] text-white text-sm font-bold font-inter py-3 px-6 rounded-full transition-all duration-300 cursor-pointer active:scale-95"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="ordersStore.orders.length === 0" class="mt-16 text-center py-20 border border-dashed border-gray-200 rounded-[32px] bg-[#FAF8F5]/30">
        <div class="w-12 h-12 rounded-full bg-[#7A4D30]/5 flex items-center justify-center text-[#7A4D30] mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h4 class="font-poppins text-base font-bold text-gray-950">Belum Ada Pesanan</h4>
        <p class="font-inter text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
          Anda belum memiliki riwayat pesanan. Mulai dengan memilih pengrajin dan buat pesanan pertama Anda.
        </p>
        <NuxtLink
          to="/search-craftsman"
          class="mt-6 inline-flex items-center gap-2 bg-[#7A4D30] hover:bg-[#683f26] text-white text-sm font-bold font-inter py-3 px-6 rounded-full transition-all duration-300 cursor-pointer active:scale-95"
        >
          Cari Pengrajin
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Order History List -->
      <section v-else class="mt-8 border-t border-[#DEDEDE] divide-y divide-[#DEDEDE]">
        <FeaturesHistoryOrderCard
          v-for="order in ordersStore.orders"
          :key="order.id"
          :order="order"
          @select-detail="openDetailModal"
          @reorder="handleReorder"
        />
      </section>

    </div>
  </div>
</template>

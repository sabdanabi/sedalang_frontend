<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '~/stores/orders'
import { getAvatarUrl } from '~/composables/useAvatar'

const props = defineProps<{
  order: Order
}>()

defineEmits<{
  (e: 'select-detail', order: Order): void
  (e: 'reorder', order: Order): void
}>()

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (amount: number) => {
  return `Rp ${Number(amount).toLocaleString('id-ID')}`
}

const artisanName = computed(() => props.order.craftsman?.user?.fullName || 'Pengrajin')
const artisanAvatar = computed(() => getAvatarUrl(props.order.craftsman?.user?.avatarUrl, artisanName.value))
const productName = computed(() => props.order.proposal?.productName || 'Produk Daur Ulang')
const productImage = computed(() => '/images/default_images/default_img.webp')
const materials = computed(() => {
  const mats = props.order.proposal?.materialsNeeded || []
  return mats.length > 0 ? `Material: ${mats.join(', ')}` : 'Material: -'
})
const shipping = computed(() => {
  const method = props.order.proposal?.deliveryMethod
  if (method === 'GOSEND') return 'Pengiriman: GoSend dari pengrajin'
  if (method === 'DROP_OFF') return 'Pengiriman: Ambil Sendiri'
  return `Pengiriman: ${method || '-'}`
})
const price = computed(() => formatPrice(props.order.proposal?.price || 0))
const totalPrice = computed(() => formatPrice(props.order.totalAmount || 0))
const paymentMethod = computed(() => props.order.paymentMethod || props.order.proposal?.paymentMethod || '-')

// Status badge config
const statusConfig = computed(() => {
  const s = (props.order.status || '').toUpperCase()
  if (s === 'COMPLETED') {
    return { bg: 'bg-[#EAF8F2] text-[#0F9F68]', label: 'Selesai', showCheck: true }
  } else if (s === 'IN_PROGRESS') {
    return { bg: 'bg-[#FEF9C3] text-[#A16207]', label: 'Dalam Proses', showCheck: false }
  } else if (s === 'PAID') {
    return { bg: 'bg-[#EFF6FF] text-[#1D4ED8]', label: 'Lunas', showCheck: false }
  } else if (s === 'PENDING_PAYMENT') {
    return { bg: 'bg-[#FFF7ED] text-[#C2410C]', label: 'Menunggu Pembayaran', showCheck: false }
  } else if (s === 'CANCELLED') {
    return { bg: 'bg-[#FEF2F2] text-[#B91C1C]', label: 'Dibatalkan', showCheck: false }
  } else {
    return { bg: 'bg-[#F3F4F6] text-[#4B5563]', label: props.order.status || '-', showCheck: false }
  }
})
</script>

<template>
  <div class="py-8 bg-white text-left">
    
    <!-- Top Row: Order ID, Date, and Status Badge -->
    <div class="flex items-center justify-between gap-3 mb-5">
      <div class="space-y-1">
        <h4 class="font-poppins text-lg font-bold text-gray-950">
          Pesanan #{{ order.id.slice(0, 8).toUpperCase() }}
        </h4>
        <p class="font-inter text-xs text-gray-400">
          Tanggal Pesan : {{ formatDate(order.createdAt) }}
        </p>
      </div>

      <!-- Status Badge -->
      <div 
        class="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold font-inter select-none"
        :class="statusConfig.bg"
      >
        <svg 
          v-if="statusConfig.showCheck"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="2.5" 
          stroke="currentColor" 
          class="w-3.5 h-3.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        {{ statusConfig.label }}
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      <!-- Left Segment: Image and Core Details -->
      <div class="lg:col-span-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <!-- Product Thumbnail image -->
        <div class="w-full sm:w-44 h-32 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          <img
            :src="productImage"
            alt="Product Image"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Detail Texts -->
        <div class="space-y-1">
          <h5 class="font-poppins text-xl font-bold text-gray-950 leading-snug">
            {{ productName }}
          </h5>
          <p class="font-inter text-sm text-gray-500 font-medium">
            Pengrajin : <span class="text-gray-900 font-bold">{{ artisanName }}</span>
          </p>
          
          <div class="space-y-1.5 pt-2">
            <!-- Material detail row -->
            <div class="flex items-center gap-2 text-gray-500 font-inter text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              {{ materials }}
            </div>
            <!-- Shipping detail row -->
            <div class="flex items-center gap-2 text-gray-500 font-inter text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400 flex-shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25M3 14.25h15v-3m-15 3h1.125c.621 0 1.129-.504 1.129-1.125V11.25M3 14.25V9.625c0-.621.504-1.125 1.125-1.125h10.5c.621 0 1.125.504 1.125 1.125v1.625m0-1.625h1.625c.621 0 1.125.504 1.125 1.125v3.375M2.25 6h15" />
              </svg>
              {{ shipping }}
            </div>
          </div>
        </div>
      </div>

      <!-- Center Segment: Pricing Details -->
      <div class="lg:col-span-3 lg:border-l lg:border-[#DEDEDE] lg:pl-8 space-y-1.5 py-1">
        <h5 class="font-poppins text-xl font-bold text-gray-950 leading-none">
          Rincian Harga
        </h5>
        <div class="space-y-1.5 pt-1.5 font-inter text-sm text-gray-400">
          <p>Harga Produk : {{ price }}</p>
          <p>Total Pesanan : <span class="text-gray-900 font-semibold">{{ totalPrice }}</span></p>
        </div>
        <p class="font-inter text-sm text-[#7A4D30] font-bold pt-1.5 leading-snug">
          Dibayar menggunakan : {{ paymentMethod }}
        </p>
      </div>

      <!-- Right Segment: Action buttons -->
      <div class="lg:col-span-3 flex flex-col gap-2.5 lg:justify-self-end ml-auto w-full lg:w-36">
        <!-- Lihat Detail Button -->
        <button
          type="button"
          @click="$emit('select-detail', order)"
          class="w-full border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 py-1.5 rounded-full text-[11px] font-bold font-inter transition-all duration-350 flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
        >
          Lihat Detail
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>

        <!-- Pesan Lagi Button -->
        <button
          type="button"
          @click="$emit('reorder', order)"
          class="w-full bg-[#7A4D30] hover:bg-[#683E25] text-white py-1.5 rounded-full text-[11px] font-bold font-inter shadow-sm hover:shadow transition-all duration-350 flex items-center justify-center gap-1 cursor-pointer focus:outline-none"
        >
          Pesan Lagi
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>
      </div>

    </div>

  </div>
</template>

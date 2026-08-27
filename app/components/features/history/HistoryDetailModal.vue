<script setup lang="ts">
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

defineProps<{
  show: boolean
  order: Order | null
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="show && order" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="scale">
        <div class="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] text-left">
          
          <!-- Close Button -->
          <button 
            @click="$emit('close')"
            class="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white border border-gray-150 hover:border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4.5 h-4.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="border-b border-gray-100 pb-5 mb-6">
            <span class="text-[10px] uppercase font-bold font-inter tracking-widest text-[#7A4D30] bg-[#7A4D30]/5 px-2.5 py-1 rounded">
              Rincian Pesanan
            </span>
            <h3 class="font-poppins text-xl md:text-2xl font-bold text-gray-950 mt-3">
              Pesanan #{{ order.id }}
            </h3>
            <p class="font-inter text-xs text-gray-400 mt-1">
              Dipesan pada tanggal {{ order.date }}
            </p>
          </div>

          <!-- Product & Details Segment -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-gray-100 pb-6 mb-6">
            <!-- Thumbnail -->
            <div class="md:col-span-4 w-full h-32 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm flex-shrink-0">
              <img
                :src="order.image || '/images/default_images/default_img.webp'"
                alt="Product thumbnail"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Text specifications -->
            <div class="md:col-span-8 space-y-3">
              <div>
                <h4 class="font-poppins text-lg font-bold text-gray-950 leading-snug">
                  {{ order.productName }}
                </h4>
                <p class="font-inter text-xs text-gray-500 font-bold mt-1">
                  Pengrajin: <span class="text-[#7A4D30]">{{ order.artisan }}</span>
                </p>
              </div>

              <!-- Attributes -->
              <div class="grid grid-cols-2 gap-4 pt-1">
                <div class="space-y-0.5">
                  <span class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-inter">Material</span>
                  <p class="font-inter text-xs text-gray-700 font-semibold">{{ order.material.split(': ')[1] || order.material }}</p>
                </div>
                <div class="space-y-0.5">
                  <span class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-inter">Pengiriman</span>
                  <p class="font-inter text-xs text-gray-700 font-semibold">{{ order.shipping.split(': ')[1] || order.shipping }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Price & Payment breakdown -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-6 mb-6">
            <!-- Price breakdown list -->
            <div class="space-y-3">
              <h5 class="font-poppins text-sm font-bold text-gray-900">Breakdown Harga</h5>
              <div class="space-y-2 text-xs font-inter text-gray-500">
                <div class="flex justify-between">
                  <span>Harga Satuan</span>
                  <span class="text-gray-800 font-medium">{{ order.price }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Jumlah Barang</span>
                  <span class="text-gray-800 font-medium">{{ order.totalItem.split(' ')[1] }} unit</span>
                </div>
                <div class="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900 text-sm">
                  <span>Total Biaya</span>
                  <span class="text-[#7A4D30]">{{ order.totalPrice }}</span>
                </div>
              </div>
            </div>

            <!-- Payment details -->
            <div class="space-y-3">
              <h5 class="font-poppins text-sm font-bold text-gray-900">Metode Pembayaran</h5>
              <div class="space-y-1.5 font-inter text-xs">
                <p class="text-gray-500">Dibayar lunas menggunakan:</p>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-gray-800 text-sm">{{ order.payment }}</span>
                  <span class="px-2 py-0.5 rounded bg-green-50 text-green-600 font-bold text-[9px] border border-green-200/50">LUNAS</span>
                </div>
                <p class="text-[10px] text-gray-400 mt-1">Ref ID: TXN{{ order.id }}8493</p>
              </div>
            </div>
          </div>

          <!-- Order Status Timeline Progress -->
          <div class="space-y-4">
            <h5 class="font-poppins text-sm font-bold text-gray-900">Status Pengiriman</h5>
            
            <div class="relative pl-6 border-l border-gray-150 space-y-6">
              <!-- Step 4 -->
              <div class="relative">
                <span class="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-green-100 flex items-center justify-center"></span>
                <div class="text-left">
                  <p class="font-inter text-xs font-bold text-gray-900">Pesanan Diterima</p>
                  <p class="font-inter text-[10px] text-gray-400 mt-0.5">Selesai • {{ order.date }}</p>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="relative">
                <span class="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-green-100 flex items-center justify-center"></span>
                <div class="text-left">
                  <p class="font-inter text-xs font-bold text-gray-900">Sedang Dikirim</p>
                  <p class="font-inter text-[10px] text-gray-400 mt-0.5">Kurir GoSend dalam perjalanan menuju alamat pembeli</p>
                </div>
              </div>

              <!-- Step 2 -->
              <div class="relative">
                <span class="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-green-100 flex items-center justify-center"></span>
                <div class="text-left">
                  <p class="font-inter text-xs font-bold text-gray-900">Pesanan Dikonfirmasi</p>
                  <p class="font-inter text-[10px] text-gray-400 mt-0.5">Pengrajin KaryaLoka Craft menyetujui pesanan</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>

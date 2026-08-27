<script setup lang="ts">
defineProps<{
  productPrice: string
  shippingFee: string
  totalPrice: string
}>()
</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left space-y-4">
    
    <!-- Header -->
    <div class="border-b border-gray-50 pb-3">
      <h4 class="font-poppins text-sm md:text-base font-bold text-gray-900 leading-none">
        Deskripsi Belanja
      </h4>
      <p class="font-inter text-[10px] text-gray-400 font-semibold mt-1">
        Periksa detail belanjaan anada
      </p>
    </div>

    <!-- Pricing lines -->
    <div class="space-y-3 font-inter text-xs text-gray-500">
      <div class="flex justify-between items-center">
        <span>Harga Produk</span>
        <span class="text-gray-900 font-bold">{{ productPrice }}</span>
      </div>
      
      <div class="flex justify-between items-center">
        <span>Ongkos Kirim</span>
        <span class="text-gray-900 font-bold">{{ shippingFee }}</span>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-100 pt-3 flex justify-between items-center font-bold text-sm text-gray-900">
        <span>Total Harga</span>
        <span class="text-[#7A4D30] font-extrabold">{{ totalPrice }}</span>
      </div>
    </div>

  </div>
</template>

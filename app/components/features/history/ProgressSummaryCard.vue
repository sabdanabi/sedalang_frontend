<script setup lang="ts">
interface OrderSummary {
  name: string
  artisan: string
  price: string
  materialDetail: string
  shippingDetail: string
  targetDate: string
  image: string
}

defineProps<{
  summary: OrderSummary
}>()
</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left space-y-6">
    
    <!-- Top Row: Avatar details and price tag -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <!-- Thumbnail -->
        <div class="w-20 h-20 rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          <img
            :src="summary.image || '/images/default_images/default_img.webp'"
            alt="Product image"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="space-y-1">
          <h3 class="font-poppins text-xl font-bold text-gray-950 leading-snug">
            {{ summary.name }}
          </h3>
          <p class="font-inter text-xs text-gray-500 font-medium">
            Crafted : <span class="text-[#7A4D30] font-bold">{{ summary.artisan }}</span>
          </p>
        </div>
      </div>

      <!-- Price details -->
      <div class="sm:text-right space-y-0.5">
        <div class="font-poppins text-xl font-bold text-gray-950">
          {{ summary.price }}
        </div>
        <p class="font-inter text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
          Paid via SeDaLang Secure
        </p>
      </div>
    </div>

    <!-- Attributes Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
      
      <!-- Material Spec -->
      <div class="flex items-center gap-3 p-4.5 rounded-[20px] bg-[#FAF3EE]/80 border border-[#FAF3EE] hover:border-[#7A4D30]/20 transition-colors">
        <div class="w-10 h-10 rounded-[12px] bg-[#7A4D30]/5 flex items-center justify-center text-[#7A4D30] flex-shrink-0">
          <img src="/images/icons/material_icon.svg" alt="Material" class="w-5 h-5" />
        </div>
        <div class="text-left space-y-0.5 min-w-0">
          <span class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-inter">Material</span>
          <p class="font-inter text-xs font-bold text-gray-800 truncate">{{ summary.materialDetail }}</p>
        </div>
      </div>

      <!-- Shipping Spec -->
      <div class="flex items-center gap-3 p-4.5 rounded-[20px] bg-[#FAF3EE]/80 border border-[#FAF3EE] hover:border-[#7A4D30]/20 transition-colors">
        <div class="w-10 h-10 rounded-[12px] bg-[#7A4D30]/5 flex items-center justify-center text-[#7A4D30] flex-shrink-0">
          <img src="/images/icons/pengiriman_icon.svg" alt="Shipping" class="w-5 h-5" />
        </div>
        <div class="text-left space-y-0.5 min-w-0">
          <span class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-inter">Pengiriman</span>
          <p class="font-inter text-xs font-bold text-gray-800 truncate">{{ summary.shippingDetail }}</p>
        </div>
      </div>

      <!-- Delivery Target Date -->
      <div class="flex items-center gap-3 p-4.5 rounded-[20px] bg-[#FAF3EE]/80 border border-[#FAF3EE] hover:border-[#7A4D30]/20 transition-colors">
        <div class="w-10 h-10 rounded-[12px] bg-[#7A4D30]/5 flex items-center justify-center text-[#7A4D30] flex-shrink-0">
          <img src="/images/icons/target_tanggal_icon.svg" alt="Target" class="w-5 h-5" />
        </div>
        <div class="text-left space-y-0.5 min-w-0">
          <span class="text-[10px] uppercase font-bold tracking-wider text-gray-400 font-inter">Target Tanggal</span>
          <p class="font-inter text-xs font-bold text-gray-800 truncate">{{ summary.targetDate }}</p>
        </div>
      </div>

    </div>

  </div>
</template>

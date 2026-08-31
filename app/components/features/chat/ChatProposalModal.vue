<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

// Form states
const productName = ref('')
const materialsNeeded = ref('')
const price = ref<number | ''>('')
const estimatedCompletionDate = ref('')
const paymentMethod = ref('')
const deliveryMethod = ref('')
const selectedBank = ref('')
const accountNumber = ref('')
const isSubmitting = ref(false)

const resetForm = () => {
  productName.value = ''
  materialsNeeded.value = ''
  price.value = ''
  estimatedCompletionDate.value = ''
  paymentMethod.value = ''
  deliveryMethod.value = ''
  selectedBank.value = ''
  accountNumber.value = ''
  isSubmitting.value = false
}

// Reset form and loading when modal is closed by parent
watch(() => props.show, (newVal) => {
  if (!newVal) resetForm()
})

const handleFormSubmit = () => {
  const priceTrimmed = String(price.value).trim()
  if (!productName.value.trim() || !materialsNeeded.value.trim() || !priceTrimmed || priceTrimmed === '0') {
    alert('Silakan lengkapi nama produk, material, dan harga.')
    return
  }

  // Keep isSubmitting = true until parent closes the modal (watch above will reset)
  isSubmitting.value = true

  emit('submit', {
    productName: productName.value.trim(),
    materialsNeeded: materialsNeeded.value,
    price: price.value,
    estimatedCompletionDate: estimatedCompletionDate.value,
    paymentMethod: paymentMethod.value,
    deliveryMethod: deliveryMethod.value
  })
}
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="scale">
        <div class="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] text-left">
          
          <!-- Close Button -->
          <button 
            @click="$emit('close')"
            class="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white border border-gray-150 hover:border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="mb-6">
            <div class="w-10 h-10 rounded-full bg-[#7A4D30]/10 text-[#7A4D30] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 class="font-poppins text-xl md:text-2xl font-bold text-gray-950">
              Buat Proposal
            </h3>
            <p class="font-inter text-xs md:text-sm text-gray-400 mt-1">
              Isi detail penawaran untuk pelanggan
            </p>
          </div>

          <!-- Form Area -->
          <form @submit.prevent="handleFormSubmit" class="space-y-4">
            
            <!-- Nama Produk -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Nama Produk <span class="text-red-500">*</span></label>
              <input
                v-model="productName"
                type="text"
                placeholder="Contoh: Kursi dari kayu palet"
                required
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
              />
            </div>

            <!-- Bahan Material -->
            <div class="flex flex-col gap-1.5">
              <label class="font-poppins text-xs font-bold text-gray-950">Bahan Material <span class="text-red-500">*</span></label>
              <input
                v-model="materialsNeeded"
                type="text"
                placeholder="Kayu palet, paku, cat kayu (pisahkan dengan koma)"
                required
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
              />
              <p class="font-inter text-[11px] text-gray-400">Pisahkan setiap material dengan koma</p>
            </div>

            <!-- Harga & Estimasi Selesai (Row) -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Harga -->
              <div class="flex flex-col gap-1.5">
                <label class="font-poppins text-xs font-bold text-gray-950">Harga (Rp) <span class="text-red-500">*</span></label>
                <input
                  v-model="price"
                  type="number"
                  min="0"
                  placeholder="500000"
                  required
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
                />
              </div>
              <!-- Estimasi Selesai -->
              <div class="flex flex-col gap-1.5">
                <label class="font-poppins text-xs font-bold text-gray-950">Estimasi Selesai</label>
                <input
                  v-model="estimatedCompletionDate"
                  type="date"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter cursor-pointer"
                />
              </div>
            </div>

            <!-- Metode Pembayaran & Pengiriman (Row) -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Metode Pembayaran -->
              <div class="flex flex-col gap-1.5">
                <label class="font-poppins text-xs font-bold text-gray-950">Metode Pembayaran</label>
                <select
                  v-model="paymentMethod"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Pilih metode</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="COD">Cash On Delivery (COD)</option>
                  <option value="Sirkula Pay">Sirkula Pay</option>
                </select>
              </div>
              <!-- Metode Pengiriman -->
              <div class="flex flex-col gap-1.5">
                <label class="font-poppins text-xs font-bold text-gray-950">Metode Pengiriman</label>
                <select
                  v-model="deliveryMethod"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Pilih pengiriman</option>
                  <option value="GOSEND">GOSEND (Kurir Lokal)</option>
                  <option value="Ambil Sendiri">Ambil Sendiri (DROP_OFF)</option>
                </select>
            </div>

            <!-- Bank & Nomor Rekening (Row) -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Pilihan Bank -->
              <div class="flex flex-col gap-1.5">
                <label class="font-poppins text-xs font-bold text-gray-950">Pilihan Bank (Formalitas)</label>
                <select
                  v-model="selectedBank"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Pilih Bank</option>
                  <option value="BCA">BCA</option>
                  <option value="Mandiri">Mandiri</option>
                  <option value="BIN">BIN</option>
                  <option value="BRI">BRI</option>
                </select>
              </div>
              <!-- Nomor Rekening -->
              <div class="flex flex-col gap-1.5">
                <label class="font-poppins text-xs font-bold text-gray-950">Nomor Rekening (Formalitas)</label>
                <input
                  v-model="accountNumber"
                  type="text"
                  placeholder="Contoh: 1234567890"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-3">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-[#7A4D30] hover:bg-[#683E25] disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-full text-sm font-bold font-inter transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none shadow-sm hover:shadow"
              >
                <!-- Spinner (visible when submitting) -->
                <svg
                  v-if="isSubmitting"
                  class="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <!-- Checkmark (visible when idle) -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {{ isSubmitting ? 'Mengirim...' : 'Konfirmasi Proposal' }}
              </button>
            </div>

          </form>

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
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.94);
  opacity: 0;
}
</style>

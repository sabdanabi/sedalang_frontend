<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    question: 'Apa itu platform SeDaLang?',
    answer: 'Sebuah platform yang menghubungkan pengguna dengan pengrajin lokal untuk menyulap bahan limbah menjadi produk kustom yang bernilai tinggi.',
    isOpen: true // First item open by default like the mockup design
  },
  {
    question: 'Bagaimana proses daur ulang berjalan?',
    answer: 'Pengguna mengunggah foto barang bekas, AI menganalisis bahan untuk memberikan ide daur ulang kreatif, lalu pengguna memilih ide tersebut untuk terhubung dengan pengrajin yang sesuai guna menyelesaikan desain dan pengiriman.',
    isOpen: false
  },
  {
    question: 'Bagaimana Sistem Pencocokan Cerdas menemukan pengrajin yang tepat?',
    answer: 'Sistem mencocokkan pengrajin berdasarkan lokasi terdekat, ulasan rating pelanggan, portofolio karya nyata, serta jenis bahan limbah yang mereka terima.',
    isOpen: false
  },
  {
    question: 'Apakah saya bisa mendiskusikan desain dan anggaran biaya dengan pengrajin?',
    answer: 'Ya! Anda dapat langsung berdiskusi dengan pengrajin di Ruang Diskusi untuk menyelaraskan konsep desain, jenis bahan, estimasi waktu, serta anggaran biaya sebelum menyetujui proposal resmi.',
    isOpen: false
  },
  {
    question: 'Bagaimana cara saya mengirimkan bahan bekas ke pengrajin?',
    answer: 'Anda dapat mengatur pengiriman bahan melalui layanan kurir logistik lokal (seperti GoSend/GrabExpress) atau mengantarkannya langsung ke bengkel kerja pengrajin sesuai kesepakatan.',
    isOpen: false
  }
])

const toggleItem = (index: number) => {
  items.value.forEach((item, idx) => {
    if (idx === index) {
      item.isOpen = !item.isOpen
    } else {
      item.isOpen = false // Single-open accordion behavior
    }
  })
}
</script>

<template>
  <section class="w-full bg-white py-20 md:py-28 select-none relative overflow-hidden">
    <div class="max-w-8xl mx-auto px-10 lg:px-11 relative z-10 flex flex-col items-center">
      
      <!-- Top Pill Tag -->
      <div class="border border-gray-900 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase inline-block mb-8 select-none bg-white shadow-sm font-inter">
        QnA
      </div>

      <!-- Main Headline -->
      <h2 class="font-poppins text-4xl md:text-5xl font-medium text-gray-950 text-center mb-16 tracking-tight leading-tight max-w-3xl">
        Jangan ragu untuk <span class="text-[#7A4D30]">bertanya apa saja</span>, kami di sini untuk <span class="text-[#7A4D30]">menjawab</span> pertanyaan Anda!
      </h2>

      <!-- Accordion Container -->
      <div class="w-full border-t border-gray-100 divide-y divide-gray-100 max-w-8xl">
        <div 
          v-for="(item, index) in items" 
          :key="item.question"
          class="w-full"
        >
          <!-- Accordion Header Button -->
          <button
            @click="toggleItem(index)"
            type="button"
            class="w-full flex items-center justify-between py-6 text-left focus:outline-none group cursor-pointer"
            :aria-expanded="item.isOpen"
          >
            <span 
              class="font-poppins text-lg md:text-xl font-semibold text-gray-950 transition-colors duration-200"
              :class="{ 'text-[#7A4D30]': item.isOpen, 'group-hover:text-[#7A4D30]': !item.isOpen }"
            >
              {{ item.question }}
            </span>
            
            <!-- Animated Plus to X Icon -->
            <div 
              class="relative w-6 h-6 flex items-center justify-center transition-transform duration-300 ease-in-out transform"
              :class="{ 'rotate-135': item.isOpen }"
            >
              <!-- Horizontal line -->
              <span 
                class="absolute h-[2px] w-4 bg-gray-500 rounded-full transition-colors duration-300"
                :class="{ 'bg-gray-950': item.isOpen, 'group-hover:bg-gray-950': !item.isOpen }"
              ></span>
              <!-- Vertical line -->
              <span 
                class="absolute w-[2px] h-4 bg-gray-500 rounded-full transition-colors duration-300"
                :class="{ 'bg-gray-950': item.isOpen, 'group-hover:bg-gray-950': !item.isOpen }"
              ></span>
            </div>
          </button>

          <!-- Accordion Content (Smooth height & fade transition) -->
          <div 
            class="grid transition-all duration-300 ease-in-out overflow-hidden"
            :class="item.isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pb-0'"
          >
            <div class="overflow-hidden">
              <p class="font-inter text-sm sm:text-base text-gray-400 leading-relaxed max-w-3xl">
                {{ item.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Rotate 135 degrees class utility */
.rotate-135 {
  transform: rotate(135deg);
}
</style>

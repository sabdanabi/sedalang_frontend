<script setup lang="ts">
// Banner illustration has custom character image and guide link
</script>

<template>
  <div class="bg-[#FAF8F5] border border-[#FAF8F5] rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
    
    <div class="flex flex-col sm:flex-row items-center gap-6">
      <!-- Illustration Avatar representing handyman / builder -->
      <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100/70">
        <img
          src="/images/onboarding_images/pengrajin_img.webp"
          alt="Pengrajin"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="space-y-1">
        <h4 class="font-poppins text-lg md:text-xl font-bold text-gray-950">
          Masih bingung untuk memilih pengrajin?
        </h4>
        <p class="font-inter text-xs md:text-sm text-gray-500 leading-relaxed max-w-xl">
          Baca panduan kami untuk menemukan pengrajin terbaik sesuai kriteria kebutuhan proyek anda lengkap dengan deskripsi dan foto hasil pekerjaan karyanya!
        </p>
      </div>
    </div>

    <!-- Right: Guide button -->
    <button
      type="button"
      class="border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2.5 px-6 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none flex-shrink-0"
    >
      Lihat Panduan
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
      </svg>
    </button>

  </div>
</template>

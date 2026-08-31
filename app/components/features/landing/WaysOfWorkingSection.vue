<script setup lang="ts">
const steps = [
  {
    image: '/images/landing_page_images/ai_page_img.webp',
    alt: 'Ilustrasi Halaman AI',
    title: 'Halaman AI',
    description: 'Pengguna mengunggah foto barang bekas, lalu AI menganalisis jenis bahan dan memberikan ide daur ulang kreatif beserta visualisasi produk baru.'
  },
  {
    image: '/images/landing_page_images/discussion_room_img.webp',
    alt: 'Ilustrasi Ruang Diskusi',
    title: 'Ruang Diskusi',
    description: 'Pengguna dan pengrajin dapat berdiskusi secara langsung mengenai detail desain, negosiasi harga, metode pengiriman, hingga pengajuan proposal kesepakatan.'
  },
  {
    image: '/images/landing_page_images/tracking_progres_img.webp',
    alt: 'Ilustrasi Lacak Progres',
    title: 'Lacak Progres',
    description: 'Pengguna dapat memantau setiap tahapan pengerjaan secara real-time. Pengrajin mengupdate status pengerjaan disertai dengan unggahan foto progres fisik.'
  },
  {
    image: '/images/landing_page_images/looking_for_a_craftsman_img.png',
    alt: 'Ilustrasi Cari Pengrajin',
    title: 'Cari Pengrajin',
    description: 'Pengguna dapat mencari pengrajin secara mandiri berdasarkan lokasi terdekat, portofolio karya, tingkat rating penilaian, serta bahan daur ulang yang diterima.'
  }
]
</script>

<template>
  <section class="w-full bg-white py-20 md:py-28 select-none relative overflow-hidden">
    <div class="max-w-8xl mx-auto px-10 lg:px-11 flex flex-col items-center relative z-10">
      
      <!-- Top Pill Tag -->
      <div class="border border-gray-900 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase inline-block mb-6 select-none bg-white shadow-sm font-inter">
        cara kerja
      </div>

      <!-- Main Headline -->
      <h2 class="font-poppins text-4xl md:text-5xl font-medium text-gray-950 text-center mb-4 tracking-tight leading-tight">
        Ubah Barang Bekas Menjadi Lebih Berharga.
      </h2>

      <!-- Subtitle -->
      <p class="font-inter text-base md:text-lg text-gray-400 text-center max-w-4xl mb-16 leading-relaxed">
        Ikuti langkah-langkah mudah berikut untuk menyulap barang bekas menjadi kreasi berharga secara berkelanjutan.
      </p>

      <!-- Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        <div 
          v-for="step in steps" 
          :key="step.title"
          class="flex flex-col items-center bg-white border border-gray-100 hover:border-gray-200 rounded-[20px] p-6 lg:p-8 hover:shadow-lg transition-all duration-300 group cursor-default"
        >
          <!-- Illustration Container (Fixed height to keep cards aligned) -->
          <div class="h-40 flex items-center justify-center mb-8 w-full select-none pointer-events-none group-hover:scale-[1.03] transition-transform duration-300">
            <img 
              :src="step.image" 
              :alt="step.alt" 
              class="max-h-full max-w-[85%] object-contain"
            />
          </div>

          <!-- Step Title -->
          <h3 class="text-[#7A4D30] font-poppins font-bold text-lg lg:text-xl text-center mb-4 transition-colors duration-200 group-hover:text-[#6A3F25]">
            {{ step.title }}
          </h3>

          <!-- Step Description -->
          <p class="font-inter text-sm lg:text-[15px] leading-relaxed text-gray-500 text-center">
            {{ step.description }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

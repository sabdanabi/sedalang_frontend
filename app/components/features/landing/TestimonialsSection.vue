<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAvatarUrl } from '~/composables/useAvatar'

const currentPage = ref(1)
const totalPages = 3

// Dummy testimonials data variations for the 3 pages (cycling using modulo)
const testimonialsData = [
  // Page 1
  [
    { type: 'date', header: '20 - 02 - 2026', text: 'Sangat membantu mengelola limbah kayu dari gudang kami. Sekarang semua sisa palet kayu sudah berubah menjadi produk bernilai jual tinggi bersama pengrajin SeDaLang.', name: 'Budi Santoso', role: 'Pemilik Toko Mebel' },
    { type: 'title', header: 'Karya Mandiri', text: 'Sistem pencocokan AI di SeDaLang sangat akurat. Kami berhasil menemukan pengrajin logam yang terampil mendaur ulang sisa besi potongan kami menjadi stan pajangan toko.', name: 'Fajar Pratama', role: 'Manajer Operasional' },
    { type: 'date', header: '15 - 02 - 2026', text: 'Website ini sangat inovatif! Kami bisa berkonsultasi langsung dengan pengrajin di Ruang Diskusi untuk merancang kerajinan kulit dari sisa bahan produksi kami.', name: 'Larasati Putri', role: 'Perancang Busana' },
    { type: 'title', header: 'CV. Indo Cipta', text: 'Escrow dan pelacakan progres di SeDaLang memberikan rasa aman yang luar biasa. Sangat transparan mulai dari pengiriman material hingga produk jadi tiba.', name: 'Dian Wijaya', role: 'Direktur Keuangan' },
    { type: 'title', header: 'Sinar Terang', text: 'Program CSR perusahaan kami menjadi jauh lebih bermakna. Kami berhasil menyalurkan sisa kertas kantor untuk didaur ulang menjadi kotak kemasan premium.', name: 'Agung Nugroho', role: 'Koordinator CSR' },
    { type: 'date', header: '12 - 02 - 2026', text: 'Sangat puas dengan vas bunga dari botol kaca bekas yang dikerjakan oleh mitra pengrajin SeDaLang. Kualitas kap lampu rapi dan pengemasan GoSend sangat aman.', name: 'Citra Lestari', role: 'Ibu Rumah Tangga' }
  ],
  // Page 2
  [
    { type: 'title', header: 'CV. Eco Green', text: 'SeDaLang membuka pasar baru bagi UMKM kreatif seperti kami. Melalui platform ini, pasokan limbah berkualitas dari para mitra selalu stabil dan terverifikasi.', name: 'Hendra Setiawan', role: 'Pengrajin Kayu' },
    { type: 'date', header: '05 - 03 - 2026', text: 'Ide-ide kreasi daur ulang dari AI SeDaLang sangat kreatif dan out-of-the-box. Sangat membantu kami yang awalnya bingung ingin mengolah limbah botol plastik.', name: 'Dewi Sartika', role: 'Pegiat Lingkungan' },
    { type: 'date', header: '08 - 03 - 2026', text: 'Menyulap limbah ban bekas menjadi kursi taman cantik kini sangat mudah. Pengrajin lokal Semarang di SeDaLang benar-benar terampil dan profesional.', name: 'Rian Hidayat', role: 'Pemilik Kafe' },
    { type: 'title', header: 'PT. Logam Jaya', text: 'Kami mendonasikan sisa kuningan kami dan ditukar dengan produk kerajinan dekoratif estetik untuk kantor. Rekomendasi AI-nya benar-benar fungsional!', name: 'Bambang Pamungkas', role: 'General Manager' },
    { type: 'title', header: 'Artha Nusa', text: 'Alur transaksi aman dan diskusi interaktif dengan pengrajin sangat membantu menyamakan persepsi desain. Tidak ada miskomunikasi selama produksi.', name: 'Eka Wulandari', role: 'Spesialis Pengadaan' },
    { type: 'date', header: '10 - 03 - 2026', text: 'Kini saya tidak perlu bingung membuang sisa kain perca. Cukup cari pengrajin tekstil di dekat saya lewat peta SeDaLang dan semuanya langsung beres.', name: 'Andi Wijaya', role: 'Wiraswasta' }
  ],
  // Page 3
  [
    { type: 'date', header: '12 - 03 - 2026', text: 'SeDaLang adalah platform terbaik untuk mendukung ekonomi sirkular lokal. Penggunaannya mudah, fiturnya lengkap, dan dampaknya sangat nyata bagi lingkungan.', name: 'Siti Aminah', role: 'Dosen Teknik Lingkungan' },
    { type: 'title', header: 'PT. Kertas Semarang', text: 'Daur ulang limbah karton tebal menjadi kotak tisu mewah berjalan dengan sangat cepat. Negosiasi proposal harga dengan pengrajin juga transparan.', name: 'Joko Widodo', role: 'Spesialis Keberlanjutan' },
    { type: 'date', header: '18 - 03 - 2026', text: 'Fitur chat room dan proposal penawaran harga di SeDaLang sangat rapi. Tombol setuju/tolak dan integrasi pembayarannya memudahkan transaksi kami.', name: 'Gita Gutawa', role: 'Kolektor Seni' },
    { type: 'title', header: 'Indo Kulit', text: 'Kerja sama kami dengan perajin dompet dari perca kulit sangat sukses. Pengiriman aman dengan kurir lokal dan progres terupdate setiap hari.', name: 'Rudi Hartono', role: 'Supervisor Produksi' },
    { type: 'title', header: 'Semarang Creative', text: 'Rekomendasi model daur ulang dari fitur AI SeDaLang sangat futuristik. Kami mendapat inspirasi produk bernilai jual yang tidak terpikirkan sebelumnya.', name: 'Nadia Safitri', role: 'Desainer Produk' },
    { type: 'date', header: '22 - 03 - 2026', text: 'Layanan dukungan pelanggan yang ramah dan sistem navigasi peta pengrajin terdekat yang sangat membantu mempercepat proses drop-off material limbah.', name: 'Rizal Syahputra', role: 'Mahasiswa' }
  ]
]

// Select active data cards based on page number
const currentTestimonials = computed(() => {
  const index = (currentPage.value - 1) % testimonialsData.length
  return testimonialsData[index]
})

// Format page number to double digit (e.g. 02)
const formattedPage = computed(() => {
  return currentPage.value < 10 ? `0${currentPage.value}` : `${currentPage.value}`
})

const formattedTotalPages = computed(() => {
  return totalPages < 10 ? `0${totalPages}` : `${totalPages}`
})

// Navigation methods
const nextPage = () => {
  if (currentPage.value < totalPages) {
    currentPage.value++
  } else {
    currentPage.value = 1
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  } else {
    currentPage.value = totalPages
  }
}
</script>

<template>
  <section class="w-full bg-[#FFFFFF] py-20 md:py-28 select-none relative overflow-hidden border-b border-gray-100/50">
    <div class="max-w-8xl mx-auto px-10 lg:px-11 relative z-10">
      
      <!-- Top Pill Tag -->
      <div class="border border-gray-900 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase inline-block mb-6 select-none bg-white shadow-sm font-inter">
        Testimoni
      </div>

      <!-- Section Title -->
      <h2 class="font-poppins text-4xl md:text-5xl font-medium text-gray-950 mb-12 tracking-tight">
        Umpan Balik Klien Kami
      </h2>

      <!-- Testimonials Staggered Grid with Vue Page Swap Transition -->
      <transition name="testimonial-fade" mode="out-in">
        <div :key="currentPage" class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full items-start">
          
          <!-- Column 1 (Short + Long) -->
          <div class="flex flex-col gap-6 md:gap-8">
            <!-- Card 1 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[250px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[0].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[0].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="getAvatarUrl(null, currentTestimonials[0].name)" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[0].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[0].role }}</p>
                </div>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[300px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[3].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[3].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="getAvatarUrl(null, currentTestimonials[3].name)" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[3].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[3].role }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2 (Long + Short) -->
          <div class="flex flex-col gap-6 md:gap-8">
            <!-- Card 3 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[350px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[1].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[1].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="getAvatarUrl(null, currentTestimonials[1].name)" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[1].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[1].role }}</p>
                </div>
              </div>
            </div>

            <!-- Card 4 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[250px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[4].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[4].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="getAvatarUrl(null, currentTestimonials[4].name)" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[4].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[4].role }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 3 (Short + Long) -->
          <div class="flex flex-col gap-6 md:gap-8">
            <!-- Card 5 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[250px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[2].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[2].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="getAvatarUrl(null, currentTestimonials[2].name)" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[2].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[2].role }}</p>
                </div>
              </div>
            </div>

            <!-- Card 6 -->
            <div class="bg-white border border-[#EAEAEA] rounded-[28px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[300px]">
              <div>
                <span class="font-poppins text-sm md:text-base font-bold text-gray-950 block mb-4 uppercase tracking-wider">
                  {{ currentTestimonials[5].header }}
                </span>
                <p class="font-inter text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
                  {{ currentTestimonials[5].text }}
                </p>
              </div>
              <div class="flex items-center mt-auto">
                <img :src="getAvatarUrl(null, currentTestimonials[5].name)" alt="Avatar" class="w-10 h-10 rounded-full object-cover mr-4 border border-gray-100" />
                <div>
                  <h4 class="font-poppins text-sm font-bold text-gray-950">{{ currentTestimonials[5].name }}</h4>
                  <p class="font-inter text-xs text-gray-400">{{ currentTestimonials[5].role }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </transition>

      <!-- Bottom Right Pagination Controls -->
      <div class="w-full flex justify-end items-center mt-12 md:mt-16">
        <div class="flex items-center">
          
          <!-- Prev Button -->
          <button 
            @click="prevPage" 
            type="button"
            class="w-12 h-12 rounded-full bg-[#7A4D30] hover:bg-[#633e26] transition-colors duration-200 flex items-center justify-center text-white cursor-pointer select-none shadow-sm focus:outline-none"
            aria-label="Previous Page"
          >
            <!-- Chevron Left SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <!-- Page Indicator -->
          <span class="font-inter text-sm font-bold text-gray-900 mx-6 w-12 text-center select-none">
            {{ formattedPage }}/{{ formattedTotalPages }}
          </span>

          <!-- Next Button -->
          <button 
            @click="nextPage" 
            type="button"
            class="w-12 h-12 rounded-full bg-[#7A4D30] hover:bg-[#633e26] transition-colors duration-200 flex items-center justify-center text-white cursor-pointer select-none shadow-sm focus:outline-none"
            aria-label="Next Page"
          >
            <!-- Chevron Right SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Page Swap Fade Animation */
.testimonial-fade-enter-active,
.testimonial-fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.testimonial-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.testimonial-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>

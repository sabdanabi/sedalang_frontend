<template>
  <footer class="w-full bg-white pb-10 px-10 lg:px-11 font-inter select-none">
    <div class="max-w-8xl mx-auto bg-[#A28A76] rounded-[32px] p-10 md:p-16 text-white relative overflow-hidden">
      
      <!-- Top Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        <!-- Left Column: Branding and Description -->
        <div class="lg:col-span-4 flex flex-col items-start space-y-6">
          <div class="flex items-center gap-3">
            <!-- White SeDaLang Custom Logo -->
            <img 
              src="/images/logo/logo.svg" 
              alt="SeDaLang Logo" 
              class="w-14 h-14 object-contain brightness-0 invert" 
            />
            <span class="text-2xl font-bold tracking-tight text-white font-poppins">
              SeDaLang
            </span>
          </div>
          <p class="font-inter text-sm text-[#F5EDE6] opacity-80 leading-relaxed max-w-sm">
            Ubah barang bekas rumah tangga Anda menjadi produk bernilai tinggi dengan bantuan AI dan UMKM pengrajin lokal di Kota Semarang.
          </p>
        </div>

        <!-- Right Columns: Link Menus -->
        <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <!-- Column 1: Features -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-poppins text-base font-bold text-white tracking-wide">
              Fitur
            </h4>
            <ul class="flex flex-col space-y-3 font-inter text-sm text-[#F5EDE6]">
              <li><NuxtLink to="/dashboard-aiPage" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Halaman AI</NuxtLink></li>
              <li><NuxtLink to="/chat" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Ruang Diskusi</NuxtLink></li>
              <li><NuxtLink to="/history" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Lacak Progres</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 2: Legal -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-poppins text-base font-bold text-white tracking-wide">
              Legalitas
            </h4>
            <ul class="flex flex-col space-y-3 font-inter text-sm text-[#F5EDE6]">
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Kebijakan Privasi</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Kebijakan Cookie</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Kolaborasi</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 3: Service -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-poppins text-base font-bold text-white tracking-wide">
              Layanan
            </h4>
            <ul class="flex flex-col space-y-3 font-inter text-sm text-[#F5EDE6]">
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Karya Mandiri</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Acara</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Kredibilitas</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 4: Social Media -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-poppins text-base font-bold text-white tracking-wide">
              Media Sosial
            </h4>
            <ul class="flex flex-col space-y-3 font-inter text-sm text-[#F5EDE6]">
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Instagram</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">X (Twitter)</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Youtube</NuxtLink></li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Divider -->
      <hr class="border-white/15 my-10" />

      <!-- Bottom Section -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <!-- Navigation Link Tags -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 font-poppins text-sm font-semibold">
          <NuxtLink to="/#hero" class="hover:text-[#F5EDE6] transition-colors duration-150">Home</NuxtLink>
          <NuxtLink to="/#about" class="hover:text-[#F5EDE6] transition-colors duration-150">Tentang Kami</NuxtLink>
          <NuxtLink to="/#qna" class="hover:text-[#F5EDE6] transition-colors duration-150">Tanya Jawab</NuxtLink>
          <NuxtLink to="/#testimoni" class="hover:text-[#F5EDE6] transition-colors duration-150">Testimoni</NuxtLink>
        </div>

        <!-- Copyright -->
        <p class="font-inter text-sm text-[#F5EDE6] opacity-80">
          Hak Cipta © 2026 SeDaLang. Seluruh Hak Cipta Dilindungi.
        </p>

      </div>

    </div>
  </footer>
</template>

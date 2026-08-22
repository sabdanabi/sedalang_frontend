<template>
  <div class="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 bg-white">
    <!-- Left Column: Sirkula Branding & Compost Cycle Illustration (Hidden on Mobile) -->
    <section 
      class="hidden md:flex lg:col-span-6 flex-col justify-between p-10 lg:p-14 bg-[#F2F2F2] border-r border-[#E0E0E0] select-none m-6">
      <!-- Top Branding -->
      
      <div>
        <UiSirkulaLogo />
      </div>

      <!-- Center Diagram -->
      <div class="my-auto flex justify-center items-center py-8">
        <img 
          src="/images/auth_img.webp" 
          alt="Sirkula composting cycle illustration" 
          class="w-full max-w-[340px] lg:max-w-[460px] h-auto object-contain"
        />
      </div>

      <!-- Bottom Slogan -->
      <div class="text-center mx-auto max-w-[280px] lg:max-w-[320px]">
        <p class="text-sm lg:text-base font-semibold leading-relaxed text-[#7A4D30]/80">
            Pastikan Anda sudah memiliki akun sebelum menjelajahi destinasi wisata yang Anda inginkan
        </p>
      </div>
    </section>

    <!-- Right Column: Interactive Form Content (Occupies 100% on Mobile) -->
    <main class="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-white">
      <div class="w-full max-w-[450px] flex flex-col justify-center">
        <!-- Main Form Slot -->
        <slot />
      </div>
    </main>
    
  </div>
</template>

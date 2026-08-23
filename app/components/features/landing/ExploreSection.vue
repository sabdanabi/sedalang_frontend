<template>
  <section class="w-full bg-[#F7F7F7] border-y border-gray-100/50 py-20 md:py-28 select-none relative overflow-hidden">
    <!-- Subtle background pattern or blob for high aesthetics -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div class="absolute top-[20%] left-[80%] w-[30vw] h-[30vw] rounded-full bg-[#7A4D30]/2 blur-[80px]"></div>
      <div class="absolute bottom-[20%] right-[85%] w-[40vw] h-[40vw] rounded-full bg-[#7A4D30]/2 blur-[90px]"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center">
      <!-- Quote Header -->
      <h2 class="font-poppins text-xl sm:text-2xl md:text-3xl  text-gray-900 text-center leading-snug tracking-tight max-w-4xl">
        “Transform used items into something valuable, <br class="hidden sm:inline" /> 
        together with local artisans in Semarang.”
      </h2>
      
      <!-- Separator Line -->
      <div class="w-16 h-[2px] bg-[#7A4D30]/25 rounded-full my-8"></div>

      <!-- Feature Description Paragraph -->
      <p class="font-inter text-sm sm:text-base md:text-xl text-gray-500 text-center leading-relaxed max-w-7xl">
        SeDaLang offers AI features to analyze used items and provide recycling ideas, a "Smart Craftsman Matching" tool to find suitable artisans, and chat and proposal functions to facilitate communication and transactions. Users can also manage material shipping and payments, track project progress, and view environmental impact data via the Eco-Impact Report.
      </p>
    </div>
  </section>
</template>

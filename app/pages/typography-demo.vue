<template>
  <div class="min-h-screen bg-[#F9FAFB] py-12 px-6 lg:px-12 font-sans">
    <!-- Header -->
    <header class="max-w-5xl mx-auto mb-16 text-center">
      <span class="text-xs font-semibold uppercase tracking-wider text-[#7A4D30] bg-[#7A4D30]/10 px-3 py-1 rounded-full">
        Typography Guideline System
      </span>
      <h1 class="text-4xl font-bold font-poppins text-gray-900 mt-4">
        SeDaLang Frontend Typography
      </h1>
      <p class="text-gray-500 mt-2 font-inter max-w-xl mx-auto">
        Verify that Google Fonts (Poppins & Inter) are correctly loaded, integrated with Tailwind CSS 4, and mapped to global and custom utility classes.
      </p>
    </header>

    <!-- Main Grid -->
    <main class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Poppins Section -->
      <section class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition duration-300 hover:shadow-md">
        <div class="border-b border-gray-100 pb-4 mb-6">
          <h2 class="text-2xl font-bold font-poppins text-gray-900">
            Poppins Typography
          </h2>
          <p class="text-xs text-gray-400 mt-1 font-inter">
            Used primarily for headings & display.
          </p>
        </div>

        <div class="space-y-8">
          <!-- Highlight 1 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 1</span>
              <span>Poppins 74 (Bold)</span>
            </div>
            <div class="text-poppins-h1 text-gray-900 leading-none">
              Highlight 1
            </div>
          </div>

          <!-- Highlight 2 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 2</span>
              <span>Poppins 40 (Bold)</span>
            </div>
            <div class="text-poppins-h2 text-gray-900 leading-tight">
              Highlight 2
            </div>
          </div>

          <!-- Highlight 3 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 3</span>
              <span>Poppins 32 (Semi-Bold)</span>
            </div>
            <div class="text-poppins-h3 text-gray-900">
              Highlight 3
            </div>
          </div>

          <!-- Highlight 4 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 4</span>
              <span>Poppins 24 (Medium)</span>
            </div>
            <div class="text-poppins-h4 text-gray-900">
              Highlight 4
            </div>
          </div>

          <!-- Highlight 5 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 5</span>
              <span>Poppins 20 (Medium)</span>
            </div>
            <div class="text-poppins-h5 text-gray-900">
              Highlight 5
            </div>
          </div>

          <!-- Highlight 6 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 6</span>
              <span>Poppins 18 (Medium)</span>
            </div>
            <div class="text-poppins-h6 text-gray-900">
              Highlight 6
            </div>
          </div>

          <!-- Highlight 9 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 9</span>
              <span>Poppins 16 (Regular)</span>
            </div>
            <div class="text-poppins-h9 text-gray-900">
              Highlight 9
            </div>
          </div>

          <!-- Highlight 10 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 10</span>
              <span>Poppins 14 (Regular)</span>
            </div>
            <div class="text-poppins-h10 text-gray-900">
              Highlight 10
            </div>
          </div>
        </div>
      </section>

      <!-- Inter Section -->
      <section class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition duration-300 hover:shadow-md">
        <div class="border-b border-gray-100 pb-4 mb-6">
          <h2 class="text-2xl font-bold font-inter text-gray-900">
            Inter Typography
          </h2>
          <p class="text-xs text-gray-400 mt-1 font-inter">
            Used for body text, form elements, and general UI.
          </p>
        </div>

        <div class="space-y-8">
          <!-- Highlight 1 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 1</span>
              <span>Inter 32 (Semi-Bold)</span>
            </div>
            <div class="text-inter-h1 text-gray-900 leading-tight">
              Highlight 1
            </div>
          </div>

          <!-- Highlight 2 -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 2</span>
              <span>Inter 24 (Medium)</span>
            </div>
            <div class="text-inter-h2 text-gray-900">
              Highlight 2
            </div>
          </div>

          <!-- Highlight 3 (20px) -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 3</span>
              <span>Inter 20 (Regular)</span>
            </div>
            <div class="text-inter-h3 text-gray-900">
              Highlight 3
            </div>
          </div>

          <!-- Highlight 3 (16px) -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 3</span>
              <span>Inter 16 (Regular)</span>
            </div>
            <div class="text-inter-h4 text-gray-900">
              Highlight 3
            </div>
          </div>

          <!-- Highlight 3 (14px) -->
          <div>
            <div class="flex items-center justify-between text-xs text-gray-400 mb-1 font-inter">
              <span>Highlight 3</span>
              <span>Inter 14 (Regular)</span>
            </div>
            <div class="text-inter-h5 text-gray-900">
              Highlight 3
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Tailwind 4 @theme verification -->
    <footer class="max-w-5xl mx-auto mt-12 p-6 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
      <h3 class="text-sm font-semibold text-[#7A4D30] font-poppins">Tailwind CSS 4 Utility Class Verification</h3>
      <div class="mt-4 flex flex-wrap justify-center gap-6 text-xs font-mono text-gray-600">
        <span class="font-poppins">font-poppins: Poppins Font Loaded</span>
        <span class="font-inter">font-inter: Inter Font Loaded</span>
        <span class="text-poppins-20">text-poppins-20 (Custom size)</span>
        <span class="text-inter-20">text-inter-20 (Custom size)</span>
      </div>
    </footer>
  </div>
</template>

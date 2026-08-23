<template>
  <footer class="w-full bg-white pb-10 px-10 lg:px-11 font-inter select-none">
    <div class="max-w-8xl mx-auto bg-[#A28A76] rounded-[32px] p-10 md:p-16 text-white relative overflow-hidden">
      
      <!-- Top Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        <!-- Left Column: Branding and Description -->
        <div class="lg:col-span-4 flex flex-col items-start space-y-6">
          <div class="flex items-center gap-3">
            <!-- White SeDaLang Custom Logo -->
            <svg 
              viewBox="0 0 100 100" 
              class="w-10 h-10 text-white fill-current" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <!-- Rounded trapezoid cap (top lid) -->
              <path d="M 24,45 C 24,45 30,32 34,28 C 38,24 44,22 50,22 C 56,22 62,24 66,28 C 70,32 76,45 76,45 C 77,47 75,48 73,48 L 27,48 C 25,48 23,47 24,45 Z" />
              <!-- Rounded trapezoid body (bottom pot) -->
              <path d="M 25,54 L 29,63 C 33,72 40,78 50,78 C 60,78 67,72 71,63 L 75,54 C 76,52 74,51 72,51 L 28,51 C 26,51 24,52 25,54 Z" />
            </svg>
            <span class="text-2xl font-bold tracking-tight text-white font-poppins">
              SeDaLang
            </span>
          </div>
          <p class="font-inter text-sm text-[#F5EDE6] opacity-80 leading-relaxed max-w-sm">
            Transform used household items into valuable products with the help of AI and local MSME artisans in Semarang.
          </p>
        </div>

        <!-- Right Columns: Link Menus -->
        <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <!-- Column 1: Features -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-poppins text-base font-bold text-white tracking-wide">
              Features
            </h4>
            <ul class="flex flex-col space-y-3 font-inter text-sm text-[#F5EDE6]">
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Bid a ticket</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Buy a ticket</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Discount</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 2: Legal -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-poppins text-base font-bold text-white tracking-wide">
              Legal
            </h4>
            <ul class="flex flex-col space-y-3 font-inter text-sm text-[#F5EDE6]">
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Cookie Policy</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Collaboration</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 3: Service -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-poppins text-base font-bold text-white tracking-wide">
              Service
            </h4>
            <ul class="flex flex-col space-y-3 font-inter text-sm text-[#F5EDE6]">
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">GoWalk made by self</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Event</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Creadibilities</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 4: Social Media -->
          <div class="flex flex-col space-y-4">
            <h4 class="font-poppins text-base font-bold text-white tracking-wide">
              Social Media
            </h4>
            <ul class="flex flex-col space-y-3 font-inter text-sm text-[#F5EDE6]">
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Instagram</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">X or Twitter</NuxtLink></li>
              <li><NuxtLink to="#" class="hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100">Youtube</NuxtLink></li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Divider -->
      <hr class="border-white/15 my-10" />

      <!-- Bottom Section -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <!-- Navigation Link Tags (matching mockup capitalization/names) -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 font-poppins text-sm font-semibold">
          <NuxtLink to="/ai" class="hover:text-[#F5EDE6] transition-colors duration-150">AI Page</NuxtLink>
          <NuxtLink to="/discussion" class="hover:text-[#F5EDE6] transition-colors duration-150">Discussion Room</NuxtLink>
          <NuxtLink to="/tracking" class="hover:text-[#F5EDE6] transition-colors duration-150">Tracking Progres</NuxtLink>
          <NuxtLink to="/explore" class="hover:text-[#F5EDE6] transition-colors duration-150">Looking for a Craftsman</NuxtLink>
        </div>

        <!-- Copyright (matching mockup) -->
        <p class="font-inter text-sm text-[#F5EDE6] opacity-80">
          Copyright © 2024 All rights reserved.
        </p>

      </div>

    </div>
  </footer>
</template>

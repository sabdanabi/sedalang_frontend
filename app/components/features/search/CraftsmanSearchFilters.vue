<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  initialSearch?: string
  initialLocation?: string
  initialSpecialty?: string
  initialRating?: string
}>()

const emit = defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'update:location', val: string): void
  (e: 'update:specialty', val: string): void
  (e: 'update:rating', val: string): void
}>()

const searchQuery = ref(props.initialSearch || '')
const selectedLocation = ref(props.initialLocation || 'Semua Lokasi')
const selectedSpecialty = ref(props.initialSpecialty || 'Semua Keahlian')
const selectedRating = ref(props.initialRating || 'Semua Penilaian')

watch(searchQuery, (newVal) => emit('update:search', newVal))
watch(selectedLocation, (newVal) => emit('update:location', newVal))
watch(selectedSpecialty, (newVal) => emit('update:specialty', newVal))
watch(selectedRating, (newVal) => emit('update:rating', newVal))
</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.012)] flex flex-col lg:flex-row items-center gap-4 w-full">
    
    <!-- Left segment: Text Search Input -->
    <div class="relative w-full lg:flex-grow">
      <span class="absolute inset-y-0 left-4.5 flex items-center text-gray-400 select-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4.5 h-4.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search craftsman or technique..."
        class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
      />
    </div>

    <!-- Right segment: Three Select Dropdowns -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto flex-shrink-0">
      
      <!-- Lokasi Dropdown -->
      <div class="relative">
        <select
          v-model="selectedLocation"
          class="w-full lg:w-44 bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 pl-10 pr-8 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter font-semibold appearance-none cursor-pointer"
          style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke-width=%222.5%22 stroke=%22%237A4D30%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19.5 8.25l-7.5 7.5-7.5-7.5%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 0.8rem center; background-size: 0.8rem;"
        >
          <option value="Semua Lokasi">Semua Lokasi</option>
          <option value="Tembalang">Tembalang</option>
          <option value="Ngaliyan">Ngaliyan</option>
          <option value="Pedurungan">Pedurungan</option>
        </select>
        <!-- Location Icon Overlay -->
        <span class="absolute inset-y-0 left-3.5 flex items-center text-[#7A4D30] pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </span>
      </div>

      <!-- Keahlian Dropdown -->
      <div class="relative">
        <select
          v-model="selectedSpecialty"
          class="w-full lg:w-44 bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 pl-4 pr-8 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter font-semibold appearance-none cursor-pointer"
          style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke-width=%222.5%22 stroke=%22%237A4D30%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19.5 8.25l-7.5 7.5-7.5-7.5%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 0.8rem center; background-size: 0.8rem;"
        >
          <option value="Semua Keahlian">Semua Keahlian</option>
          <option value="Pengrajin Kaca">Pengrajin Kaca</option>
          <option value="Pengrajin Kayu">Pengrajin Kayu</option>
          <option value="Pengrajin Besi">Pengrajin Besi</option>
        </select>
      </div>

      <!-- Penilaian Dropdown -->
      <div class="relative">
        <select
          v-model="selectedRating"
          class="w-full lg:w-44 bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3.5 pl-10 pr-8 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter font-semibold appearance-none cursor-pointer"
          style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke-width=%222.5%22 stroke=%22%237A4D30%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19.5 8.25l-7.5 7.5-7.5-7.5%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 0.8rem center; background-size: 0.8rem;"
        >
          <option value="Semua Penilaian">Penilaian</option>
          <option value="4.8">★ 4.8 ke atas</option>
          <option value="4.5">★ 4.5 ke atas</option>
        </select>
        <!-- Rating Star Icon Overlay -->
        <span class="absolute inset-y-0 left-3.5 flex items-center text-[#7A4D30] pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-amber-500">
            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.378 21.268c-1.017.607-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>

    </div>

  </div>
</template>

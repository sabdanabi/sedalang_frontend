<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

// Set the worker URL explicitly for MapLibre to load worker from local package via Vite
maplibregl.setWorkerUrl(workerUrl)

const mapContainer = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize MapLibre GL JS Map
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://tiles.openfreemap.org/styles/bright', // Correct OpenFreeMap bright style
    center: [110.4203, -6.9932], // Semarang City, Central Java
    zoom: 12.5, // Ideal zoom to view districts clearly
    maxZoom: 18,
    minZoom: 10
  })

  // Add zoom and rotation controls
  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('load', () => {
    if (!map) return

    // 13 Artisan locations in Semarang (original 6 + 7 new ones)
    const locations = [
      { coords: [110.4003, -6.9832], name: 'Pengrajin Bambu Krobokan' },
      { coords: [110.4153, -6.9872], name: 'Sirkula Woodcraft Tengah' },
      { coords: [110.4203, -6.9932], name: 'Limbah Kreatif Simpang Lima' },
      { coords: [110.4353, -7.0002], name: 'Galeri Daur Ulang Gayamsari' },
      { coords: [110.4123, -7.0132], name: 'Kerajinan Kertas Gajahmungkur' },
      { coords: [110.4283, -7.0222], name: 'Daur Ulang Tekstil Candisari' },
      { coords: [110.4412, -7.0482], name: 'Workshop Ecobrick Tembalang' },
      { coords: [110.4253, -7.0592], name: 'Kerajinan Ban Bekas Banyumanik' },
      { coords: [110.4632, -7.0052], name: 'Kreasi Logam Pedurungan' },
      { coords: [110.4721, -6.9692], name: 'Daur Ulang Plastik Genuk' },
      { coords: [110.3543, -6.9972], name: 'Galeri Kaca Ngaliyan' },
      { coords: [110.3782, -7.0542], name: 'Pengrajin Serabut Kelapa Gunungpati' },
      { coords: [110.4278, -6.9681], name: 'Kolektif Seni Sampah Kota Lama' }
    ]

    // Add Custom Numbered Markers for each location
    locations.forEach((loc, idx) => {
      const el = document.createElement('div')
      el.className = 'custom-map-marker font-inter'
      el.style.width = '32px'
      el.style.height = '32px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = '#FFFFFF'
      el.style.border = '2px solid #7A4D30'
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'
      el.style.color = '#7A4D30'
      el.style.fontWeight = 'bold'
      el.style.fontSize = '12px'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.style.cursor = 'pointer'
      el.innerText = String(idx + 1).padStart(2, '0')

      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(
        `<div class="p-2 font-inter text-xs text-gray-800">
           <h4 class="font-bold font-poppins text-gray-900">${loc.name}</h4>
           <p class="text-gray-500 mt-1">Mitra Pengrajin SeDaLang</p>
         </div>`
      )

      new maplibregl.Marker(el)
        .setLngLat(loc.coords as [number, number])
        .setPopup(popup)
        .addTo(map!)
    })
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <section class="w-full bg-[#ffffff] py-20 md:py-28 select-none relative overflow-hidden border-b border-gray-100/50">
    <div class="max-w-8xl mx-auto px-10 lg:px-11 relative z-10">
      
      <!-- Top Pill Tag (Aligns with layout guidelines) -->
      <div class="border border-gray-900 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider text-gray-800 uppercase inline-block mb-10 select-none bg-white shadow-sm font-inter">
        Peta
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Left: Map Container -->
        <div class="lg:col-span-5 w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden border border-gray-150 shadow-sm relative bg-gray-100">
          <div ref="mapContainer" class="w-full h-full"></div>
        </div>

        <!-- Right: Text Content -->
        <div class="lg:col-span-7 flex flex-col space-y-6">
          <h2 class="font-poppins text-7xl md:text-8xl font-medium text-gray-950 tracking-tight leading-none uppercase">
            TEMPAT MENCARI <br /> PENGRAJIN
          </h2>
          <p class="font-inter text-lg md:text-xl text-gray-500 leading-relaxed max-w-xl">
            Ubah barang bekas rumah tangga Anda menjadi produk bernilai tinggi dengan bantuan AI dan UMKM pengrajin lokal di Kota Semarang.
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<style>
/* Custom MapLibre Popup Styling to match SeDaLang themes */
.maplibregl-popup-content {
  border-radius: 12px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #F3F4F6 !important;
}
.maplibregl-popup-close-button {
  outline: none !important;
  padding: 4px 8px !important;
  font-size: 14px !important;
}
</style>

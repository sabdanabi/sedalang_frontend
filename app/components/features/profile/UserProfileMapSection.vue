<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'

// Set the Maplibre worker URL
maplibregl.setWorkerUrl(workerUrl)

const mapContainer = ref<HTMLElement | null>(null)
let mapInstance: maplibregl.Map | null = null
let markerInstance: maplibregl.Marker | null = null

const currentCoords = ref<[number, number]>([110.4203, -6.9932]) // Semarang Tengah default

onMounted(() => {
  if (mapContainer.value) {
    mapInstance = new maplibregl.Map({
      container: mapContainer.value,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: currentCoords.value,
      zoom: 14
    })

    // Add navigation controls
    mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Add marker representation
    markerInstance = new maplibregl.Marker({ color: '#7A4D30' })
      .setLngLat(currentCoords.value)
      .addTo(mapInstance)
  }
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove()
  }
})

// Geolocation fetch coordinates
const handleCompareLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation tidak didukung oleh browser Anda.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { longitude, latitude } = position.coords
      currentCoords.value = [longitude, latitude]

      if (mapInstance && markerInstance) {
        mapInstance.flyTo({
          center: currentCoords.value,
          zoom: 15,
          essential: true
        })
        markerInstance.setLngLat(currentCoords.value)
      }
      alert(`Lokasi berhasil dibandingkan! Koordinat Anda: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
    },
    (error) => {
      console.error('Failed to get location', error)
      alert('Gagal mengambil lokasi Anda. Pastikan izin lokasi diaktifkan.')
    }
  )
}
</script>

<template>
  <div class="space-y-4 text-left h-full flex flex-col justify-between">
    
    <!-- Compare Location Trigger -->
    <div class="flex justify-end">
      <button
        type="button"
        @click="handleCompareLocation"
        class="border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2.5 px-6 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-[#7A4D30]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        Bandingkan Lokasi Saya
      </button>
    </div>

    <!-- Map Canvas Container -->
    <div class="w-full h-80 sm:h-full min-h-[300px] rounded-[32px] overflow-hidden border border-gray-150 relative shadow-sm z-10 flex-grow">
      <div ref="mapContainer" class="w-full h-full"></div>
    </div>

  </div>
</template>

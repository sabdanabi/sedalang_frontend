<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'

// Set the Maplibre worker URL
maplibregl.setWorkerUrl(workerUrl)

const props = defineProps<{
  location?: string
  latitude?: number | null
  longitude?: number | null
}>()

const mapContainer = ref<HTMLElement | null>(null)
let mapInstance: maplibregl.Map | null = null
let markerInstance: maplibregl.Marker | null = null

const currentCoords = ref<[number, number]>([110.4208, -6.9806]) // Semarang center coordinates

const getCoordsFromLocation = (locStr: string): [number, number] => {
  const normalized = locStr.toLowerCase()
  if (normalized.includes('tembalang')) return [110.4381, -7.0507]
  if (normalized.includes('pedurungan')) return [110.4704, -7.0069]
  if (normalized.includes('ngaliyan')) return [110.3340, -7.0135]
  if (normalized.includes('banyumanik')) return [110.4262, -7.0658]
  if (normalized.includes('gunungpati')) return [110.3662, -7.0864]
  if (normalized.includes('mijen')) return [110.3164, -7.0610]
  if (normalized.includes('tugu')) return [110.3013, -6.9749]
  if (normalized.includes('genuk')) return [110.4795, -6.9634]
  if (normalized.includes('gajahmungkur')) return [110.4140, -7.0152]
  if (normalized.includes('candisari')) return [110.4312, -7.0205]
  if (normalized.includes('tengah')) return [110.4208, -6.9806]
  if (normalized.includes('utara')) return [110.4190, -6.9535]
  if (normalized.includes('selatan')) return [110.4222, -6.9961]
  if (normalized.includes('barat')) return [110.3857, -6.9897]
  if (normalized.includes('timur')) return [110.4398, -6.9790]
  
  return [110.4208, -6.9806]
}

const updateCoordsFromProp = () => {
  if (props.latitude != null && props.longitude != null) {
    const coords: [number, number] = [Number(props.longitude), Number(props.latitude)]
    currentCoords.value = coords
    if (mapInstance && markerInstance) {
      mapInstance.flyTo({
        center: coords,
        zoom: 14,
        essential: true
      })
      markerInstance.setLngLat(coords)
    }
  } else if (props.location) {
    const coords = getCoordsFromLocation(props.location)
    currentCoords.value = coords
    if (mapInstance && markerInstance) {
      mapInstance.flyTo({
        center: coords,
        zoom: 14,
        essential: true
      })
      markerInstance.setLngLat(coords)
    }
  }
}

watch([() => props.location, () => props.latitude, () => props.longitude], () => {
  updateCoordsFromProp()
}, { immediate: true })

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
  <div class="space-y-6 text-left">
    
    <!-- Header row map controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="font-poppins text-lg md:text-xl font-bold text-gray-950">
          Lokasi Pengrajin
        </h3>
        <p class="font-inter text-xs md:text-sm text-gray-500 mt-1">
          Lihat lebih jelas dan dekat untuk lokasi pengrajin dengan anda
        </p>
      </div>

      <!-- Compare Location Trigger -->
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
    <div class="w-full h-80 md:h-[400px] rounded-[32px] overflow-hidden border border-gray-150 relative shadow-sm z-10">
      <div ref="mapContainer" class="w-full h-full"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useAuthStore } from '~/stores/auth'

// Set the Maplibre worker URL
maplibregl.setWorkerUrl(workerUrl)

const props = withDefaults(
  defineProps<{
    location?: string
    latitude?: number | null
    longitude?: number | null
    isOwnProfile?: boolean
  }>(),
  {
    isOwnProfile: true
  }
)

const emit = defineEmits<{
  (e: 'refresh-profile'): void
}>()

const authStore = useAuthStore()

const mapContainer = ref<HTMLElement | null>(null)
let mapInstance: maplibregl.Map | null = null
let profileMarker: maplibregl.Marker | null = null
let currentLocationMarker: maplibregl.Marker | null = null

const isComparing = ref(false)

const profileCoords = ref<[number, number]>([
  props.longitude != null ? Number(props.longitude) : 110.4208,
  props.latitude != null ? Number(props.latitude) : -6.9806
])

const cleanupRouteAndUser = () => {
  if (currentLocationMarker) {
    currentLocationMarker.remove()
    currentLocationMarker = null
  }
  if (mapInstance) {
    if (mapInstance.getLayer('route')) {
      mapInstance.removeLayer('route')
    }
    if (mapInstance.getSource('route')) {
      mapInstance.removeSource('route')
    }
  }
}

const updateCoordsFromProp = () => {
  if (props.latitude != null && props.longitude != null) {
    const coords: [number, number] = [Number(props.longitude), Number(props.latitude)]
    profileCoords.value = coords
    cleanupRouteAndUser()
    if (mapInstance && profileMarker) {
      mapInstance.flyTo({
        center: coords,
        zoom: 14,
        essential: true
      })
      profileMarker.setLngLat(coords)
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
      center: profileCoords.value,
      zoom: 14
    })

    // Add navigation controls
    mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Add marker representation for user profile location
    profileMarker = new maplibregl.Marker({ color: '#7A4D30' })
      .setLngLat(profileCoords.value)
      .addTo(mapInstance)
  }
})

onBeforeUnmount(() => {
  cleanupRouteAndUser()
  if (mapInstance) {
    mapInstance.remove()
  }
})

// Geolocation fetch coordinates and save location to API
const handleCompareLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation tidak didukung oleh browser Anda.')
    return
  }

  isComparing.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { longitude: userLng, latitude: userLat } = position.coords

        // Fetch location address text via reverse geocoding API
        let detectedAddress = 'Semarang Tengah, Jawa Tengah'
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`)
          const data = await res.json()
          if (data && data.display_name) {
            const address = data.address
            const city = address.city || address.town || address.municipality || address.county || ''
            const state = address.state || ''
            if (city) {
              detectedAddress = `${city}, ${state}`
            } else {
              detectedAddress = data.display_name.split(',').slice(0, 3).join(',').trim()
            }
          }
        } catch (err) {
          console.warn('Failed to reverse geocode coordinate:', err)
        }

        // Send to backend via authStore
        if (authStore.user) {
          await authStore.updateUserProfile({
            fullName: authStore.user.fullName || '',
            phoneNumber: authStore.user.phoneNumber || undefined,
            location: detectedAddress,
            latitude: userLat,
            longitude: userLng
          })
          
          alert('Lokasi Anda berhasil diperbarui di sistem!')
          
          // Emit to parent to reload profile details
          emit('refresh-profile')
        } else {
          // Fallback if not logged in
          profileCoords.value = [userLng, userLat]
          if (mapInstance && profileMarker) {
            profileMarker.setLngLat([userLng, userLat])
            mapInstance.flyTo({ center: [userLng, userLat], zoom: 15 })
          }
        }
      } catch (err: any) {
        console.error('Failed to update user location:', err)
        alert('Gagal memperbarui lokasi Anda: ' + (err.message || err))
      } finally {
        isComparing.value = false
      }
    },
    (error) => {
      console.error('Failed to get location', error)
      alert('Gagal mengambil lokasi Anda. Pastikan izin lokasi diaktifkan.')
      isComparing.value = false
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
        :disabled="isComparing"
        class="border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2.5 px-6 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="isComparing" class="animate-spin h-4 w-4 text-[#7A4D30]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-[#7A4D30]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        {{ isComparing ? 'Menambahkan...' : 'Tambahkan Lokasi Saya' }}
      </button>
    </div>

    <!-- Map Canvas Container -->
    <div class="w-full h-80 sm:h-full min-h-[300px] rounded-[32px] overflow-hidden border border-gray-150 relative shadow-sm z-10 flex-grow">
      <div ref="mapContainer" class="w-full h-full"></div>
    </div>

  </div>
</template>

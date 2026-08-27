<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as maplibregl from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

// Set the Maplibre worker URL
maplibregl.setWorkerUrl(workerUrl)

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

// Form states
const productName = ref('')
const materialName = ref('')
const price = ref('')
const estimate = ref('')
const paymentMethod = ref('')
const shippingMethod = ref('')

const mapContainer = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null

const initMap = () => {
  if (!mapContainer.value) return

  // Dispose map if already initialized
  if (map) {
    map.remove()
    map = null
  }

  // Initialize MapLibre GL
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://tiles.openfreemap.org/styles/bright',
    center: [110.4203, -6.9932], // Semarang City Center
    zoom: 13,
    maxZoom: 18,
    minZoom: 10
  })

  // Add navigation zoom controls
  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('load', () => {
    if (!map) return

    // Draw route path coordinates (connects simulated points in Semarang)
    const routeCoordinates = [
      [110.412, -6.985],
      [110.418, -6.990],
      [110.422, -6.995],
      [110.428, -6.998]
    ]

    map.addSource('proposal-route-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      }
    })

    map.addLayer({
      id: 'route-line-layer',
      type: 'line',
      source: 'proposal-route-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#7A4D30',
        'line-width': 4,
        'line-opacity': 0.85
      }
    })

    // Add numbered markers along path
    routeCoordinates.forEach((coord, index) => {
      const markerEl = document.createElement('div')
      markerEl.className = 'w-6 h-6 rounded-full bg-white border-2 border-[#7A4D30] text-[#7A4D30] font-bold text-[10px] flex items-center justify-center shadow-md'
      markerEl.innerText = `0${index + 1}`

      new maplibregl.Marker(markerEl)
        .setLngLat(coord as [number, number])
        .addTo(map!)
    })
  })
}

// Watch 'show' to initialize map when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      initMap()
    })
  } else {
    if (map) {
      map.remove()
      map = null
    }
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

const handleFormSubmit = () => {
  if (!productName.value.trim() || !materialName.value.trim() || !price.value.trim()) {
    alert('Silakan lengkapi nama produk, material, dan harga.')
    return
  }

  emit('submit', {
    productName: productName.value,
    materialName: materialName.value,
    price: price.value,
    estimate: estimate.value,
    paymentMethod: paymentMethod.value,
    shippingMethod: shippingMethod.value
  })

  // Clear form
  productName.value = ''
  materialName.value = ''
  price.value = ''
  estimate.value = ''
  paymentMethod.value = ''
  shippingMethod.value = ''
}
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="scale">
        <div class="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] text-left">
          
          <!-- Close Button -->
          <button 
            @click="$emit('close')"
            class="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white border border-gray-150 hover:border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4.5 h-4.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="mb-6">
            <h3 class="font-poppins text-xl md:text-2xl font-bold text-gray-950">
              Lengkapi Data Berikut
            </h3>
            <p class="font-inter text-xs md:text-sm text-gray-400 mt-1">
              Rincian lengkap produk untuk menyetujui proposal
            </p>
          </div>

          <!-- Form Area -->
          <form @submit.prevent="handleFormSubmit" class="space-y-5">
            
            <!-- Nama -->
            <div class="flex flex-col gap-1.5 text-left">
              <label class="font-poppins text-xs font-bold text-gray-950">Nama</label>
              <input
                v-model="productName"
                type="text"
                placeholder="Nama Produk"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
              />
            </div>

            <!-- Lokasi & Map Container -->
            <div class="flex flex-col gap-3 text-left">
              <label class="font-poppins text-xs font-bold text-gray-950">Lokasi</label>
              
              <!-- Lokasi Saat Ini Button -->
              <button
                type="button"
                class="self-start border border-[#7A4D30]/30 text-[#7A4D30] hover:bg-[#7A4D30]/5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <!-- Location Pin icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Lokasi Saat Ini
              </button>

              <!-- Map Container -->
              <div 
                ref="mapContainer" 
                id="proposal-map" 
                class="w-full h-48 rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm"
              ></div>
            </div>

            <!-- Bahan Material -->
            <div class="flex flex-col gap-1.5 text-left">
              <label class="font-poppins text-xs font-bold text-gray-950">Bahan Material</label>
              <input
                v-model="materialName"
                type="text"
                placeholder="Material"
                class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
              />
            </div>

            <!-- Harga & Estimasi (Row) -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Harga -->
              <div class="flex flex-col gap-1.5 text-left">
                <label class="font-poppins text-xs font-bold text-gray-950">Harga</label>
                <input
                  v-model="price"
                  type="text"
                  placeholder="Harga Produk"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
                />
              </div>
              <!-- Estimasi -->
              <div class="flex flex-col gap-1.5 text-left">
                <label class="font-poppins text-xs font-bold text-gray-950">Estimasi</label>
                <input
                  v-model="estimate"
                  type="text"
                  placeholder="Estimasi Jadi"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
                />
              </div>
            </div>

            <!-- Metode Pembayaran & Pengiriman (Row) -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Metode Pembayaran -->
              <div class="flex flex-col gap-1.5 text-left">
                <label class="font-poppins text-xs font-bold text-gray-950">Metode Pembayaran</label>
                <select
                  v-model="paymentMethod"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Pembayaran</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="COD">Cash On Delivery (COD)</option>
                  <option value="Sirkula Pay">Sirkula Pay</option>
                </select>
              </div>
              <!-- Metode Pengiriman -->
              <div class="flex flex-col gap-1.5 text-left">
                <label class="font-poppins text-xs font-bold text-gray-950">Metode Pengiriman</label>
                <select
                  v-model="shippingMethod"
                  class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 px-4 text-xs md:text-sm text-gray-800 outline-none transition-all font-inter appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Pengiriman</option>
                  <option value="Kurir Lokal">Kurir Lokal</option>
                  <option value="Ambil Sendiri">Ambil Sendiri</option>
                  <option value="Ekspedisi Express">Ekspedisi Express</option>
                </select>
              </div>
            </div>

            <!-- Submit Button (Outlined, full-width) -->
            <div class="pt-4">
              <button
                type="submit"
                class="w-full border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30] hover:text-white py-3.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 group cursor-pointer focus:outline-none"
              >
                Selengkapnya
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </button>
            </div>

          </form>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.94);
  opacity: 0;
}
</style>

<script setup lang="ts">
interface Tool {
  name: string
  icon: string
}

interface Skill {
  name: string
  icon: string
  desc: string
  color: string
}

interface Step {
  title: string
  desc: string
}

interface Product {
  id: number
  title: string
  subtitle: string
  description: string
  detailDescription: string
  tools: Tool[]
  materials: string[]
  skills: Skill[]
  steps: Step[]
  image: string
  materialType: string
}

defineProps<{
  show: boolean
  product: Product | null
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'use-idea'): void
}>()
</script>

<template>
  <!-- Product Detail Popup Modal -->
  <Transition name="fade">
    <div 
      v-if="show && product" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="scale">
        <div class="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] text-left p-6 md:p-8">
          
          <!-- Modal Header -->
          <div class="flex items-start justify-between pb-6 border-b border-gray-100">
            <div class="pr-8 text-left">
              <h3 class="font-poppins text-2xl font-bold text-gray-950 leading-snug">
                {{ product.title }}
              </h3>
              <p class="font-inter text-sm text-gray-400 mt-1">
                {{ product.subtitle }}
              </p>
            </div>
            
            <!-- Close Button -->
            <button 
              @click="$emit('close')"
              class="w-10 h-10 rounded-full border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all duration-200 cursor-pointer focus:outline-none flex-shrink-0"
              aria-label="Tutup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Scrollable Content Container -->
          <div class="flex-grow overflow-y-auto mt-6 pr-2">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              <!-- Left Column: Image and Timeline -->
              <div class="md:col-span-5 flex flex-col">
                <!-- Product Image -->
                <div class="w-full aspect-[4/3] md:aspect-square rounded-[24px] overflow-hidden bg-gray-50">
                  <img 
                    :src="product.image" 
                    :alt="product.title" 
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Timeline: Proses Pembuatan -->
                <div class="mt-8 text-left">
                  <h4 class="font-poppins text-base font-bold text-gray-950 mb-6">
                    Proses Pembuatan
                  </h4>
                  
                  <div class="flex flex-col">
                    <div 
                      v-for="(step, index) in product.steps" 
                      :key="index"
                      class="flex gap-4 relative pb-6 last:pb-0"
                    >
                      <!-- Timeline circle connecting line -->
                      <div 
                        v-if="index < product.steps.length - 1" 
                        class="absolute top-8 left-[15px] w-[2px] h-[calc(100%-8px)] bg-gray-100"
                      ></div>

                      <!-- Step badge index circle -->
                      <div class="w-8 h-8 rounded-full bg-[#7A4D30] text-white flex items-center justify-center font-poppins text-xs font-bold flex-shrink-0 z-10">
                        {{ index + 1 }}
                      </div>

                      <!-- Step text content -->
                      <div class="flex flex-col text-left pt-0.5">
                        <span class="font-poppins text-sm font-bold text-gray-950">
                          {{ step.title }}
                        </span>
                        <span class="font-inter text-xs text-gray-400 mt-1 leading-relaxed">
                          {{ step.desc }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Details descriptions and badges -->
              <div class="md:col-span-7 flex flex-col gap-6">
                
                <!-- Description -->
                <div>
                  <h4 class="font-poppins text-base font-bold text-gray-950 mb-2">
                    Deskripsi Produk
                  </h4>
                  <p class="font-inter text-sm text-gray-400 leading-relaxed">
                    {{ product.detailDescription }}
                  </p>
                </div>

                <!-- Tools Badges -->
                <div>
                  <h4 class="font-poppins text-base font-bold text-gray-950 mb-3">
                    Alat yang Digunakan
                  </h4>
                  <div class="flex flex-wrap gap-2.5">
                    <div 
                      v-for="(tool, index) in product.tools" 
                      :key="index"
                      class="px-4 py-2 rounded-full bg-[#7A4D30] text-white text-xs font-medium shadow-sm transition-all duration-200 hover:opacity-90"
                    >
                      {{ tool.name }}
                    </div>
                  </div>
                </div>

                <!-- Materials Badges -->
                <div>
                  <h4 class="font-poppins text-base font-bold text-gray-950 mb-3">
                    Bahan Material
                  </h4>
                  <div class="flex flex-wrap gap-2.5">
                    <div 
                      v-for="(material, index) in product.materials" 
                      :key="index"
                      class="px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200/60"
                    >
                      {{ material }}
                    </div>
                  </div>
                </div>

                <!-- Skills Required cards -->
                <div>
                  <h4 class="font-poppins text-base font-bold text-gray-950 mb-3">
                    Keahlian yang Dibutuhkan
                  </h4>
                  <div class="flex flex-col gap-3">
                    <div 
                      v-for="(skill, index) in product.skills" 
                      :key="index"
                      class="p-4 rounded-[18px] border transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-1.5"
                      :class="skill.color"
                    >
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold font-inter tracking-wide uppercase px-2.5 py-0.5 rounded-md border border-current bg-white/60">
                          {{ skill.name }}
                        </span>
                      </div>
                      <p class="font-inter text-xs leading-relaxed opacity-85">
                        {{ skill.desc }}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- Modal Footer button -->
          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-center">
            <button
              type="button"
              @click="$emit('use-idea')"
              class="w-full border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30] hover:text-white py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 group cursor-pointer focus:outline-none"
            >
              Gunakan Ide Ini
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal Transitions */
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
  transform: scale(0.92);
  opacity: 0;
}
</style>

<script setup lang="ts">
interface TimelineStep {
  id: number
  title: string
  description: string
  date: string
  status: 'completed' | 'in_progress' | 'pending'
}

defineProps<{
  steps: TimelineStep[]
}>()

defineEmits<{
  (e: 'add-progress'): void
}>()
</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left flex flex-col h-full">
    
    <!-- Header -->
    <div class="flex items-center justify-between gap-4 mb-8">
      <h3 class="font-poppins text-lg md:text-xl font-bold text-gray-950">
        Progres Pengerjaan
      </h3>

      <!-- Tambah Progres Button -->
      <button
        type="button"
        @click="$emit('add-progress')"
        class="border border-[#7A4D30]/60 hover:border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 px-4 py-2 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center gap-1 cursor-pointer focus:outline-none"
      >
        <!-- Plus Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Progres
      </button>
    </div>

    <!-- Timeline Stepper List -->
    <div class="relative flex-grow pl-8 border-l-2 border-gray-100 space-y-8 pb-2 ml-4">
      <div 
        v-for="(step, idx) in steps" 
        :key="step.id"
        class="relative"
      >
        <!-- Circle indicator -->
        <span 
          class="absolute -left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold font-inter text-xs shadow-sm"
          :class="[
            step.status === 'completed' 
              ? 'bg-[#10B981] text-white border-4 border-green-50' 
              : step.status === 'in_progress'
                ? 'bg-[#7A4D30] text-white border-4 border-amber-50'
                : 'bg-gray-100 text-gray-400 border-4 border-white'
          ]"
        >
          <!-- Show checklist icon for completed steps -->
          <img 
            v-if="step.status === 'completed'" 
            src="/images/icons/checklist_icon.svg" 
            alt="Checked" 
            class="w-4 h-4" 
          />
          <!-- Show step index/number for other states -->
          <span v-else>{{ idx + 1 }}</span>
        </span>

        <!-- Step content -->
        <div class="text-left space-y-1">
          <div class="flex items-center justify-between gap-3">
            <h4 
              class="font-poppins text-sm md:text-base font-bold transition-colors"
              :class="[step.status === 'pending' ? 'text-gray-400 font-medium' : 'text-gray-950']"
            >
              {{ step.title }}
            </h4>
            
            <!-- Timing status badge -->
            <span 
              v-if="step.date"
              class="text-[10px] font-bold font-inter tracking-wide px-2.5 py-1 rounded"
              :class="[
                step.status === 'completed'
                  ? 'bg-gray-100 text-gray-500'
                  : step.status === 'in_progress'
                    ? 'bg-[#7A4D30]/10 text-[#7A4D30]'
                    : 'bg-gray-50 text-gray-400 font-medium'
              ]"
            >
              {{ step.date }}
            </span>
          </div>

          <!-- Description (if not pending) -->
          <p 
            v-if="step.status !== 'pending' && step.description"
            class="font-inter text-xs leading-relaxed text-gray-500 max-w-xl"
          >
            {{ step.description }}
          </p>

          <!-- Underline container for in-progress step content in screenshot -->
          <div 
            v-if="step.status === 'in_progress' && step.description" 
            class="mt-3 p-4 bg-[#FAF8F5] border border-[#7A4D30]/20 rounded-2xl"
          >
            <p class="font-inter text-xs text-gray-600 leading-relaxed italic">
              "{{ step.description }}"
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

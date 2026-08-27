<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  skills: string[]
}>()

const emit = defineEmits<{
  (e: 'update:skills', newVal: string[]): void
}>()

const isAdding = ref(false)
const newSkill = ref('')

const handleAddSkill = () => {
  const trimmed = newSkill.value.trim()
  if (!trimmed) {
    isAdding.value = false
    return
  }

  // Prevent duplicate
  if (!props.skills.includes(trimmed)) {
    const updated = [...props.skills, trimmed]
    emit('update:skills', updated)
  }

  newSkill.value = ''
  isAdding.value = false
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3.5 text-left">
    
    <span class="font-poppins text-sm md:text-base font-bold text-gray-950 pr-1 select-none">
      Keahlian & Material :
    </span>

    <!-- Skills pills list -->
    <div class="flex flex-wrap items-center gap-2.5">
      <span 
        v-for="skill in skills" 
        :key="skill"
        class="inline-flex items-center px-4 py-2 rounded-full border border-gray-150 text-gray-700 text-xs font-bold font-inter select-none bg-white hover:border-[#7A4D30]/30 transition-colors"
      >
        {{ skill }}
      </span>

      <!-- Inline Input to add a new skill tag -->
      <div v-if="isAdding" class="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#7A4D30]/20 rounded-full px-3 py-1">
        <input
          v-model="newSkill"
          type="text"
          placeholder="Keahlian baru..."
          class="bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none w-24 font-inter"
          @keydown.enter="handleAddSkill"
          @blur="handleAddSkill"
          focus
          ref="inputEl"
        />
        <button
          type="button"
          @click="handleAddSkill"
          class="text-[#7A4D30] hover:text-[#683E25] p-0.5 rounded focus:outline-none cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </button>
      </div>

      <!-- Add Skill trigger button -->
      <button
        v-else
        type="button"
        @click="isAdding = true"
        class="border border-dashed border-[#7A4D30]/60 hover:border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30]/5 py-2 px-4.5 rounded-full text-xs font-bold font-inter transition-all duration-300 flex items-center gap-1 cursor-pointer focus:outline-none"
      >
        <!-- Plus icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Keahlian
      </button>
    </div>

  </div>
</template>

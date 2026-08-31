<script setup lang="ts">
defineProps<{
  skills: string[]
}>()
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
    </div>

  </div>
</template>

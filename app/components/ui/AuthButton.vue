<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'submit',
  disabled: false,
  loading: false
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full h-14 bg-[#7A4D30] hover:bg-[#6A3F25] active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed text-white font-semibold text-base rounded-full shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
  >
    <!-- Loading Spinner -->
    <svg 
      v-if="loading" 
      class="animate-spin h-5 w-5 text-white" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    
    <span v-else>
      <slot />
    </span>
  </button>
</template>

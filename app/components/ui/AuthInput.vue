<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  autocomplete: 'on'
})

// Vue 3.4+ native two-way binding using defineModel
const model = defineModel<string>({ default: '' })

// Toggle password visibility
const showPassword = ref(false)
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>

<template>
  <div class="w-full">
    <label 
      :for="id" 
      class="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide font-inter"
    >
      {{ label }}
    </label>
    <div class="relative w-full">
      <input
        :id="id"
        v-model="model"
        :type="inputType"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        class="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-[14px] px-5 py-4 pr-12 text-[#1A1A1A] placeholder-gray-400 text-sm md:text-base focus:border-[#7A4D30] focus:bg-white focus:outline-none transition-all duration-200 shadow-inner/5 font-inter"
      />
      <!-- Eye Icon Button for toggle password -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none select-none"
        tabindex="-1"
      >
        <!-- Eye Open (when password is shown) -->
        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 0 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
        <!-- Eye Closed (when password is hidden) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

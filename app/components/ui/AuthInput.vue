<script setup lang="ts">
interface Props {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  autocomplete: 'on'
})

// Vue 3.4+ native two-way binding using defineModel
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="w-full">
    <label 
      :for="id" 
      class="block text-sm font-semibold text-[#1A1A1A] mb-2 tracking-wide"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      class="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded-[14px] px-5 py-4 text-[#1A1A1A] placeholder-gray-400 text-sm md:text-base focus:border-[#7A4D30] focus:bg-white focus:outline-none transition-all duration-200 shadow-inner/5"
    />
  </div>
</template>

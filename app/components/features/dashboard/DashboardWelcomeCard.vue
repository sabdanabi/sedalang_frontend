<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  userName: string
  isAnalyzing: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: { promptText: string; selectedFile: File | null; previewImage: string | null }): void
}>()

const promptText = ref('')
const selectedFile = ref<File | null>(null)
const previewImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Handle trigger file upload
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Handle file change & validate only images
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // Validate file type is image
    if (!file.type.startsWith('image/')) {
      alert('File tidak valid! Hanya diperbolehkan menambahkan file gambar.')
      // Reset input
      target.value = ''
      return
    }

    selectedFile.value = file
    
    // Create image preview url
    const reader = new FileReader()
    reader.onload = (event) => {
      previewImage.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Remove selected image
const removeSelectedImage = () => {
  selectedFile.value = null
  previewImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Send prompt / file to parent
const handleSendPrompt = () => {
  if (!promptText.value.trim() && !selectedFile.value) {
    alert('Silakan masukkan pertanyaan atau unggah foto terlebih dahulu.')
    return
  }

  emit('submit', {
    promptText: promptText.value,
    selectedFile: selectedFile.value,
    previewImage: previewImage.value
  })
}
</script>

<template>
  <div class="bg-white border w-full border-[#EAEAEA] rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col items-center justify-center text-center">
    
    <div class="mb-6">
      <h2 class="font-poppins text-2xl md:text-3xl font-bold text-gray-950">
        Selamat Datang, <span class="text-[#7A4D30]">{{ userName }}</span>
      </h2>
      <p class="font-inter text-sm md:text-base text-gray-400 mt-1">
        Kita mulai mengerjakan dari mana hari ini?
      </p>
    </div>

    <!-- Interactive Textarea Container -->
    <div class="w-full border-2 border-[#849CFC]/70 hover:border-[#849CFC] focus-within:border-[#5A80F9] focus-within:ring-4 focus-within:ring-[#5A80F9]/10 rounded-[24px] p-4 bg-white transition-all duration-300 flex flex-col relative text-left">
      
      <!-- Textarea Prompt -->
      <textarea
        v-model="promptText"
        rows="3"
        placeholder="Tanyakan apa saja disini..."
        :disabled="isAnalyzing"
        class="w-full bg-transparent text-gray-800 placeholder-gray-400 text-sm md:text-base outline-none resize-none font-inter leading-relaxed disabled:opacity-60"
        @keydown.enter.prevent="handleSendPrompt"
      ></textarea>

      <!-- File Upload & Actions Row -->
      <div class="flex items-center justify-between mt-4 border-t border-gray-100 pt-3">
        
        <!-- Left Action: Plus Button & Upload Preview -->
        <div class="flex items-center gap-3">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
          <button
            type="button"
            @click="triggerFileInput"
            :disabled="isAnalyzing"
            class="w-10 h-10 rounded-full border border-gray-200 hover:border-[#7A4D30]/40 flex items-center justify-center text-gray-400 hover:text-[#7A4D30] bg-white transition-all duration-200 hover:bg-[#7A4D30]/5 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Tambah File Gambar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <!-- Thumbnail Image Preview -->
          <div v-if="previewImage" class="relative flex items-center bg-gray-50 border border-gray-100 rounded-lg p-1.5 pr-8">
            <img :src="previewImage" alt="Preview" class="w-8 h-8 object-cover rounded-md" />
            <span class="text-[11px] text-gray-500 ml-2 max-w-[120px] truncate font-inter">
              {{ selectedFile?.name }}
            </span>
            <button
              type="button"
              @click="removeSelectedImage"
              :disabled="isAnalyzing"
              class="absolute -top-1.5 -right-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full w-4.5 h-4.5 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-2.5 h-2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Right Action: Submit Button -->
        <button
          type="button"
          @click="handleSendPrompt"
          :disabled="isAnalyzing"
          class="w-10 h-10 rounded-full bg-[#7A4D30] hover:bg-[#6A3F25] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          title="Kirim"
        >
          <!-- Spinner when analyzing -->
          <svg v-if="isAnalyzing" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <!-- Send Icon -->
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8782 5.3202C15.9311 5.48868 14.6542 5.9126 12.8622 6.50994L8.80543 7.86219C7.36446 8.34251 6.32075 8.69093 5.58356 9.00448C4.81284 9.33228 4.53867 9.56077 4.44962 9.71394C4.17536 10.1857 4.17536 10.7684 4.44962 11.2401C4.53867 11.3933 4.81284 11.6218 5.58356 11.9496C6.32075 12.2632 7.36446 12.6116 8.80543 13.0919C8.82818 13.0995 8.85065 13.107 8.87284 13.1143C9.18015 13.2166 9.43405 13.301 9.65589 13.417L13.9653 9.15514C14.2096 8.9136 14.6033 8.91578 14.84 9.16001C15.0864 9.40424 15.0842 9.79804 14.84 10.0396L10.5495 14.2827C10.6834 14.519 10.7739 14.7911 10.8857 15.1271C10.893 15.1493 10.9005 15.1718 10.9081 15.1946C11.3884 16.6355 11.7368 17.6793 12.0504 18.4164C12.3782 19.1872 12.6066 19.4613 12.7599 19.5504C13.2316 19.8247 13.8143 19.8247 14.2861 19.5504C14.4392 19.4613 14.6677 19.1872 14.9955 18.4164C15.3091 17.6793 15.6575 16.6355 16.1378 15.1946L17.4901 11.1378C18.0874 9.3458 18.5113 8.06889 18.6798 7.12176C18.8491 6.17012 18.7197 5.7659 18.4769 5.52309C18.2341 5.28028 17.8299 5.15091 16.8782 5.3202ZM16.6604 4.0955C17.7146 3.90797 18.664 3.95095 19.3565 4.6435C20.0491 5.33605 20.092 6.28546 19.9045 7.33963C19.7181 8.38742 19.2636 9.75098 18.6881 11.4773L17.3079 15.6179C16.8396 17.0227 16.4757 18.1144 16.1402 18.9033C15.8165 19.6643 15.4571 20.3084 14.9113 20.6258C14.053 21.1247 12.9929 21.1247 12.1347 20.6258C11.5887 20.3084 11.2294 19.6643 10.9056 18.9033C10.5701 18.1144 10.2063 17.0227 9.73797 15.6179L9.72799 15.5879C9.56393 15.0957 9.51392 14.9622 9.44307 14.8564C9.36378 14.738 9.26203 14.6363 9.14358 14.5569C9.03775 14.4861 8.90425 14.4361 8.41206 14.272L8.38208 14.262C6.97724 13.7938 5.88565 13.4299 5.09671 13.0944C4.33568 12.7706 3.69158 12.4113 3.37423 11.8653C2.87526 11.0071 2.87526 9.94704 3.37423 9.08876C3.69158 8.54286 4.33568 8.18347 5.09671 7.85979C5.88566 7.52422 6.97726 7.16036 8.38213 6.69207L12.5227 5.31189C14.2491 4.73642 15.6126 4.28189 16.6604 4.0955Z" fill="currentColor"/>
          </svg>
        </button>

      </div>

    </div>

  </div>
</template>

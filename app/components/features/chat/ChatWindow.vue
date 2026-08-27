<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Message {
  id: number
  text: string
  time: string
  isOutgoing: boolean
  avatar?: string
  imageUrl?: string | null
}

interface Conversation {
  id: number
  name: string
  subtitle: string
  latestMessage: string
  statusText: string
  statusColor: string
  statusBg: string
  time: string
  avatar: string
  online: boolean
  messages: Message[]
}

const props = defineProps<{
  conversation: Conversation | null
}>()

const emit = defineEmits<{
  (e: 'send-message', text: string, imageUrl?: string): void
  (e: 'open-proposal'): void
}>()

const messageInput = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Auto-scroll messages area to bottom on new message
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// Watch active conversation to scroll to bottom
watch(() => props.conversation?.messages?.length, () => {
  scrollToBottom()
}, { immediate: true })

const submitMessage = () => {
  if (!messageInput.value.trim()) return
  emit('send-message', messageInput.value.trim())
  messageInput.value = ''
}

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Data = e.target?.result as string
      // Emit with base64 image URL
      emit('send-message', `Sent an image: ${file.name}`, base64Data)
    }
    reader.readAsDataURL(file)
    
    // Clear input
    input.value = ''
  }
}
</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] h-full flex flex-col overflow-hidden">
    
    <!-- Header Block (If conversation active) -->
    <div v-if="conversation" class="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
      
      <!-- Partner Info -->
      <div class="flex items-center gap-3 text-left">
        <div class="relative">
          <img
            :src="conversation.avatar || '/images/landing_page_images/default_pp.webp'"
            :alt="conversation.name"
            class="w-12 h-12 rounded-full object-cover border border-gray-100"
          />
          <span
            v-if="conversation.online"
            class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
          ></span>
        </div>
        <div>
          <h3 class="font-poppins text-base font-bold text-gray-900 leading-none">
            {{ conversation.name }}
          </h3>
          <span class="text-[11px] text-[#7A4D30] font-semibold mt-1.5 inline-block leading-none">
            {{ conversation.subtitle }}
          </span>
        </div>
      </div>

      <!-- Action items -->
      <div class="flex items-center gap-3">
        <!-- Call Button -->
        <button
          type="button"
          class="w-10 h-10 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
          title="Telepon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.622k7.135 6.143v-.182A2.25 2.25 0 0019.5 3.75h-.318a2.25 2.25 0 00-2.25 2.25v.182c0 .497.102.983.302 1.432l3 6.6a2.25 2.25 0 002.25 1.432H21.75a2.25 2.25 0 002.25-2.25v-.182a2.25 2.25 0 00-2.25-2.25H21" />
            <!-- Clean simple phone icon path -->
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.622c0-1.27 1.17-2.23 2.405-1.921c.883.22 1.547.935 1.708 1.836c.264 1.488.75 2.923 1.442 4.254c.29.56.09 1.254-.45 1.62l-1.02.68c-.378.252-.477.756-.21 1.157c1.378 2.062 3.084 3.768 5.147 5.147c.401.267.905.168 1.157-.21l.68-1.02c.366-.54 1.06-.74 1.62-.45c1.331.692 2.766 1.178 4.254 1.442c.901.161 1.616.825 1.836 1.708c.31 1.235-.65 2.405-1.921 2.405c-8.91 0-16.13-7.22-16.13-16.13z" />
          </svg>
        </button>

        <!-- Proposal Button -->
        <button
          type="button"
          @click="$emit('open-proposal')"
          class="border border-[#7A4D30] text-[#7A4D30] hover:bg-[#7A4D30] hover:text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 group cursor-pointer focus:outline-none"
        >
          Buat Proposal
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </button>
      </div>

    </div>

    <!-- Active Chat Window Messages Body (If active) -->
    <div 
      ref="messageContainer"
      class="flex-grow overflow-y-auto p-6 space-y-6 bg-white"
    >
      <template v-if="conversation">
        <!-- Date Divider -->
        <div class="relative flex items-center justify-center my-6 select-none">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-100"></div>
          </div>
          <span class="relative bg-white px-4 text-[10px] font-bold font-inter tracking-widest text-gray-400 uppercase">
            TODAY
          </span>
        </div>

        <!-- Messages Bubble Row -->
        <div 
          v-for="msg in conversation.messages" 
          :key="msg.id"
          class="flex"
          :class="[msg.isOutgoing ? 'justify-end' : 'justify-start']"
        >
          <!-- Incoming message partner avatar -->
          <div v-if="!msg.isOutgoing" class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-3 mt-1">
            <img 
              :src="conversation.avatar || '/images/landing_page_images/default_pp.webp'" 
              alt="Partner avatar"
              class="w-full h-full object-cover" 
            />
          </div>

          <!-- Bubble wrapper -->
          <div class="max-w-[70%] flex flex-col" :class="[msg.isOutgoing ? 'items-end' : 'items-start']">
            <div 
              class="rounded-3xl p-4 text-sm font-inter leading-relaxed shadow-sm text-left"
              :class="[
                msg.isOutgoing 
                  ? 'bg-[#7A4D30] text-white rounded-tr-none' 
                  : 'bg-[#FAF8F5] text-gray-800 rounded-tl-none border border-gray-100/50'
              ]"
            >
              <div v-if="msg.imageUrl" class="mb-2">
                <img 
                  :src="msg.imageUrl" 
                  alt="Attachment Preview" 
                  class="max-w-full max-h-56 rounded-2xl object-cover border border-white/10 shadow-sm"
                />
              </div>
              <p v-if="msg.text && !msg.text.startsWith('Sent an image:')" class="whitespace-pre-wrap">{{ msg.text }}</p>
            </div>
            <!-- Timestamp -->
            <span class="text-[10px] text-gray-400 mt-1.5 font-medium font-inter select-none">
              {{ msg.time }}
            </span>
          </div>
        </div>
      </template>

      <!-- Empty state layout -->
      <div v-else class="h-full flex flex-col items-center justify-center text-center py-20 select-none">
        <div class="w-16 h-16 rounded-full bg-[#7A4D30]/5 flex items-center justify-center text-[#7A4D30]/30 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        <h4 class="font-poppins text-base font-bold text-gray-900">Belum ada obrolan aktif</h4>
        <p class="font-inter text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
          Pilih salah satu pesan masuk di sebelah kiri untuk melihat percakapan.
        </p>
      </div>

    </div>

    <!-- Active Input Box Footer (If active) -->
    <div v-if="conversation" class="p-6 border-t border-gray-100 bg-white flex-shrink-0">
      <form 
        @submit.prevent="submitMessage"
        class="w-full bg-[#FAF8F5]/80 border border-gray-100 focus-within:border-[#7A4D30]/40 focus-within:bg-white rounded-3xl p-2.5 flex items-center transition-all duration-300 gap-3"
      >
        <!-- Hidden file input restricted to image format only -->
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          class="hidden"
          @change="onFileSelected"
        />

        <!-- Attachment Clip Trigger Button -->
        <button
          type="button"
          @click="triggerFileSelect"
          class="w-10 h-10 rounded-full text-gray-400 hover:text-gray-600 flex items-center justify-center hover:bg-gray-50 cursor-pointer focus:outline-none"
          title="Lampirkan File Gambar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32a1.5 1.5 0 01-2.121-2.121L16.29 6.308" />
          </svg>
        </button>

        <!-- Message input text area -->
        <input
          v-model="messageInput"
          type="text"
          placeholder="Tulis pesan disini.."
          class="flex-grow bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none w-full font-inter"
        />

        <!-- Submit Send Button -->
        <button
          type="submit"
          class="w-10 h-10 rounded-full bg-[#7A4D30] hover:bg-[#6A3F25] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none flex-shrink-0"
          title="Kirim"
        >
          <!-- Using custom Send icon from public/images/icons/solar_plane-outline.svg -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8782 5.3202C15.9311 5.48868 14.6542 5.9126 12.8622 6.50994L8.80543 7.86219C7.36446 8.34251 6.32075 8.69093 5.58356 9.00448C4.81284 9.33228 4.53867 9.56077 4.44962 9.71394C4.17536 10.1857 4.17536 10.7684 4.44962 11.2401C4.53867 11.3933 4.81284 11.6218 5.58356 11.9496C6.32075 12.2632 7.36446 12.6116 8.80543 13.0919C8.82818 13.0995 8.85065 13.107 8.87284 13.1143C9.18015 13.2166 9.43405 13.301 9.65589 13.417L13.9653 9.15514C14.2096 8.9136 14.6033 8.91578 14.84 9.16001C15.0864 9.40424 15.0842 9.79804 14.84 10.0396L10.5495 14.2827C10.6834 14.519 10.7739 14.7911 10.8857 15.1271C10.893 15.1493 10.9005 15.1718 10.9081 15.1946C11.3884 16.6355 11.7368 17.6793 12.0504 18.4164C12.3782 19.1872 12.6066 19.4613 12.7599 19.5504C13.2316 19.8247 13.8143 19.8247 14.2861 19.5504C14.4392 19.4613 14.6677 19.1872 14.9955 18.4164C15.3091 17.6793 15.6575 16.6355 16.1378 15.1946L17.4901 11.1378C18.0874 9.3458 18.5113 8.06889 18.6798 7.12176C18.8491 6.17012 18.7197 5.7659 18.4769 5.52309C18.2341 5.28028 17.8299 5.15091 16.8782 5.3202ZM16.6604 4.0955C17.7146 3.90797 18.664 3.95095 19.3565 4.6435C20.0491 5.33605 20.092 6.28546 19.9045 7.33963C19.7181 8.38742 19.2636 9.75098 18.6881 11.4773L17.3079 15.6179C16.8396 17.0227 16.4757 18.1144 16.1402 18.9033C15.8165 19.6643 15.4571 20.3084 14.9113 20.6258C14.053 21.1247 12.9929 21.1247 12.1347 20.6258C11.5887 20.3084 11.2294 19.6643 10.9056 18.9033C10.5701 18.1144 10.2063 17.0227 9.73797 15.6179L9.72799 15.5879C9.56393 15.0957 9.51392 14.9622 9.44307 14.8564C9.36378 14.738 9.26203 14.6363 9.14358 14.5569C9.03775 14.4861 8.90425 14.4361 8.41206 14.272L8.38208 14.262C6.97724 13.7938 5.88565 13.4299 5.09671 13.0944C4.33568 12.7706 3.69158 12.4113 3.37423 11.8653C2.87526 11.0071 2.87526 9.94704 3.37423 9.08876C3.69158 8.54286 4.33568 8.18347 5.09671 7.85979C5.88566 7.52422 6.97726 7.16036 8.38213 6.69207L12.5227 5.31189C14.2491 4.73642 15.6126 4.28189 16.6604 4.0955Z" fill="currentColor"/>
          </svg>
        </button>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
}

const props = defineProps<{
  conversations: Conversation[]
  activeConversationId: number
}>()

defineEmits<{
  (e: 'select-conversation', conversation: Conversation): void
}>()

const searchQuery = ref('')
</script>

<template>
  <div class="bg-white border border-[#EAEAEA] rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] h-full flex flex-col">
    <!-- Header -->
    <div class="mb-6 text-left">
      <h2 class="font-poppins text-2xl font-bold text-gray-950">
        Pesan
      </h2>
    </div>

    <!-- Search Input -->
    <div class="relative mb-6">
      <span class="absolute inset-y-0 left-4 flex items-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </span>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search conversations..."
        class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
      />
    </div>

    <!-- Conversations List -->
    <div class="flex-grow overflow-y-auto space-y-3 pr-1">
      <div
        v-for="convo in conversations"
        :key="convo.id"
        @click="$emit('select-conversation', convo)"
        class="flex gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none"
        :class="[
          activeConversationId === convo.id
            ? 'border-[#7A4D30]/20 bg-[#7A4D30]/5'
            : 'border-transparent hover:bg-gray-50'
        ]"
      >
        <!-- Profile Pic with Online Dot Indicator -->
        <div class="relative flex-shrink-0">
          <img
            :src="convo.avatar || '/images/landing_page_images/default_pp.webp'"
            :alt="convo.name"
            class="w-12 h-12 rounded-full object-cover border border-gray-100"
          />
          <span
            v-if="convo.online"
            class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
          ></span>
        </div>

        <!-- Convo Text Details -->
        <div class="flex-grow flex flex-col justify-between overflow-hidden">
          <div class="flex justify-between items-baseline gap-2">
            <span class="font-poppins text-sm font-bold text-gray-900 truncate">
              {{ convo.name }}
            </span>
            <span class="text-[10px] text-gray-400 font-medium font-inter flex-shrink-0">
              {{ convo.time }}
            </span>
          </div>

          <p class="font-inter text-xs text-gray-500 truncate mt-1 leading-relaxed">
            {{ convo.latestMessage }}
          </p>

          <!-- Status badge row -->
          <div class="mt-2.5">
            <span
              class="inline-block text-[10px] font-bold font-inter tracking-wide px-2.5 py-0.5 rounded-md"
              :class="[convo.statusBg, convo.statusColor]"
            >
              {{ convo.statusText }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

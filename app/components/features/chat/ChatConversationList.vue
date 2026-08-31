<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { ChatRoom } from '~/stores/chat'
import { getAvatarUrl } from '~/composables/useAvatar'

const props = defineProps<{
  rooms: ChatRoom[]
  activeRoomId: string | null
}>()

const emit = defineEmits<{
  (e: 'select-room', room: ChatRoom): void
}>()

const searchQuery = ref('')
const authStore = useAuthStore()

// Filter search query and deduplicate conversations by partner ID
const filteredRooms = computed(() => {
  const seenPartners = new Set<string>()
  const result: ChatRoom[] = []
  const loggedInUserId = authStore.user?.id

  for (const room of props.rooms) {
    const isCustomer = room.userId === loggedInUserId
    const partnerId = isCustomer 
      ? (room.craftsmanId || room.craftsman?.id || '') 
      : (room.userId || room.user?.id || '')

    // Apply search filter if query exists
    if (searchQuery.value.trim()) {
      const partnerName = getPartnerName(room).toLowerCase()
      if (!partnerName.includes(searchQuery.value.trim().toLowerCase())) {
        continue
      }
    }

    if (!seenPartners.has(partnerId)) {
      seenPartners.add(partnerId)
      result.push(room)
    }
  }
  return result
})

// Helper functions for dynamic room details
const getPartnerName = (room: ChatRoom) => {
  const isCustomer = room.userId === authStore.user?.id
  if (isCustomer) {
    return room.craftsman?.user?.fullName || 'Pengrajin'
  } else {
    return room.user?.fullName || 'Pengguna'
  }
}

const getPartnerAvatar = (room: ChatRoom) => {
  const isCustomer = room.userId === authStore.user?.id
  const rawUrl = isCustomer ? room.craftsman?.user?.avatarUrl : room.user?.avatarUrl
  const rawName = isCustomer 
    ? (room.craftsman?.user?.fullName || 'Pengrajin') 
    : (room.user?.fullName || 'Pengguna')
  return getAvatarUrl(rawUrl, rawName)
}

const getPartnerSubtitle = (room: ChatRoom) => {
  const isCustomer = room.userId === authStore.user?.id
  if (isCustomer) {
    return `${room.craftsman?.craftType || 'Kerajinan'} • Online`
  } else {
    return 'Pemilik Limbah • Online'
  }
}

const formatRoomTime = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
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
        placeholder="Cari obrolan..."
        class="w-full bg-[#FAF8F5]/80 border border-gray-100 hover:border-gray-250 focus:border-[#7A4D30]/40 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all font-inter"
      />
    </div>

    <!-- Rooms List -->
    <div class="flex-grow overflow-y-auto space-y-3 pr-1">
      <div
        v-for="room in filteredRooms"
        :key="room.id"
        @click="$emit('select-room', room)"
        class="flex gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none relative"
        :class="[
          activeRoomId === room.id
            ? 'border-[#7A4D30]/20 bg-[#7A4D30]/5'
            : 'border-transparent hover:bg-gray-50'
        ]"
      >
        <!-- Profile Pic with Online Dot Indicator -->
        <div class="relative flex-shrink-0">
          <img
            :src="getPartnerAvatar(room)"
            :alt="getPartnerName(room)"
            class="w-12 h-12 rounded-full object-cover border border-gray-100"
          />
          <span
            class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
          ></span>
        </div>

        <!-- Room Text Details -->
        <div class="flex-grow flex flex-col justify-between overflow-hidden">
          <div class="flex justify-between items-baseline gap-2">
            <span class="font-poppins text-sm font-bold text-gray-900 truncate">
              {{ getPartnerName(room) }}
            </span>
            <span class="text-[10px] text-gray-400 font-medium font-inter flex-shrink-0">
              {{ formatRoomTime(room.lastMessage?.createdAt || room.createdAt) }}
            </span>
          </div>

          <p class="font-inter text-xs text-gray-500 truncate mt-1 leading-relaxed">
            {{ room.lastMessage?.content || 'Belum ada pesan' }}
          </p>

          <!-- Idea Title Badge -->
          <div class="mt-2.5">
            <span
              class="inline-block text-[10px] font-bold font-inter tracking-wide px-2.5 py-0.5 rounded-md bg-[#7A4D30]/5 text-[#7A4D30] border border-[#7A4D30]/10 max-w-full truncate"
            >
              {{ room.idea?.ideaTitle || 'Diskusi Daur Ulang' }}
            </span>
          </div>
        </div>

        <!-- Unread Badge Indicator -->
        <div 
          v-if="room.unreadCount > 0" 
          class="absolute right-4 bottom-4 w-5 h-5 bg-[#7A4D30] text-white text-[10px] font-bold font-inter rounded-full flex items-center justify-center shadow-md animate-bounce"
        >
          {{ room.unreadCount }}
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredRooms.length === 0" class="py-12 text-center">
        <p class="text-xs text-gray-400 font-inter">Belum ada obrolan aktif</p>
      </div>
    </div>
  </div>
</template>

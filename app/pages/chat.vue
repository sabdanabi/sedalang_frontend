<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '~/stores/chat'
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const chatStore = useChatStore()
const authStore = useAuthStore()

const showProposalModal = ref(false)

onMounted(async () => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    // Initialize current user state if not loaded
    if (!authStore.user) {
      try {
        await authStore.getMe()
      } catch (err) {
        console.error('Failed to get current user details:', err)
      }
    }

    // Initialize socket connection
    chatStore.initializeSocket()

    // Load active rooms list
    try {
      await chatStore.fetchRooms()
    } catch (err) {
      console.error('Failed to fetch rooms:', err)
    }

    // Auto-initiate room if query params exist
    const craftsmanId = route.query.craftsmanId as string
    const ideaId = route.query.ideaId as string
    const craftsmanParam = route.query.craftsman as string

    if (craftsmanId && ideaId) {
      try {
        const room = await chatStore.createOrGetRoom(craftsmanId, ideaId)
        chatStore.joinRoom(room.id)
        await chatStore.fetchMessages(room.id)
      } catch (err) {
        console.error('Failed to auto-initiate chat room:', err)
      }
    } else if (craftsmanParam) {
      // Find existing room matching the craftsman name
      const room = chatStore.rooms.find(r => 
        (r.craftsman?.user?.fullName || '').toLowerCase().includes(craftsmanParam.toLowerCase()) ||
        (r.user?.fullName || '').toLowerCase().includes(craftsmanParam.toLowerCase())
      )
      if (room) {
        chatStore.joinRoom(room.id)
        await chatStore.fetchMessages(room.id)
      } else if (chatStore.rooms.length > 0) {
        const firstRoom = chatStore.rooms[0]
        chatStore.joinRoom(firstRoom.id)
        await chatStore.fetchMessages(firstRoom.id)
      }
    } else {
      // Default select the first room if any
      if (chatStore.rooms.length > 0) {
        const firstRoom = chatStore.rooms[0]
        chatStore.joinRoom(firstRoom.id)
        await chatStore.fetchMessages(firstRoom.id)
      }
    }
  }
})

onUnmounted(() => {
  chatStore.disconnectSocket()
})

const selectConversation = async (room: any) => {
  chatStore.joinRoom(room.id)
  await chatStore.fetchMessages(room.id)
}

const handleSendMessage = (text: string) => {
  if (chatStore.activeRoomId) {
    chatStore.sendMessage(chatStore.activeRoomId, text)
  }
}

const handleProposalSubmit = async (proposalData: any) => {
  showProposalModal.value = false
  if (chatStore.activeRoomId) {
    try {
      // Safe Date parsing
      let completionDate = new Date(proposalData.estimate)
      if (isNaN(completionDate.getTime())) {
        completionDate = new Date()
        completionDate.setDate(completionDate.getDate() + 7)
      }
      const estimatedCompletionDate = completionDate.toISOString().split('T')[0]

      // Map shipping options: "Ambil Sendiri" -> "DROP_OFF", others -> "GOSEND"
      const deliveryMethod = proposalData.shippingMethod === 'Ambil Sendiri' ? 'DROP_OFF' : 'GOSEND'

      await chatStore.createProposal(chatStore.activeRoomId, {
        productName: proposalData.productName,
        price: Number(proposalData.price) || 0,
        materialsNeeded: proposalData.materialName.split(',').map((s: string) => s.trim()).filter(Boolean),
        deliveryMethod,
        estimatedCompletionDate,
        paymentMethod: proposalData.paymentMethod || 'Transfer Bank'
      })
    } catch (err: any) {
      alert('Gagal membuat proposal: ' + (err.message || err))
    }
  }
}
</script>

<template>
  <div class="h-[calc(100vh-80px)] bg-white py-6 overflow-hidden">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20 h-full min-h-0">
      
      <!-- Split-Pane Chat Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-stretch min-h-0">
        
        <!-- Left Column: Messages conversations threads list (lg:col-span-4) -->
        <div class="lg:col-span-4 h-full min-h-0">
          <FeaturesChatConversationList
            :rooms="chatStore.rooms"
            :activeRoomId="chatStore.activeRoomId"
            @select-room="selectConversation"
          />
        </div>

        <!-- Right Column: Conversational interface window (lg:col-span-8) -->
        <div class="lg:col-span-8 h-full min-h-0">
          <FeaturesChatWindow
            :room="chatStore.activeRoom"
            :timeline="chatStore.chatTimeline"
            @send-message="handleSendMessage"
            @open-proposal="showProposalModal = true"
          />
        </div>

      </div>

    </div>

    <!-- Proposal Creation Pop-up Modal -->
    <FeaturesChatProposalModal
      :show="showProposalModal"
      @close="showProposalModal = false"
      @submit="handleProposalSubmit"
    />
  </div>
</template>

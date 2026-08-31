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
    const craftsmanNameParam = route.query.craftsmanName as string

    if (craftsmanId) {
      try {
        const existingRoom = chatStore.rooms.find(r => 
          r.craftsmanId === craftsmanId || 
          r.craftsman?.id === craftsmanId || 
          r.craftsman?.userId === craftsmanId
        )
        if (existingRoom) {
          // Move existing conversation to the top of the sidebar list
          const index = chatStore.rooms.findIndex(r => r.id === existingRoom.id)
          if (index > 0) {
            chatStore.rooms.splice(index, 1)
            chatStore.rooms.unshift(existingRoom)
          }
          chatStore.joinRoom(existingRoom.id)
          await chatStore.fetchMessages(existingRoom.id)
        } else {
          // Try to get or create room
          let activeIdeaId = ideaId || undefined
          
          try {
            const room = await chatStore.createOrGetRoom(craftsmanId, activeIdeaId)
            chatStore.joinRoom(room.id)
            await chatStore.fetchMessages(room.id)
          } catch (createErr) {
            console.error('Failed to create/get chat room:', createErr)
            if (chatStore.rooms.length > 0) {
              const firstRoom = chatStore.rooms[0]
              chatStore.joinRoom(firstRoom.id)
              await chatStore.fetchMessages(firstRoom.id)
            }
          }
        }
      } catch (err) {
        console.error('Failed to auto-initiate chat room:', err)
      }
    } else if (craftsmanParam || craftsmanNameParam) {
      const searchName = (craftsmanParam || craftsmanNameParam).toLowerCase()
      // Find existing room matching the craftsman name
      const room = chatStore.rooms.find(r => 
        (r.craftsman?.user?.fullName || '').toLowerCase().includes(searchName) ||
        (r.user?.fullName || '').toLowerCase().includes(searchName)
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
  if (!chatStore.activeRoomId) return
  try {
    // Parse and validate completion date — fallback to 7 days from now
    let completionDate = new Date(proposalData.estimatedCompletionDate)
    if (isNaN(completionDate.getTime())) {
      completionDate = new Date()
      completionDate.setDate(completionDate.getDate() + 7)
    }
    const estimatedCompletionDate = completionDate.toISOString().split('T')[0]

    // Map shipping: 'Ambil Sendiri' -> 'DROP_OFF', semua lainnya (termasuk 'GOSEND') -> 'GOSEND'
    const deliveryMethod: 'GOSEND' | 'DROP_OFF' =
      proposalData.deliveryMethod === 'Ambil Sendiri' ? 'DROP_OFF' : 'GOSEND'

    await chatStore.createProposal(chatStore.activeRoomId, {
      productName: proposalData.productName,
      price: Number(proposalData.price) || 0,
      materialsNeeded: Array.isArray(proposalData.materialsNeeded)
        ? proposalData.materialsNeeded
        : String(proposalData.materialsNeeded).split(',').map((s: string) => s.trim()).filter(Boolean),
      deliveryMethod,
      estimatedCompletionDate,
      paymentMethod: proposalData.paymentMethod || 'Transfer Bank'
    })

    // Refresh proposals for the active room — endpoint may not exist,
    // but createProposal already pushed to local state
    // await chatStore.fetchProposals(chatStore.activeRoomId)
  } catch (err: any) {
    alert('Gagal membuat proposal: ' + (err.message || err))
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

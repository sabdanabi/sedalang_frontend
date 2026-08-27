<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// Check onboarding completed and load persisted chats on mount
onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    const saved = localStorage.getItem('sedalang_conversations')
    if (saved) {
      try {
        conversations.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse conversations data', e)
      }
    }
    
    // Sync active conversation reference
    syncActiveConversation()
  }
})

// Save helper
const saveConversations = () => {
  if (import.meta.client) {
    localStorage.setItem('sedalang_conversations', JSON.stringify(conversations.value))
  }
}

// Interfaces
interface Message {
  id: number
  text: string
  time: string
  isOutgoing: boolean
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

// Default conversation data matching mockup design
const defaultConversations: Conversation[] = [
  {
    id: 1,
    name: 'Dinda Permata',
    subtitle: 'KaryaLoka Craft • Online',
    latestMessage: 'Bagus, saya sudah melampirkan estimasi biaya',
    statusText: 'Menunggu',
    statusColor: 'text-amber-700',
    statusBg: 'bg-amber-50 border border-amber-200/50',
    time: '10:24 AM',
    avatar: '/images/landing_page_images/default_pp.webp',
    online: true,
    messages: [
      {
        id: 1,
        text: 'Halo Fikri! Saya sudah melihat foto botol kaca yang Anda kirim. Kami dapat mengolahnya menjadi lampu meja dekoratif seperti contoh yang Anda lihat pada halaman AI',
        time: '10:15 AM',
        isOutgoing: false
      },
      {
        id: 2,
        text: 'Bagus! Untuk membuat tiga lampu, kira-kira berapa botol yang dibutuhkan? Dan apakah komponen LED sudah disediakan?',
        time: '10:18 AM',
        isOutgoing: true
      },
      {
        id: 3,
        text: '“Biasanya kami membutuhkan 2 botol untuk setiap lampu agar hasilnya lebih kokoh. Ya, kami menyediakan LED putih hangat berkualitas. Berikut sketsa dasar pemasangan kabel yang saya usulka',
        time: '10:20 AM',
        isOutgoing: false
      }
    ]
  },
  {
    id: 2,
    name: 'Arif Setiawan',
    subtitle: 'Wood Artisan • Offline',
    latestMessage: 'Material kayu sudah siap untuk di proses',
    statusText: 'Dikonfirmasi',
    statusColor: 'text-green-700',
    statusBg: 'bg-green-50 border border-green-200/50',
    time: 'Yesterday',
    avatar: '/images/landing_page_images/default_pp.webp',
    online: false,
    messages: [
      {
        id: 1,
        text: 'Halo, untuk pengerjaan rak dinding kayunya bagaimana ya?',
        time: 'Wed, 2:00 PM',
        isOutgoing: true
      },
      {
        id: 2,
        text: 'Material kayu sudah siap untuk di proses. Saya akan mulai pemotongan besok pagi.',
        time: 'Wed, 3:30 PM',
        isOutgoing: false
      }
    ]
  },
  {
    id: 3,
    name: 'Siti Nurhaliza',
    subtitle: 'Clay Craft • Offline',
    latestMessage: 'Bisakah anda mengirim foto botol tambahan',
    statusText: 'Dalam diskusi',
    statusColor: 'text-[#7A4D30]',
    statusBg: 'bg-[#7A4D30]/5 border border-[#7A4D30]/20',
    time: 'Wed',
    avatar: '/images/landing_page_images/default_pp.webp',
    online: false,
    messages: [
      {
        id: 1,
        text: 'Bisakah anda mengirim foto botol tambahan untuk referensi saya?',
        time: 'Wed, 9:15 AM',
        isOutgoing: false
      }
    ]
  }
]

const conversations = ref<Conversation[]>(defaultConversations)
const activeConversationId = ref<number>(1)
const activeConversation = ref<Conversation | null>(null)
const showProposalModal = ref(false)

const syncActiveConversation = () => {
  const current = conversations.value.find(c => c.id === activeConversationId.value)
  activeConversation.value = current || null
}

const selectConversation = (convo: Conversation) => {
  activeConversationId.value = convo.id
  syncActiveConversation()
}

const handleSendMessage = (text: string, imageUrl?: string) => {
  const convo = conversations.value.find(c => c.id === activeConversationId.value)
  if (!convo) return

  const newMsg: Message = {
    id: Date.now(),
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isOutgoing: true,
    imageUrl: imageUrl || null
  }

  // Push message
  convo.messages.push(newMsg)
  convo.latestMessage = imageUrl ? '[Gambar]' : text
  convo.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  syncActiveConversation()
  saveConversations()
}

const handleProposalSubmit = (proposalData: any) => {
  showProposalModal.value = false

  const convo = conversations.value.find(c => c.id === activeConversationId.value)
  if (!convo) return

  const systemMsg: Message = {
    id: Date.now(),
    text: `Proposal Baru Dibuat! Produk: "${proposalData.productName}" | Estimasi: ${proposalData.estimate} | Harga: ${proposalData.price} | Pengiriman: ${proposalData.shippingMethod}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isOutgoing: true
  }

  convo.messages.push(systemMsg)
  convo.latestMessage = `Proposal dibuat: ${proposalData.productName}`
  convo.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  syncActiveConversation()
  saveConversations()
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
            :conversations="conversations"
            :activeConversationId="activeConversationId"
            @select-conversation="selectConversation"
          />
        </div>

        <!-- Right Column: Conversational interface window (lg:col-span-8) -->
        <div class="lg:col-span-8 h-full min-h-0">
          <FeaturesChatWindow
            :conversation="activeConversation"
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

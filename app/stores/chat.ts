import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApiFetch'
import { useCookie, useRuntimeConfig } from '#app'
import { io, type Socket } from 'socket.io-client'

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
  sender: {
    id: string
    fullName: string
    avatarUrl: string | null
  }
}

export interface ChatRoom {
  id: string
  userId: string
  craftsmanId: string
  ideaId: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    fullName: string
    avatarUrl: string | null
  }
  craftsman: {
    id: string
    userId: string
    location: string
    craftType: string
    user: {
      id: string
      fullName: string
      avatarUrl: string | null
    }
  }
  idea: {
    id: string
    ideaTitle: string
    imageUrl: string
  }
  lastMessage: {
    content: string
    createdAt: string
  } | null
  unreadCount: number
}

export interface Proposal {
  id: string
  roomId: string
  craftsmanId: string
  productName: string
  price: number
  materialsNeeded: string[]
  deliveryMethod: 'GOSEND' | 'DROP_OFF'
  estimatedCompletionDate: string
  paymentMethod: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

export interface CreateProposalPayload {
  productName: string
  price: number
  materialsNeeded: string[]
  deliveryMethod: 'GOSEND' | 'DROP_OFF'
  estimatedCompletionDate: string
  paymentMethod: string
}

export interface AcceptProposalResponse {
  proposal: Proposal
  order: {
    id: string
    proposalId: string
    userId: string
    craftsmanId: string
    productName: string
    price: number
    deliveryMethod: string
    status: string
    midtransOrderId: string
    midtransToken: string
    midtransRedirectUrl: string
  }
  midtransToken: string
  midtransRedirectUrl: string
}

interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const useChatStore = defineStore('chat', () => {
  const api = useApi()
  const tokenCookie = useCookie<string | null>('sedalang_token')
  
  const rooms = ref<ChatRoom[]>([])
  const activeRoomId = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])
  const proposals = ref<Proposal[]>([])
  
  const socket = ref<Socket | null>(null)
  const isLoading = ref(false)
  const error = ref('')

  // Computed: Get active room object
  const activeRoom = computed(() => {
    return rooms.value.find(r => r.id === activeRoomId.value) || null
  })

  // Helper to persist proposals in localStorage to survive browser refreshes/redirects
  const saveProposalsToStorage = (roomId: string) => {
    if (import.meta.client && roomId) {
      localStorage.setItem(`sedalang_proposals_${roomId}`, JSON.stringify(proposals.value))
    }
  }

  // Computed: Combined message and proposal timeline sorted chronologically
  const chatTimeline = computed(() => {
    const timeline: Array<{
      type: 'message' | 'proposal'
      id: string
      createdAt: string
      data: ChatMessage | Proposal
    }> = []

    messages.value.forEach(msg => {
      timeline.push({
        type: 'message',
        id: msg.id,
        createdAt: msg.createdAt,
        data: msg
      })
    })

    proposals.value.forEach(prop => {
      timeline.push({
        type: 'proposal',
        id: prop.id,
        createdAt: prop.createdAt,
        data: prop
      })
    })

    return timeline.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
  })

  // REST Action: List rooms
  const fetchRooms = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api('/api/v1/chat/rooms', {
        method: 'GET'
      }) as ApiResponse<ChatRoom[]>
      rooms.value = res.data || []
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat daftar obrolan'
      console.error('Error fetching rooms:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // REST Action: Create or get existing chat room
  const createOrGetRoom = async (craftsmanId: string, ideaId: string): Promise<ChatRoom> => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api('/api/v1/chat/rooms', {
        method: 'POST',
        body: { craftsmanId, ideaId }
      }) as ApiResponse<ChatRoom>
      
      // Add to rooms if not already there
      if (!rooms.value.some(r => r.id === res.data.id)) {
        rooms.value.unshift(res.data)
      }
      return res.data
    } catch (err: any) {
      const responseData = err.response?._data
      const detailedMessage = responseData?.message || err.message || 'Gagal membuat/membuka obrolan'
      error.value = detailedMessage
      console.error('Error creating chat room. Status:', err.response?.status || err.status, 'Response details:', responseData)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // REST Action: Fetch messages for active room
  const fetchMessages = async (roomId: string) => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api(`/api/v1/chat/rooms/${roomId}/messages`, {
        method: 'GET'
      }) as ApiResponse<ChatMessage[]>
      messages.value = res.data || []
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat histori pesan'
      console.error('Error fetching messages:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // REST Action: Fetch proposals for active room
  // NOTE: This endpoint may not exist on backend (404). Proposals are primarily
  // populated via createProposal() local push and socket newProposal events.
  const fetchProposals = async (roomId: string) => {
    try {
      console.log('[Chat] Fetching proposals for room:', roomId)
      const res = await api(`/api/v1/chat/rooms/${roomId}/proposals`, {
        method: 'GET'
      }) as ApiResponse<Proposal[]>
      console.log('[Chat] Proposals fetched:', res.data)
      proposals.value = res.data || []
      return res.data
    } catch (err: any) {
      // If endpoint doesn't exist (404) or fails, keep existing proposals intact
      // Proposals are already managed via createProposal() and socket events
      const status = err?.response?.status || err?.statusCode || err?.status
      if (status === 404) {
        console.warn('[Chat] fetchProposals: endpoint not available (404), using socket events instead')
      } else {
        console.error('[Chat] Error fetching proposals:', err)
      }
      // Do NOT reset proposals.value — preserve any existing proposals
    }
  }

  // REST Action: Create a new proposal
  const createProposal = async (roomId: string, payload: CreateProposalPayload): Promise<Proposal> => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api(`/api/v1/chat/rooms/${roomId}/proposals`, {
        method: 'POST',
        body: payload
      }) as ApiResponse<Proposal>
      
      // Update local proposals list
      if (!proposals.value.some(p => p.id === res.data.id)) {
        proposals.value.push(res.data)
        saveProposalsToStorage(roomId)
      }
      return res.data
    } catch (err: any) {
      const responseData = err.response?._data
      const detailedMessage = responseData?.message || err.message || 'Gagal membuat proposal'
      error.value = detailedMessage
      console.error('Error creating proposal:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // REST Action: Accept a proposal (PATCH)
  const acceptProposal = async (proposalId: string): Promise<AcceptProposalResponse> => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api(`/api/v1/chat/proposals/${proposalId}/accept`, {
        method: 'PATCH'
      }) as ApiResponse<AcceptProposalResponse>
      
      // Update local proposal status
      const localProp = proposals.value.find(p => p.id === proposalId)
      if (localProp) {
        localProp.status = 'ACCEPTED'
        saveProposalsToStorage(localProp.roomId)
      }
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Gagal menyetujui proposal'
      console.error('Error accepting proposal:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // REST Action: Reject a proposal (PATCH)
  const rejectProposal = async (proposalId: string): Promise<Proposal> => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api(`/api/v1/chat/proposals/${proposalId}/reject`, {
        method: 'PATCH'
      }) as ApiResponse<Proposal>
      
      // Update local proposal status
      const localProp = proposals.value.find(p => p.id === proposalId)
      if (localProp) {
        localProp.status = 'REJECTED'
        saveProposalsToStorage(localProp.roomId)
      }
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Gagal menolak proposal'
      console.error('Error rejecting proposal:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // WebSocket Action: Initialize Socket connection
  const initializeSocket = () => {
    if (socket.value) return

    const config = useRuntimeConfig()
    const apiBase = (config.public.apiBase || 'https://sedalangbe-production.up.railway.app') as string

    socket.value = io(apiBase, {
      auth: {
        token: tokenCookie.value
      },
      transports: ['websocket']
    })

    socket.value.on('connect', () => {
      console.log('Socket connected successfully. ID:', socket.value?.id)
      
      // Re-join active room if connection restored
      if (activeRoomId.value) {
        socket.value.emit('joinRoom', activeRoomId.value)
      }
    })

    socket.value.on('roomJoined', (data: { roomId: string }) => {
      console.log('Successfully joined room:', data.roomId)
    })

    // Listen for new messages via socket
    socket.value.on('newMessage', (msg: ChatMessage) => {
      console.log('Socket newMessage received:', msg)
      if (activeRoomId.value && msg.roomId === activeRoomId.value) {
        if (!messages.value.some(m => m.id === msg.id)) {
          messages.value.push(msg)
        }
      }

      // Update room lastMessage in the sidebar
      const room = rooms.value.find(r => r.id === msg.roomId)
      if (room) {
        room.lastMessage = {
          content: msg.content,
          createdAt: msg.createdAt
        }
        if (msg.roomId !== activeRoomId.value) {
          room.unreadCount++
        }
      }
    })

    // Listen for new proposals via socket
    socket.value.on('newProposal', (proposal: Proposal) => {
      console.log('[Socket] newProposal received:', proposal)
      // Accept proposal if it belongs to the active room (check roomId or fallback to activeRoom)
      const targetRoomId = (proposal as any).roomId || activeRoomId.value
      if (activeRoomId.value && targetRoomId === activeRoomId.value) {
        if (!proposals.value.some(p => p.id === proposal.id)) {
          proposals.value = [...proposals.value, proposal]
          saveProposalsToStorage(activeRoomId.value)
        }
      }
    })

    // Listen for proposal updates (status changes) via socket
    socket.value.on('proposalUpdated', (proposal: Proposal) => {
      console.log('[Socket] proposalUpdated received:', proposal)
      const targetRoomId = (proposal as any).roomId || activeRoomId.value
      if (activeRoomId.value && targetRoomId === activeRoomId.value) {
        const index = proposals.value.findIndex(p => p.id === proposal.id)
        if (index !== -1) {
          // Replace immutably to trigger Vue reactivity
          proposals.value = [
            ...proposals.value.slice(0, index),
            proposal,
            ...proposals.value.slice(index + 1)
          ]
        } else {
          proposals.value = [...proposals.value, proposal]
        }
        saveProposalsToStorage(activeRoomId.value)
      }
    })

    socket.value.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
    })
  }

  // WebSocket Action: Send raw text message
  const sendMessage = (roomId: string, content: string) => {
    if (!socket.value) {
      console.error('Cannot send message: Socket is not initialized.')
      return
    }
    console.log('Emitting sendMessage payload:', { roomId, content })
    socket.value.emit('sendMessage', { roomId, content })
  }

  // WebSocket Action: Join room as participant
  const joinRoom = (roomId: string) => {
    // Reset proposals when switching rooms so old room's proposals don't leak
    if (activeRoomId.value !== roomId) {
      proposals.value = []
    }
    activeRoomId.value = roomId

    // Load saved proposals from localStorage if any to survive refreshes
    if (import.meta.client && roomId) {
      const saved = localStorage.getItem(`sedalang_proposals_${roomId}`)
      if (saved) {
        try {
          proposals.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse saved proposals:', e)
        }
      }
    }

    if (socket.value) {
      console.log('Emitting joinRoom for roomId:', roomId)
      socket.value.emit('joinRoom', roomId)
    }
  }

  // WebSocket Action: Disconnect Socket connection
  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      console.log('Socket disconnected.')
    }
  }

  return {
    rooms,
    activeRoomId,
    messages,
    proposals,
    isLoading,
    error,
    activeRoom,
    chatTimeline,
    fetchRooms,
    createOrGetRoom,
    fetchMessages,
    fetchProposals,
    createProposal,
    acceptProposal,
    rejectProposal,
    initializeSocket,
    sendMessage,
    joinRoom,
    disconnectSocket
  }
})

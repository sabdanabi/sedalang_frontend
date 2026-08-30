import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApiFetch'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderProposal {
  id: string
  productName: string
  price: number
  materialsNeeded: string[]
  deliveryMethod: string
  estimatedCompletionDate: string
  paymentMethod: string
  status: string
}

export interface OrderCraftsman {
  id: string
  craftType: string
  location: string
  user: {
    fullName: string
    avatarUrl: string | null
    email: string | null
    phoneNumber: string | null
  }
}

export interface OrderUser {
  id: string
  fullName: string
  avatarUrl: string | null
  email: string
  phoneNumber: string | null
}

export interface OrderProgressStep {
  id: string
  title: string
  description: string
  mediaUrls: string[]
  createdAt: string
}

export interface Order {
  id: string
  status: string
  totalAmount: number
  paymentMethod: string | null
  midtransOrderId: string | null
  midtransRedirectUrl: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  proposal: OrderProposal
  craftsman: OrderCraftsman
  user: OrderUser
  progressSteps?: OrderProgressStep[]
}

interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useOrdersStore = defineStore('orders', () => {
  const api = useApi()
  const orders = ref<Order[]>([])
  const activeOrder = ref<Order | null>(null)
  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const error = ref('')

  // GET /api/v1/orders
  const fetchOrders = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api('/api/v1/orders') as ApiResponse<Order[]>
      orders.value = res.data || []
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Gagal memuat riwayat pesanan.'
      orders.value = []
    } finally {
      isLoading.value = false
    }
  }

  // GET /api/v1/orders/{orderId}
  const fetchOrderById = async (orderId: string) => {
    isDetailLoading.value = true
    error.value = ''
    try {
      const res = await api(`/api/v1/orders/${orderId}`) as ApiResponse<Order>
      activeOrder.value = res.data
      return res.data
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Gagal memuat detail pesanan.'
      activeOrder.value = null
      throw err
    } finally {
      isDetailLoading.value = false
    }
  }

  return {
    orders,
    activeOrder,
    isLoading,
    isDetailLoading,
    error,
    fetchOrders,
    fetchOrderById
  }
})

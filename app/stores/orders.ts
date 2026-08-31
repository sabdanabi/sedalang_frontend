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
  productName?: string
  price?: number
  materialsNeeded?: string[]
  deliveryMethod?: string
  estimatedCompletionDate?: string
  proposal: OrderProposal
  craftsman: OrderCraftsman
  user: OrderUser
  progresses?: OrderProgressStep[]
  progressSteps?: OrderProgressStep[]
  progressImages?: string[]
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
      const res = await api('/api/v1/orders') as ApiResponse<any[]>
      const mappedOrders = (res.data || []).map((o: any) => {
        if (o.progresses) {
          // Sort progresses by createdAt ascending so the newest progresses are at the end (or as added)
          // Actually let's keep the order returned by API or handle it appropriately
          o.progressSteps = o.progresses
        }
        return o as Order
      })
      orders.value = mappedOrders
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
      const res = await api(`/api/v1/orders/${orderId}`) as ApiResponse<any>
      const orderData = res.data
      if (orderData && orderData.progresses) {
        orderData.progressSteps = orderData.progresses
      }
      activeOrder.value = orderData as Order
      return orderData as Order
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Gagal memuat detail pesanan.'
      activeOrder.value = null
      throw err
    } finally {
      isDetailLoading.value = false
    }
  }

  // POST /api/v1/orders/{orderId}/media
  const uploadOrderMedia = async (orderId: string, imageFile: File): Promise<Order> => {
    const config = useRuntimeConfig()
    const tokenCookie = useCookie<string | null>('sedalang_token')
    const baseURL = config.public.apiBase as string

    const formData = new FormData()
    formData.append('images', imageFile) // Using standard 'images' multipart key

    isLoading.value = true
    error.value = ''
    try {
      const res = await $fetch(`/api/v1/orders/${orderId}/media`, {
        baseURL,
        method: 'POST',
        body: formData,
        headers: {
          ...(tokenCookie.value ? { Authorization: `Bearer ${tokenCookie.value}` } : {})
        }
      }) as ApiResponse<Order>
      activeOrder.value = res.data
      return res.data
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Gagal mengunggah media progres.'
      console.error('Error uploading order media:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // POST /api/v1/orders/{orderId}/progress
  const addOrderProgress = async (orderId: string, title: string, description: string, status?: string): Promise<Order> => {
    isDetailLoading.value = true
    error.value = ''
    try {
      const res = await api(`/api/v1/orders/${orderId}/progress`, {
        method: 'POST',
        body: {
          title,
          description,
          status: status || undefined
        }
      }) as ApiResponse<any>
      const orderData = res.data
      if (orderData && orderData.progresses) {
        orderData.progressSteps = orderData.progresses
      }
      activeOrder.value = orderData as Order
      return orderData as Order
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Gagal menambahkan progres pesanan.'
      throw err
    } finally {
      isDetailLoading.value = false
    }
  }

  // POST /api/v1/orders/{orderId}/check-payment
  const checkOrderPayment = async (orderId: string): Promise<any> => {
    isDetailLoading.value = true
    error.value = ''
    try {
      const res = await api(`/api/v1/orders/${orderId}/check-payment`, {
        method: 'POST'
      }) as ApiResponse<any>
      if (res.data) {
        const orderData = res.data
        if (orderData.progresses) {
          orderData.progressSteps = orderData.progresses
        }
        activeOrder.value = orderData as Order
      }
      return res.data
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Gagal menyinkronkan status pembayaran.'
      throw err
    } finally {
      isDetailLoading.value = false
    }
  }

  // POST /api/v1/orders/retry/{proposalId}
  const retryOrderPayment = async (proposalId: string): Promise<any> => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api(`/api/v1/orders/retry/${proposalId}`, {
        method: 'POST'
      }) as ApiResponse<any>
      return res.data
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Gagal membuat ulang pembayaran.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    orders,
    activeOrder,
    isLoading,
    isDetailLoading,
    error,
    fetchOrders,
    fetchOrderById,
    uploadOrderMedia,
    addOrderProgress,
    checkOrderPayment,
    retryOrderPayment
  }
})

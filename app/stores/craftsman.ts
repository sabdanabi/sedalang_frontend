import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApiFetch'

export interface Craftsman {
  id: string
  userId: string
  location: string
  latitude: number | null
  longitude: number | null
  skills: string[]
  craftType: string
  portfolioUrls: string[]
  averageRating: number
  reviewCount: number
  completedOrdersCount: number
  createdAt: string
  updatedAt: string
  user: {
    fullName: string
    avatarUrl: string | null
    email?: string
    phoneNumber?: string
  }
}

interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const useCraftsmanStore = defineStore('craftsman', () => {
  const api = useApi()
  const matchedCraftsmen = ref<Craftsman[]>([])
  const activeCraftsman = ref<Craftsman | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const getMatchedCraftsmen = async (ideaId: string): Promise<Craftsman[]> => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const response = await api(`/api/v1/craftsmen/match/${ideaId}`, {
        method: 'GET'
      }) as ApiResponse<Craftsman[]>
      matchedCraftsmen.value = response.data || []
      return matchedCraftsmen.value
    } catch (err: any) {
      errorMessage.value = err.data?.message || 'Gagal memuat rekomendasi pengrajin. Silakan coba lagi.'
      matchedCraftsmen.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getCraftsmanById = async (id: string): Promise<Craftsman> => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const response = await api(`/api/v1/craftsmen/${id}`, {
        method: 'GET'
      }) as ApiResponse<Craftsman>
      activeCraftsman.value = response.data
      return response.data
    } catch (err: any) {
      errorMessage.value = err.data?.message || 'Gagal memuat data profil pengrajin. Silakan coba lagi.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    matchedCraftsmen,
    activeCraftsman,
    isLoading,
    errorMessage,
    getMatchedCraftsmen,
    getCraftsmanById
  }
})

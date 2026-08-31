import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApiFetch'
import { getAvatarUrl } from '~/composables/useAvatar'

export interface ApiCraftsman {
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
  }
}

export interface MappedCraftsman {
  id: string
  name: string
  location: string
  avatar: string
  heroImage: string
  specialty: string
  rating: number
  description: string
  tags: string[]
  thumbnails: string[]
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const useSearchCraftsmanStore = defineStore('searchCraftsman', () => {
  const api = useApi()
  const rawCraftsmen = ref<ApiCraftsman[]>([])
  const meta = ref<PaginationMeta>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  })
  
  const locations = ref<string[]>([])
  const skills = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref('')

  const defaultImg = '/images/default_images/default_img.webp'

  // Dynamic mapping helper
  const mapCraftsmenList = (list: ApiCraftsman[]): MappedCraftsman[] => {
    return list.map(c => {
      const thumbnails = c.portfolioUrls && c.portfolioUrls.length > 0
        ? [...c.portfolioUrls.slice(0, 3), ...Array(Math.max(0, 3 - c.portfolioUrls.length)).fill(defaultImg)]
        : [defaultImg, defaultImg, defaultImg]

      const heroImage = c.portfolioUrls && c.portfolioUrls.length > 0 ? c.portfolioUrls[0] : defaultImg
      
      const skillsStr = c.skills && c.skills.length > 0 ? c.skills.join(', ') : ''
      const description = skillsStr
        ? `Mengkhususkan diri sebagai ${c.craftType || 'pengrajin kreatif'}. Ahli dalam mengolah dan mendaur ulang bahan ${skillsStr} menjadi produk berkualitas.`
        : `Pengrajin terampil yang berfokus pada bidang ${c.craftType || 'kerajinan tangan'} berkualitas tinggi.`

      return {
        id: c.id,
        name: c.user?.fullName || 'Pengrajin',
        location: c.location || 'Semarang',
        avatar: getAvatarUrl(c.user?.avatarUrl, c.user?.fullName || 'Pengrajin'),
        heroImage,
        specialty: c.craftType || 'Pengrajin',
        rating: c.averageRating || 5.0,
        description,
        tags: c.skills || [],
        thumbnails
      }
    })
  }

  // Action to fetch filters
  const fetchFilters = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const res = await api('/api/v1/craftsmen/filters') as ApiResponse<{ locations: string[], skills: string[] }>
      locations.value = res.data?.locations || []
      skills.value = res.data?.skills || []
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat filter'
      console.error('Error fetching filters:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Action to search/list craftsmen
  const searchCraftsmen = async (params: {
    page?: number
    limit?: number
    search?: string
    skill?: string
    location?: string
    minRating?: number
    sortBy?: string
  }) => {
    isLoading.value = true
    error.value = ''
    
    // Clean params: transform default values appropriately
    const cleanParams: Record<string, any> = {
      page: params.page || 1,
      limit: params.limit || 9
    }

    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim()
    }
    if (params.skill && params.skill !== 'Semua Keahlian') {
      cleanParams.skill = params.skill
    }
    if (params.location && params.location !== 'Semua Lokasi') {
      cleanParams.location = params.location
    }
    if (params.minRating && params.minRating !== 'Semua Penilaian') {
      // Extract numeric value from "★ 4.8 ke atas" or float
      const cleanRating = parseFloat(params.minRating.toString().replace(/[^\d.]/g, ''))
      if (!isNaN(cleanRating)) {
        cleanParams.minRating = cleanRating
      }
    }
    if (params.sortBy) {
      cleanParams.sortBy = params.sortBy
    }

    try {
      let res;
      // If any specific search filter is provided, use the POST search API
      if (cleanParams.search || cleanParams.skill || cleanParams.location || cleanParams.minRating) {
        res = await api('/api/v1/craftsmen/search', {
          method: 'POST',
          body: cleanParams
        }) as ApiResponse<{ data: ApiCraftsman[], meta: PaginationMeta }>
      } else {
        // Otherwise, use the standard GET API to load the default list
        const queryString = new URLSearchParams(cleanParams).toString()
        res = await api(`/api/v1/craftsmen?${queryString}`, {
          method: 'GET'
        }) as ApiResponse<{ data: ApiCraftsman[], meta: PaginationMeta }>
      }
      rawCraftsmen.value = res.data?.data || []
      if (res.data?.meta) {
        meta.value = res.data.meta
      }
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat daftar pengrajin'
      console.error('Error listing craftsmen:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    rawCraftsmen,
    meta,
    locations,
    skills,
    isLoading,
    error,
    mapCraftsmenList,
    fetchFilters,
    searchCraftsmen
  }
})

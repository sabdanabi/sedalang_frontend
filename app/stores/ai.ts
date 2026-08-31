import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApiFetch'

export interface AIIdea {
  id: string
  ideaTitle: string
  description: string
  difficultyLevel: string
  imageUrl?: string | null
  materialsNeeded: string[]
  toolsNeeded: string[]
  craftsmanSkills: string[]
  steps: string[]
  createdAt: string
}

export interface AIAnalysisRecord {
  id: string
  rawImageUrl: string
  detectedMaterial: string
  materialCondition: string
  ideas: AIIdea[]
  createdAt: string
}

interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const useAIStore = defineStore('ai', () => {
  const api = useApi()
  const historyList = ref<AIAnalysisRecord[]>([])
  const isAnalyzing = ref(false)

  // Upload waste item photo for AI analysis (material detection + 3 recycling ideas)
  const analyzeIdeas = async (imageFile: File): Promise<AIAnalysisRecord> => {
    isAnalyzing.value = true
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await api('/api/v1/ai/analyze-ideas', {
        method: 'POST',
        body: formData
      }) as ApiResponse<AIAnalysisRecord>

      // Auto update list in background
      await getHistory()

      return response.data
    } finally {
      isAnalyzing.value = false
    }
  }

  // Retrieve user's AI analysis history
  const getHistory = async (): Promise<AIAnalysisRecord[]> => {
    const response = await api('/api/v1/ai/history', {
      method: 'GET'
    }) as ApiResponse<AIAnalysisRecord[]>
    
    historyList.value = response.data || []
    return historyList.value
  }

  return {
    historyList,
    isAnalyzing,
    analyzeIdeas,
    getHistory
  }
})

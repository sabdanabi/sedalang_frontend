import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCookie, navigateTo, useRuntimeConfig } from '#app'
import { useApi } from '~/composables/useApiFetch'

export interface User {
  id: string
  email: string
  fullName: string
  phoneNumber?: string | null
  role: 'USER' | 'CRAFTSMAN'
  avatarUrl?: string | null
  location?: string | null
  latitude?: number | null
  longitude?: number | null
  createdAt: string
}

// Standard API response wrapper from backend
interface ApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

// Login/Register response shape
interface AuthResponse {
  user: User
  accessToken: string
}

// GetMe response shape
interface GetMeResponse extends User {
  updatedAt: string
  craftsman: unknown | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = useCookie<string | null>('sedalang_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  const api = useApi()

  const isAuthenticated = computed(() => !!token.value)

  const onboardingCompleted = ref(false)

  // Initialize onboarding state from localStorage
  if (import.meta.client) {
    onboardingCompleted.value = localStorage.getItem('sedalang_onboarding_completed') === 'true'
  }

  // Fetch current user details
  const getMe = async () => {
    if (!token.value) return null
    try {
      const response = await api('/api/v1/users/me') as ApiResponse<GetMeResponse>
      user.value = response.data
      if (import.meta.client) {
        localStorage.setItem('sedalang_user_name', response.data.fullName)
      }
      return response.data
    } catch (err) {
      token.value = null
      user.value = null
      throw err
    }
  }

  // Handle user login
  const login = async (credentials: { email: string; password: string }) => {
    const response = await api('/api/v1/auth/login', {
      method: 'POST',
      body: credentials
    }) as ApiResponse<AuthResponse>

    token.value = response.data.accessToken
    user.value = response.data.user

    if (import.meta.client) {
      localStorage.setItem('sedalang_user_name', response.data.user.fullName)
    }

    return response.data
  }

  // Handle user registration
  const register = async (userData: { email: string; password: string; fullName: string; phoneNumber?: string }) => {
    const response = await api('/api/v1/auth/register', {
      method: 'POST',
      body: userData
    }) as ApiResponse<AuthResponse>

    return response.data
  }

  // Update user role during onboarding
  const updateRole = async (role: 'USER' | 'CRAFTSMAN') => {
    const response = await api('/api/v1/users/me/role', {
      method: 'PATCH',
      body: { role }
    }) as ApiResponse<{ accessToken: string }>

    // Update token with new JWT that includes the role
    token.value = response.data.accessToken
    await getMe()

    return response.data
  }

  // Complete craftsman onboarding (multipart/form-data)
  const completeCraftsmanOnboarding = async (formData: FormData) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase as string

    // Use $fetch directly for FormData (do not set Content-Type, let browser set boundary)
    const response = await $fetch('/api/v1/onboarding/craftman', {
      baseURL,
      method: 'POST',
      body: formData,
      headers: {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      }
    }) as ApiResponse<{ accessToken: string }>

    token.value = response.data.accessToken
    await getMe()

    // Mark onboarding as completed
    onboardingCompleted.value = true
    if (import.meta.client) {
      localStorage.setItem('sedalang_onboarding_completed', 'true')
    }

    return response.data
  }

  // Skip onboarding for regular users
  const skipOnboarding = async () => {
    const response = await api('/api/v1/onboarding/skip', {
      method: 'POST'
    }) as ApiResponse<{ accessToken: string }>

    token.value = response.data.accessToken
    await getMe()

    // Mark onboarding as completed
    onboardingCompleted.value = true
    if (import.meta.client) {
      localStorage.setItem('sedalang_onboarding_completed', 'true')
    }

    return response.data
  }

  // Handle logout
  const logout = () => {
    token.value = null
    user.value = null
    onboardingCompleted.value = false
    if (import.meta.client) {
      localStorage.removeItem('sedalang_user_name')
      localStorage.removeItem('sedalang_onboarding_completed')
      localStorage.removeItem('sedalang_conversations')
    }
    navigateTo('/login')
  }

  // Update craftsman details
  const updateCraftsmanProfile = async (data: { 
    location: string; 
    craftType: string; 
    skills: string;
    latitude?: number | null;
    longitude?: number | null;
  }) => {
    const response = await api('/api/v1/craftsmen/me', {
      method: 'PATCH',
      body: data
    }) as ApiResponse<{ message: string }>

    await getMe()
    return response.data
  }

  // Update general user profile details (name, phone, avatar file, and location coordinates)
  const updateUserProfile = async (data: { 
    fullName: string; 
    phoneNumber?: string; 
    avatarFile?: File | null;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }) => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBase as string
    
    let body: any
    let headers: Record<string, string> = {}

    if (data.avatarFile) {
      const formData = new FormData()
      formData.append('fullName', data.fullName)
      if (data.phoneNumber) {
        formData.append('phoneNumber', data.phoneNumber)
      }
      if (data.location !== undefined) {
        formData.append('location', data.location || '')
      }
      if (data.latitude !== undefined && data.latitude !== null) {
        formData.append('latitude', String(data.latitude))
      }
      if (data.longitude !== undefined && data.longitude !== null) {
        formData.append('longitude', String(data.longitude))
      }
      formData.append('avatar', data.avatarFile)
      body = formData
    } else {
      body = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || null,
        location: data.location !== undefined ? data.location : undefined,
        latitude: data.latitude !== undefined ? data.latitude : undefined,
        longitude: data.longitude !== undefined ? data.longitude : undefined
      }
      // Remove undefined keys
      Object.keys(body).forEach(key => {
        if (body[key] === undefined) delete body[key]
      })
      headers['Content-Type'] = 'application/json'
    }

    const response = await $fetch('/api/v1/users/me', {
      baseURL,
      method: 'PATCH',
      body,
      headers: {
        ...headers,
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
      }
    }) as ApiResponse<User>

    await getMe()
    return response.data
  }

  return {
    user,
    token,
    isAuthenticated,
    onboardingCompleted,
    getMe,
    login,
    register,
    updateRole,
    completeCraftsmanOnboarding,
    skipOnboarding,
    logout,
    updateCraftsmanProfile,
    updateUserProfile
  }
})

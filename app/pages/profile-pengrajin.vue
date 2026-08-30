<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCraftsmanStore } from '~/stores/craftsman'
import { getAvatarUrl } from '~/composables/useAvatar'
import { navigateTo } from '#app'

definePageMeta({
  layout: 'dashboard'
})

// Interfaces
interface ProfileData {
  name: string
  description: string
  location: string
  rating: number
  projectsCount: number
  avatar: string
  skills: string[]
  latitude?: number | null
  longitude?: number | null
  avatarFile?: File | null
}

interface WorkItem {
  id: number
  title: string
  description: string
  image: string
}

const authStore = useAuthStore()
const route = useRoute()
const craftsmanStore = useCraftsmanStore()

// Reactive States (initially populated with safe empty/loading defaults, overwritten upon API load)
const profile = ref<ProfileData>({
  name: '',
  description: '',
  location: '',
  rating: 0,
  projectsCount: 0,
  avatar: '/images/landing_page_images/default_pp.webp',
  skills: [],
  latitude: null,
  longitude: null
})

const works = ref<WorkItem[]>([])

const isOwnProfile = computed(() => {
  if (!route.query.id) return true
  const myCraftsmanId = authStore.user?.craftsman?.id || (authStore.user as any)?.craftsmanId
  return route.query.id === myCraftsmanId
})

const loadProfile = async () => {
  try {
    // If we're looking at another craftsman's profile
    if (route.query.id) {
      const craftsmanId = route.query.id as string
      const craftsman = await craftsmanStore.getCraftsmanById(craftsmanId)
      if (craftsman) {
        profile.value = {
          name: craftsman.user?.fullName || 'Pengrajin',
          description: craftsman.craftType || 'Pengrajin Kreatif',
          location: craftsman.location || 'Semarang Tengah, Jawa Tengah',
          rating: craftsman.averageRating || 5.0,
          projectsCount: craftsman.completedOrdersCount || 0,
          avatar: getAvatarUrl(craftsman.user?.avatarUrl, craftsman.user?.fullName || 'User'),
          skills: typeof craftsman.skills === 'string'
            ? (craftsman.skills as string).split(',').map((s: string) => s.trim()).filter(Boolean)
            : (Array.isArray(craftsman.skills) ? craftsman.skills : []),
          latitude: craftsman.latitude,
          longitude: craftsman.longitude
        }

        // Map works from API portfolios
        const apiWorks = craftsman.portfolioUrls || []
        works.value = apiWorks.map((w: string, index: number) => ({
          id: index + 1,
          title: '',
          description: '',
          image: w
        }))
      }
      return
    }

    // Otherwise, load logged-in craftsman's profile
    const userData = await authStore.getMe()
    if (userData) {
      if (userData.role === 'USER') {
        navigateTo('/profile')
        return
      }

      const craftsman = await craftsmanStore.getCraftsmanMe()
      if (craftsman) {
        profile.value = {
          name: craftsman.user?.fullName || userData.fullName || '',
          description: craftsman.craftType || 'Pengrajin',
          location: craftsman.location || 'Semarang Tengah, Jawa Tengah',
          rating: craftsman.averageRating || 4.9,
          projectsCount: craftsman.completedOrdersCount || 24,
          avatar: getAvatarUrl(craftsman.user?.avatarUrl || userData.avatarUrl, craftsman.user?.fullName || userData.fullName || 'User'),
          skills: typeof craftsman.skills === 'string'
            ? (craftsman.skills as string).split(',').map((s: string) => s.trim()).filter(Boolean)
            : (Array.isArray(craftsman.skills) ? craftsman.skills : []),
          latitude: craftsman.latitude,
          longitude: craftsman.longitude
        }

        // Check if artisan profile is also saved in localStorage to merge local edits
        const savedProfile = localStorage.getItem(`sedalang_artisan_profile_${userData.id}`)
        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile)
            profile.value = {
              ...profile.value,
              ...parsed
            }
          } catch (e) {
            console.error('Error parsing local artisan profile:', e)
          }
        }

        // Load works from API/craftsman portfolios
        const apiWorks = craftsman.portfolioUrls || []
        works.value = apiWorks.map((w: string, index: number) => ({
          id: index + 1,
          title: '',
          description: '',
          image: w
        }))
      }
    }
  } catch (err) {
    console.error('Error loading craftsman profile from API:', err)
  }
}

// Onboarding validation & immediate profile load (in client setup)
if (import.meta.client) {
  const completed = localStorage.getItem('sedalang_onboarding_completed')
  if (!completed) {
    navigateTo('/onboarding')
  } else {
    loadProfile()
  }
}

const handleContactCraftsman = async () => {
  let finalIdeaId = route.query.ideaId as string
  if (!finalIdeaId) {
    if (import.meta.client) {
      finalIdeaId = localStorage.getItem('sedalang_active_idea_id') || ''
    }
  }

  // Fallback to latest idea from history
  if (!finalIdeaId) {
    try {
      const api = useApi()
      const res = await api('/api/v1/ai/history') as any
      if (res.data && res.data.length > 0) {
        const latestHistory = res.data[0]
        if (latestHistory.ideas && latestHistory.ideas.length > 0) {
          finalIdeaId = latestHistory.ideas[0].id
        }
      }
    } catch (err) {
      console.error('Failed to load fallback idea history:', err)
    }
  }

  const craftsmanId = route.query.id as string
  navigateTo(`/chat?craftsmanId=${craftsmanId}&ideaId=${finalIdeaId}&craftsmanName=${encodeURIComponent(profile.value.name)}`)
}

// Save profile state
const saveProfileState = () => {
  if (import.meta.client) {
    const userId = authStore.user?.id || ''
    localStorage.setItem(`sedalang_artisan_profile_${userId}`, JSON.stringify(profile.value))
  }
}



// Modal visibility toggles
const showEditModal = ref(false)
const showAddWorkModal = ref(false)
const showDeleteConfirm = ref(false)
const urlToDelete = ref('')

// Action Handlers
const handleEditProfileSubmit = async (updatedData: ProfileData) => {
  try {
    // 1. Update general user details (name and avatar)
    await authStore.updateUserProfile({
      fullName: updatedData.name,
      avatarFile: updatedData.avatarFile
    })

    // 2. Update craftsman workshop details
    await authStore.updateCraftsmanProfile({
      location: updatedData.location,
      craftType: updatedData.description,
      skills: updatedData.skills.join(', '),
      latitude: updatedData.latitude,
      longitude: updatedData.longitude
    })

    showEditModal.value = false
    await loadProfile()
    saveProfileState()
  } catch (err) {
    console.error('Failed to update craftsman profile:', err)
    alert('Gagal memperbarui profil pengrajin. Silakan coba lagi.')
  }
}

const handleAddWorkSubmit = async (imageFile: File) => {
  try {
    showAddWorkModal.value = false
    await craftsmanStore.uploadPortfolioImage(imageFile)
    await loadProfile()
  } catch (err) {
    console.error('Failed to upload portfolio image:', err)
    alert('Gagal mengunggah foto karya. Silakan coba lagi.')
  }
}

const handleDeleteWorkClick = (url: string) => {
  urlToDelete.value = url
  showDeleteConfirm.value = true
}

const handleConfirmDelete = async () => {
  try {
    showDeleteConfirm.value = false
    if (urlToDelete.value) {
      await craftsmanStore.deletePortfolioImage(urlToDelete.value)
      urlToDelete.value = ''
      await loadProfile()
    }
  } catch (err) {
    console.error('Failed to delete portfolio image:', err)
    alert('Gagal menghapus foto karya. Silakan coba lagi.')
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-white py-10">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20 space-y-10">
      
      <!-- Header Section -->
      <header class="text-left">
        <h1 class="font-poppins text-3xl md:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
          Profil Pengrajin
        </h1>
        <p class="font-inter text-sm md:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Pusat kelola informasi, keahlian, dan portofolio karya anda
        </p>
      </header>

      <!-- Profile Header Summary Card -->
      <FeaturesProfileHeaderCard
        :profile="profile"
        :isOwnProfile="isOwnProfile"
        @edit="showEditModal = true"
        @chat="handleContactCraftsman"
      />

      <!-- Skills and Handled Materials tags list -->
      <FeaturesProfileSkillsList
        :skills="profile.skills"
      />

      <!-- Location and Interactive Maplibre map section -->
      <FeaturesProfileMapSection 
        :location="profile.location" 
        :latitude="profile.latitude"
        :longitude="profile.longitude"
        :isOwnProfile="isOwnProfile"
      />

      <!-- Portfolio works gallery grid -->
      <FeaturesProfilePortfolioGrid
        :works="works"
        :isOwnProfile="isOwnProfile"
        @add-work="showAddWorkModal = true"
        @delete-work="handleDeleteWorkClick"
      />

    </div>

    <!-- Modals -->
    <FeaturesProfileEditModal
      :show="showEditModal"
      :profile="profile"
      @close="showEditModal = false"
      @submit="handleEditProfileSubmit"
    />

    <FeaturesProfileAddWorkModal
      :show="showAddWorkModal"
      @close="showAddWorkModal = false"
      @submit="handleAddWorkSubmit"
    />

    <FeaturesProfileDeleteConfirmModal
      :show="showDeleteConfirm"
      @close="showDeleteConfirm = false"
      @confirm="handleConfirmDelete"
    />

  </div>
</template>

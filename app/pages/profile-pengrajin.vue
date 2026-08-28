<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
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
}

interface WorkItem {
  id: number
  title: string
  description: string
  image: string
}

const authStore = useAuthStore()

// Reactive States (initially populated with dummy data, overwritten upon API load)
const profile = ref<ProfileData>({
  name: 'Karyaloka Craft',
  description: 'Karyaloka Craft',
  location: 'Semarang Tengah, Jawa Tengah',
  rating: 4.9,
  projectsCount: 24,
  avatar: '/images/landing_page_images/default_pp.webp',
  skills: [
    'Botol Kaca',
    'Kaca Bekas',
    'Dekorasi Rumah',
    'Lampu Dekoratif',
    'Upcycling'
  ]
})

const works = ref<WorkItem[]>([])

const loadProfile = async () => {
  try {
    const userData = await authStore.getMe()
    if (userData) {
      if (userData.role === 'USER') {
        navigateTo('/profile')
        return
      }

      const craftsman = userData.craftsman as any
      profile.value = {
        name: userData.fullName || '',
        description: craftsman?.craftType || 'Pengrajin',
        location: craftsman?.location || 'Semarang Tengah, Jawa Tengah',
        rating: craftsman?.rating || 4.9,
        projectsCount: craftsman?.projectsCount || 24,
        avatar: userData.avatarUrl || '/images/landing_page_images/default_pp.webp',
        skills: typeof craftsman?.skills === 'string'
          ? craftsman.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : (Array.isArray(craftsman?.skills) ? craftsman.skills : [])
      }

      // Check if artisan profile is also saved in localStorage to merge local edits
      const savedProfile = localStorage.getItem('sedalang_artisan_profile')
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
      const apiWorks = craftsman?.portfolios || craftsman?.works || craftsman?.portfolio
      if (apiWorks) {
        if (Array.isArray(apiWorks)) {
          works.value = apiWorks.map((w: any, index: number) => {
            if (typeof w === 'string') {
              return {
                id: index + 1,
                title: `Karya ${index + 1}`,
                description: `Portofolio karya pengrajin ${profile.value.name}`,
                image: w
              }
            } else {
              return {
                id: w.id || (index + 1),
                title: w.title || `Karya ${index + 1}`,
                description: w.description || `Deskripsi karya`,
                image: w.image || w.imageUrl || '/images/default_images/default_img.webp'
              }
            }
          })
        } else if (typeof apiWorks === 'string') {
          works.value = [
            {
              id: 1,
              title: 'Karya Portofolio',
              description: `Portofolio karya pengrajin ${profile.value.name}`,
              image: apiWorks
            }
          ]
        } else {
          works.value = []
        }
      } else {
        // Fallback to local storage if available, otherwise empty to remove dummy data
        const savedWorks = localStorage.getItem('sedalang_artisan_works')
        if (savedWorks) {
          try {
            works.value = JSON.parse(savedWorks)
          } catch (e) {
            console.error('Error parsing local artisan works:', e)
            works.value = []
          }
        } else {
          works.value = []
        }
      }
    }
  } catch (err) {
    console.error('Error loading craftsman profile from API:', err)
  }
}

// Onboarding validation
onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    loadProfile()
  }
})

// Save profile state
const saveProfileState = () => {
  if (import.meta.client) {
    localStorage.setItem('sedalang_artisan_profile', JSON.stringify(profile.value))
  }
}

const saveWorksState = () => {
  if (import.meta.client) {
    localStorage.setItem('sedalang_artisan_works', JSON.stringify(works.value))
  }
}

// Modal visibility toggles
const showEditModal = ref(false)
const showAddWorkModal = ref(false)
const showDetailModal = ref(false)
const selectedWork = ref<WorkItem | null>(null)

// Action Handlers
const handleEditProfileSubmit = async (updatedData: ProfileData) => {
  try {
    await authStore.updateCraftsmanProfile({
      location: updatedData.location,
      craftType: updatedData.description,
      skills: updatedData.skills.join(', ')
    })

    showEditModal.value = false
    profile.value = {
      ...profile.value,
      name: updatedData.name,
      description: updatedData.description,
      location: updatedData.location,
      projectsCount: updatedData.projectsCount,
      avatar: updatedData.avatar,
      skills: updatedData.skills
    }
    saveProfileState()
  } catch (err) {
    console.error('Failed to update craftsman profile:', err)
    alert('Gagal memperbarui profil pengrajin. Silakan coba lagi.')
  }
}

const handleAddWorkSubmit = (newWorkData: { title: string; image: string; description: string }) => {
  showAddWorkModal.value = false
  const newWork: WorkItem = {
    id: Date.now(),
    title: newWorkData.title,
    image: newWorkData.image || '/images/default_images/default_img.webp',
    description: newWorkData.description
  }
  works.value.push(newWork)
  saveWorksState()
}

const handleViewWorkDetail = (item: WorkItem) => {
  selectedWork.value = item
  showDetailModal.value = true
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
        @edit="showEditModal = true"
      />

      <!-- Skills and Handled Materials tags list -->
      <FeaturesProfileSkillsList
        :skills="profile.skills"
      />

      <!-- Location and Interactive Maplibre map section -->
      <FeaturesProfileMapSection :location="profile.location" />

      <!-- Portfolio works gallery grid -->
      <FeaturesProfilePortfolioGrid
        :works="works"
        @add-work="showAddWorkModal = true"
        @view-detail="handleViewWorkDetail"
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

    <FeaturesProfileWorkDetailModal
      :show="showDetailModal"
      :work="selectedWork"
      @close="showDetailModal = false"
    />

  </div>
</template>

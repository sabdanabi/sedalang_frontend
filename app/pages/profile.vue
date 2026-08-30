<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { navigateTo } from '#app'

definePageMeta({
  layout: 'dashboard'
})

interface UserProfile {
  name: string
  location: string
  email: string
  phone: string
  avatar: string
  role: string
  latitude?: number | null
  longitude?: number | null
  avatarFile?: File | null
}

const profile = ref<UserProfile>({
  name: 'Bruno James',
  location: 'Semarang Tengah, Jawa Tengah',
  email: 'brunojames@gmail.com',
  phone: '+62 812-9753-6492',
  avatar: '/images/landing_page_images/default_pp.webp',
  role: 'Creative Design',
  latitude: null,
  longitude: null
})

const showEditModal = ref(false)
const authStore = useAuthStore()

const loadProfile = async () => {
  try {
    const userData = await authStore.getMe()
    if (userData) {
      if (userData.role === 'CRAFTSMAN') {
        navigateTo('/profile-pengrajin')
        return
      }

      profile.value = {
        name: userData.fullName || '',
        location: userData.location || 'Semarang Tengah, Jawa Tengah',
        email: userData.email || '',
        phone: userData.phoneNumber || '',
        avatar: getAvatarUrl(userData.avatarUrl, userData.fullName || 'User'),
        role: 'Pengguna',
        latitude: userData.latitude,
        longitude: userData.longitude
      }

      // Check if user has saved profile edits in local storage
      const savedProfile = localStorage.getItem(`sedalang_user_profile_${userData.id}`)
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          profile.value = {
            ...profile.value,
            ...parsed
          }
        } catch (e) {
          console.error('Error parsing local profile data:', e)
        }
      }
    }
  } catch (err) {
    console.error('Error loading profile from API:', err)
  }
}

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

const saveProfileState = () => {
  if (import.meta.client) {
    const userId = authStore.user?.id || ''
    localStorage.setItem(`sedalang_user_profile_${userId}`, JSON.stringify(profile.value))
  }
}

const handleEditSubmit = async (updatedData: UserProfile) => {
  try {
    await authStore.updateUserProfile({
      fullName: updatedData.name,
      phoneNumber: updatedData.phone,
      avatarFile: updatedData.avatarFile
    })

    showEditModal.value = false
    await loadProfile()
    saveProfileState()
  } catch (err) {
    console.error('Failed to update user profile:', err)
    alert('Gagal memperbarui profil. Silakan coba lagi.')
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-white py-10">
    <div class="max-w-8xl mx-auto px-6 md:px-16 lg:px-20 space-y-10">
      
      <!-- Header Section -->
      <header class="text-left">
        <h1 class="font-poppins text-3xl md:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
          Profil Pengguna
        </h1>
        <p class="font-inter text-sm md:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Pusat kelola informasi, keahlian, dan portofolio karya anda
        </p>
      </header>

      <!-- Profile Header Summary Card -->
      <FeaturesProfileUserProfileCard
        :profile="profile"
        @edit="showEditModal = true"
      />

      <!-- Grid columns: Bottom Left Info & Bottom Right Map -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        <!-- Left: Informations -->
        <div>
          <FeaturesProfileUserProfileInfoSection
            :profile="profile"
            @edit="showEditModal = true"
          />
        </div>

        <!-- Right: Maplibre GL interactive Map -->
        <div>
          <FeaturesProfileUserProfileMapSection 
            :location="profile.location" 
            :latitude="profile.latitude"
            :longitude="profile.longitude"
          />
        </div>

      </div>

    </div>

    <!-- Edit Profile Modal -->
    <FeaturesProfileUserProfileEditModal
      :show="showEditModal"
      :profile="profile"
      @close="showEditModal = false"
      @submit="handleEditSubmit"
    />

  </div>
</template>

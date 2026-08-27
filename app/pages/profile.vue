<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
}

const profile = ref<UserProfile>({
  name: 'Bruno James',
  location: 'Semarang Tengah, Jawa Tengah',
  email: 'brunojames@gmail.com',
  phone: '+62 812-9753-6492',
  avatar: '/images/landing_page_images/default_pp.webp',
  role: 'Creative Design'
})

const showEditModal = ref(false)

onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    const savedProfile = localStorage.getItem('sedalang_user_profile')
    if (savedProfile) {
      try {
        profile.value = JSON.parse(savedProfile)
      } catch (e) {
        console.error(e)
      }
    }
  }
})

const saveProfileState = () => {
  if (import.meta.client) {
    localStorage.setItem('sedalang_user_profile', JSON.stringify(profile.value))
  }
}

const handleEditSubmit = (updatedData: UserProfile) => {
  showEditModal.value = false
  profile.value = {
    ...profile.value,
    name: updatedData.name,
    location: updatedData.location,
    email: updatedData.email,
    phone: updatedData.phone,
    avatar: updatedData.avatar
  }
  saveProfileState()
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
          <FeaturesProfileUserProfileMapSection />
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

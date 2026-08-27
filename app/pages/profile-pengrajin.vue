<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// Onboarding validation
onMounted(() => {
  if (import.meta.client) {
    const completed = localStorage.getItem('sedalang_onboarding_completed')
    if (!completed) {
      navigateTo('/onboarding')
      return
    }

    // Load dynamic profile details
    const savedProfile = localStorage.getItem('sedalang_artisan_profile')
    if (savedProfile) {
      try {
        profile.value = JSON.parse(savedProfile)
      } catch (e) {
        console.error(e)
      }
    }

    // Load skills
    const savedSkills = localStorage.getItem('sedalang_artisan_skills')
    if (savedSkills) {
      try {
        skills.value = JSON.parse(savedSkills)
      } catch (e) {
        console.error(e)
      }
    }

    // Load works
    const savedWorks = localStorage.getItem('sedalang_artisan_works')
    if (savedWorks) {
      try {
        works.value = JSON.parse(savedWorks)
      } catch (e) {
        console.error(e)
      }
    }
  }
})

// Save profile state
const saveProfileState = () => {
  if (import.meta.client) {
    localStorage.setItem('sedalang_artisan_profile', JSON.stringify(profile.value))
  }
}

const saveSkillsState = () => {
  if (import.meta.client) {
    localStorage.setItem('sedalang_artisan_skills', JSON.stringify(skills.value))
  }
}

const saveWorksState = () => {
  if (import.meta.client) {
    localStorage.setItem('sedalang_artisan_works', JSON.stringify(works.value))
  }
}

// Interfaces
interface ProfileData {
  name: string
  description: string
  location: string
  rating: number
  projectsCount: number
  avatar: string
}

interface WorkItem {
  id: number
  title: string
  description: string
  image: string
}

// Reactive States
const profile = ref<ProfileData>({
  name: 'Karyaloka Craft',
  description: 'Karyaloka Craft',
  location: 'Semarang Tengah, Jawa Tengah',
  rating: 4.9,
  projectsCount: 24,
  avatar: '/images/landing_page_images/default_pp.webp'
})

const skills = ref<string[]>([
  'Botol Kaca',
  'Kaca Bekas',
  'Dekorasi Rumah',
  'Lampu Dekoratif',
  'Upcycling'
])

const works = ref<WorkItem[]>([
  {
    id: 1,
    title: 'Tempat Pensil Kaleng Kemasan',
    description: 'Kaleng bekas dimanfaatkan kembali menjadi tempat pensil yang sederhana dan fungsional. Dengan tambahan dekorasi bernuansa natural, karya ini memberikan tampilan yang menarik sekaligus mengurangi limbah kemasan.',
    image: '/images/default_images/default_img.webp'
  },
  {
    id: 2,
    title: 'Lampu Meja Dekorasi',
    description: 'Ubah botol bekas menjadi lampu meja dekoratif yang unik dengan tambahan LED. Hasilnya memberikan kesan hangat dan estetik sekaligus memanfaatkan kembali barang yang sudah tidak terpakai.',
    image: '/images/default_images/default_img.webp'
  },
  {
    id: 3,
    title: 'Tote Bag Denim',
    description: 'Ubah celana jeans bekas menjadi tas tote yang praktis dan stylish. Bahan denim yang sudah tidak terpakai dimanfaatkan kembali menjadi tas yang kuat, fungsional, dan karya ini sekaligus mengurangi limbah tekstil.',
    image: '/images/default_images/default_img.webp'
  }
])

// Modal visibility toggles
const showEditModal = ref(false)
const showAddWorkModal = ref(false)
const showDetailModal = ref(false)
const selectedWork = ref<WorkItem | null>(null)

// Action Handlers
const handleUpdateSkills = (newSkills: string[]) => {
  skills.value = newSkills
  saveSkillsState()
}

const handleEditProfileSubmit = (updatedData: ProfileData) => {
  showEditModal.value = false
  profile.value = {
    ...profile.value,
    name: updatedData.name,
    description: updatedData.description,
    location: updatedData.location,
    projectsCount: updatedData.projectsCount,
    avatar: updatedData.avatar
  }
  saveProfileState()
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
        :skills="skills"
        @update:skills="handleUpdateSkills"
      />

      <!-- Location and Interactive Maplibre map section -->
      <FeaturesProfileMapSection />

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

import { defineNuxtRouteMiddleware, useCookie, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('sedalang_token')
  const authStore = useAuthStore()

  // Define public pages (accessible without authentication)
  const publicPages = ['/login', '/register', '/']
  const isPublicPage = publicPages.includes(to.path)

  // Redirect to login if user is not authenticated and trying to access a secure page
  if (!token.value && !isPublicPage) {
    return navigateTo('/login')
  }

  // If token exists, make sure we have the user profile loaded
  if (token.value && !authStore.user) {
    try {
      await authStore.getMe()
    } catch (e) {
      token.value = null
      return navigateTo('/login')
    }
  }

  // Redirect to dashboard if user is authenticated and trying to access login/register
  if (token.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dashboard-aiPage')
  }
})

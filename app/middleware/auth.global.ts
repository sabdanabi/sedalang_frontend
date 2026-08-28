import { defineNuxtRouteMiddleware, useCookie, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('sedalang_token')

  // Define public pages (accessible without authentication)
  const publicPages = ['/login', '/register', '/']
  const isPublicPage = publicPages.includes(to.path)

  // Define authenticated-only pages that should not redirect to dashboard
  const authOnlyPages = ['/onboarding']
  const isAuthOnlyPage = authOnlyPages.includes(to.path)

  // Redirect to login if user is not authenticated and trying to access a secure page
  if (!token.value && !isPublicPage) {
    return navigateTo('/login')
  }

  // Redirect to dashboard if user is authenticated and trying to access login/register
  // But allow access to /onboarding for authenticated users
  if (token.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dashboard-aiPage')
  }
})

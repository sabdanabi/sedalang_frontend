import { useRuntimeConfig } from '#app'

/**
 * Resolves the avatar URL.
 * If the URL is empty or null, returns the default profile picture path.
 * If it's a full URL, data URI, or local frontend path, returns it as-is.
 * Otherwise, prepends the backend base URL (apiBase) to the relative path.
 */
export const getAvatarUrl = (url?: string | null, seed: string = 'User'): string => {
  if (!url) {
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`
  }

  // Check if it's already a full URL or data URI
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }

  // Check if it's a local frontend public directory path (e.g. /images/)
  if (url.startsWith('/images/') || url.startsWith('/_nuxt/') || url.includes('/landing_page_images/')) {
    return url
  }

  // Otherwise, treat it as a relative backend path and prepend apiBase
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string
    const cleanBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    return `${cleanBase}${cleanUrl}`
  } catch (error) {
    console.error('Error resolving avatar URL:', error)
    return url
  }
}

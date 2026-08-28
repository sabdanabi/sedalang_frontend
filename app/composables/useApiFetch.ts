import { useRuntimeConfig, useCookie, navigateTo } from '#app'

export const useApiFetch = (request: any, opts: any = {}) => {
  const config = useRuntimeConfig()
  const token = useCookie('sedalang_token')

  const headers = {
    ...opts.headers,
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
  }

  return useFetch(request, {
    baseURL: config.public.apiBase,
    ...opts,
    headers,
    onResponseError({ response }) {
      if (response.status === 401) {
        token.value = null
        navigateTo('/login')
      }
    }
  })
}

// Wrapper for manual actions ($fetch equivalent)
export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('sedalang_token')

  const fetchInstance = (request: string, opts: any = {}) => {
    const headers = {
      ...opts.headers,
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
    }

    return $fetch(request, {
      baseURL: config.public.apiBase,
      ...opts,
      headers
    }).catch((err: any) => {
      if (err.response?.status === 401) {
        token.value = null
        navigateTo('/login')
      }
      throw err
    })
  }

  return fetchInstance
}

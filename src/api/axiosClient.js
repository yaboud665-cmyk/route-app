import axios from 'axios'

import { clearSession, getToken } from '@/utils/storage'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
})

// إرسال التوكن تلقائيًا مع كل request محمي
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// توحيد شكل الرد: نرجّع body مباشرة ({ success, message, data, meta })
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const hasSession = Boolean(getToken())

    // توكن منتهي/غير صالح → نعمل تسجيل خروج
    if (error.response?.status === 401 && hasSession) {
      clearSession()
      window.location.replace('/login')
    }

    return Promise.reject(error)
  },
)

export default api

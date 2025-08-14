import axios from 'axios'
import { getAccessToken, refreshAccessToken, logoutGlobal } from './authService'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      !error.response ||
      (error.response.status !== 401 && error.response.status !== 403)
    ) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const newAccessToken = await refreshAccessToken()
      if (!newAccessToken) {
        await logoutGlobal()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      localStorage.setItem('accessToken', newAccessToken)
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${newAccessToken}`

      window.location.reload()
      return
    } catch (err) {
      await logoutGlobal()
      window.location.href = '/login'
      return Promise.reject(err)
    }
  }
)

export default axiosInstance

import axios from 'axios'
import {
  getAccessToken,
  refreshAccessToken,
  logout,
  authEvents,
} from './authService'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

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

    console.log('Response interceptor triggered:', {
      status: error.response?.status,
      url: originalRequest?.url,
      retry: originalRequest?._retry,
    })

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      console.log('Request already retried, giving up')
      return Promise.reject(error)
    }

    if (isRefreshing) {
      console.log('Token is already refreshing, adding to queue')
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (token) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return axiosInstance(originalRequest)
          }
          return Promise.reject(new Error('Token refresh failed'))
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    console.log('Starting token refresh process')

    try {
      const newAccessToken = await refreshAccessToken()

      if (!newAccessToken) {
        console.log('Token refresh failed, logging out')
        processQueue(new Error('Failed to refresh token'), null)
        await logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      console.log('Token refreshed, processing queued requests')
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${newAccessToken}`
      processQueue(null, newAccessToken)

      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
      return axiosInstance(originalRequest)
    } catch (err) {
      console.error('Token refresh process failed:', err)
      processQueue(err, null)
      await logout()
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
      console.log('Token refresh process completed')
    }
  }
)

authEvents.addEventListener('tokenChanged', (event) => {
  const { token } = event.detail
  if (token) {
    console.log('Token updated in axios defaults')
  } else {
    console.log('Token removed from axios defaults')
    delete axiosInstance.defaults.headers.common['Authorization']
  }
})

export default axiosInstance

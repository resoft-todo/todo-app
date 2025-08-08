import axios from 'axios'
import { getAccessToken, refreshAccessToken, logout } from './authService'

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
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newAccessToken = await refreshAccessToken()

      if (!newAccessToken) {
        processQueue(new Error('Failed to refresh token'), null)
        await logout()
        return Promise.reject(error)
      }

      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${newAccessToken}`
      processQueue(null, newAccessToken)

      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
      return axiosInstance(originalRequest)
    } catch (err) {
      processQueue(err, null)
      await logout()
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInstance

import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const ACCESS_TOKEN_KEY = 'accessToken'
const USER_KEY = 'user'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setStoredUser(userObj) {
  if (userObj) {
    localStorage.setItem(USER_KEY, JSON.stringify(userObj))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

export async function refreshAccessToken() {
  try {
    const res = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    )

    if (res.status !== 200) {
      console.warn('Refresh returned non-200 status', res.status)
      return null
    }

    const data = res.data || {}
    const newAccess = data.accessToken || data.access_token || data.token

    if (!newAccess) {
      console.error('Refresh response does not contain accessToken')
      return null
    }

    setAccessToken(newAccess)
    return newAccess
  } catch (err) {
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403)
    ) {
      return null
    }
    console.error('Error while refreshing token:', err)
    return null
  }
}

export async function login(email, password) {
  try {
    const res = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    const data = res.data || {}
    const token = data.token || data.accessToken || data.access_token
    const user = data.user || null

    setAccessToken(token)
    setStoredUser(user)

    return { token, user }
  } catch (err) {
    console.error('Login failed:', err)
    if (err.status === 400 || err.status === 401 || err.status === 500)
      throw new Error('Invalid credentials')
    else throw new Error('Server error. Please try again later.')
  }
}

export async function register(name, email, password, confirmPassword) {
  try {
    await axios.post(
      `${API_URL}/auth/register`,
      { name, email, password, confirmPassword },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return true
  } catch (err) {
    console.error('Register failed:', err)
    if (err.status === 400 || err.status === 401 || err.status === 409)
      throw new Error('An account with this email already exists.')
    else throw new Error('Server error. Please try again later.')
  }
}

export async function logout() {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
  } catch (err) {
    console.warn('Logout request failed (ignore):', err)
  } finally {
    setAccessToken(null)
    setStoredUser(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}

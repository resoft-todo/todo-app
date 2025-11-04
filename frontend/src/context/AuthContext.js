import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react'
import {
  getUserProfile,
  updateUserNameProfile,
  updateNotificationsProfile,
} from '../api/userApi'

import { getAccessToken, logoutGlobal } from '../api/authService'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)
let fetchUserPromise = null

// const PUBLIC_PATHS = [
//   '/login',
//   '/register',
//   '/forgot-password',
//   '/reset-password/',
// ]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const fetchUser = useCallback(async () => {
    if (fetchUserPromise) {
      return fetchUserPromise
    }

    fetchUserPromise = (async () => {
      try {
        const userData = await getUserProfile()
        setUser(userData)
      } catch (error) {
        console.error('User is not authenticated', error)
        setUser(null)
        await logoutGlobal()
      } finally {
        fetchUserPromise = null
        setLoading(false)
      }
    })()

    return fetchUserPromise
  }, [])

  // useEffect(() => {
  //   fetchUser()
  // }, [fetchUser])

  useEffect(() => {
    // const isPublicPath = PUBLIC_PATHS.some((path) =>
    //   location.pathname.startsWith(path)
    // )
    //
    // if (isPublicPath) {
    //   setLoading(false)
    //   return
    // }

    const token = getAccessToken()
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [fetchUser])

  const updateUser = async (data) => {
    let updatedUser = { ...user }

    if (data.name && data.name !== user.name) {
      const response = await updateUserNameProfile(data.name)
      updatedUser.name = response.name
    }
    if (
      'isNotificationOn' in data &&
      data.isNotificationOn !== user.isNotificationOn
    ) {
      const response = await updateNotificationsProfile(data.isNotificationOn)
      updatedUser.isNotificationOn = response.isNotificationOn
    }
    setUser(updatedUser)
  }

  const logout = async () => {
    if (isLoggingOut) {
      console.log('Logout already in progress, ignoring second call.')
      return
    }

    try {
      setIsLoggingOut(true)

      await logoutGlobal()
      console.log('Logging out...')
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('An error occurred during logout:', error)
      navigate('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const value = {
    user,
    setUser,
    loading,
    logout,
    updateUser,
    refetchUser: fetchUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

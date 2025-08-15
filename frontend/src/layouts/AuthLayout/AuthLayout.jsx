import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken, refreshAccessToken } from '../../api/authService'

export default function AuthLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // const refreshToken = getRefreshToken()
        // console.log('refersh token', refreshToken)
        // if (refreshToken === null) {
        //   setIsAuthenticated(false)
        //   return
        // }
        let token = getAccessToken()

        if (!token) {
          token = await refreshAccessToken()
        }

        setIsAuthenticated(!!token)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

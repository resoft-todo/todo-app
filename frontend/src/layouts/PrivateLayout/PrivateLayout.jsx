import React, { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getAccessToken, refreshAccessToken } from '../../api/authService'

export default function PrivateLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
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
        <p className="mt-3 text-muted">Checking authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="protected-app">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

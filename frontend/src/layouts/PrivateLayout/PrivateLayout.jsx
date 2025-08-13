import React, { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getAccessToken, refreshAccessToken } from '../../api/authService'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllLists, selectSelectedListId } from '../../redux/selectors'
import { fetchListsAction } from '../../redux/actions/listsAction'
import Button from '../../components/common/Button'
import styles from './styles.module.scss'
import Sidebar from './Sidebar'

export default function PrivateLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  const lists = useSelector(selectAllLists)
  const selectedListId = useSelector(selectSelectedListId)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token = getAccessToken()
        if (!token) {
          console.log('No access token found, trying to refresh...')
          token = await refreshAccessToken()
        }

        setIsAuthenticated(!!token)

        if (token) {
          setIsAuthenticated(true)
          dispatch(fetchListsAction())
        } else {
          console.log('No valid token available, user needs to login')
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [dispatch])

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

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
    <div className={`d-flex vh-100 ${styles.layoutWrapper}`}>
      {isMobileSidebarOpen && (
        <div className={styles.backdrop} onClick={closeMobileSidebar} />
      )}

      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => {
          setSidebarCollapsed(!sidebarCollapsed)
        }}
        onDidSelect={closeMobileSidebar}
      />

      <main className={styles.mainContent}>
        <div className={styles.mobileHeader}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(true)}
            title="Open menu"
          >
            <i className="fas fa-bars fa-lg"></i>
          </Button>
        </div>

        <div className={styles.contentArea}>
          {selectedListId || lists.length > 0 ? (
            <Outlet />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center">
                <i className="fas fa-folder-plus fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Create your first list</h4>
                <p className="text-muted">
                  Use the sidebar to create and manage your lists.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

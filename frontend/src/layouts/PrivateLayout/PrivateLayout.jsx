import React, { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getAccessToken, refreshAccessToken } from '../../api/authService'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAllLists,
  selectListsLoading,
  selectSelectedListId,
} from '../../redux/selectors'
import {
  createListAction,
  deleteListAction,
  fetchListsAction,
  selectList,
} from '../../redux/actions/listsAction'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import styles from './styles.module.scss'

export default function PrivateLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()

  const lists = useSelector(selectAllLists)
  const listsLoading = useSelector(selectListsLoading)
  const selectedListId = useSelector(selectSelectedListId)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
  }, [])

  const handleSelectList = (listId) => {
    dispatch(selectList(listId))
  }

  const handleCreateList = async (e) => {
    e.preventDefault()
    if (!newListName.trim()) return

    try {
      await dispatch(createListAction(newListName.trim()))
      setNewListName('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating list:', error)
    }
  }

  const handleDeleteList = async (listId, e) => {
    e.stopPropagation()

    // Cofirm modal....

    try {
      await dispatch(deleteListAction(listId))
      window.alert('Good')
    } catch (error) {
      console.error('Error deleting list:', error)
    }
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
    <div className="d-flex vh-100">
      <div
        className={`${styles.sidebar} ${sidebarCollapsed ? 'collapsed' : ''}`}
      >
        {/* Sidebar Header */}
        <div className={styles.sidebarHeader}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              {!sidebarCollapsed && 'Lists'}
            </h5>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1"
            >
              <i
                className={`fas fa-chevron-${sidebarCollapsed ? 'right' : 'left'}`}
              ></i>
            </Button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className={styles.sidebarContent}>
          {listsLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              {!sidebarCollapsed && (
                <p className="small text-muted mt-2">Loading lists...</p>
              )}
            </div>
          ) : (
            <>
              {lists.map((list) => (
                <div
                  key={list.id}
                  className={`${styles.listItem} ${selectedListId === list.id ? 'selected' : ''}`}
                  onClick={() => handleSelectList(list.id)}
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    <i className="fas fa-folder me-2"></i>
                    {!sidebarCollapsed && (
                      <span className="text-truncate" title={list.name}>
                        {list.name}
                      </span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 ms-1"
                      onClick={(e) => handleDeleteList(list.id, e)}
                      title="Delete list"
                    >
                      <i className="fas fa-trash text-danger"></i>
                    </Button>
                  )}
                </div>
              ))}

              {!listsLoading && lists.length === 0 && !sidebarCollapsed && (
                <div className="text-center py-4">
                  <i className="fas fa-folder-plus fa-2x text-muted mb-2"></i>
                  <p className="small text-muted">No lists yet</p>
                  <p className="small text-muted">
                    Create your first list below
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          {showCreateForm && !sidebarCollapsed ? (
            <form onSubmit={handleCreateList} className="mb-0">
              <div className="input-group input-group-sm">
                <Input
                  type="text"
                  placeholder="List name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="form-control"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newListName.trim()}
                  title="Create list"
                >
                  <i className="fas fa-check"></i>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewListName('')
                  }}
                  title="Cancel"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="w-100"
              onClick={() => setShowCreateForm(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Create new list' : undefined}
            >
              <i className="fas fa-plus me-2"></i>
              {!sidebarCollapsed && 'New List'}
            </Button>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {selectedListId || lists.length === 0 ? (
          <Outlet />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="text-center">
              <i className="fas fa-arrow-left fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">Select a list to get started</h4>
              <p className="text-muted">
                Choose a list from the sidebar to view your tasks
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectAllLists,
  selectListsLoading,
  selectSelectedListId,
} from '../../redux/selectors'
import {
  createListAction,
  deleteListAction,
  selectList,
} from '../../redux/actions/listsAction'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import styles from './styles.module.scss'

export default function Sidebar({
  isMobileOpen,
  isCollapsed,
  onToggleCollapse,
  onDidSelect,
}) {
  const dispatch = useDispatch()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState('')

  const lists = useSelector(selectAllLists)
  const listsLoading = useSelector(selectListsLoading)
  const selectedListId = useSelector(selectSelectedListId)

  const handleSelectList = (listId) => {
    dispatch(selectList(listId))
    if (onDidSelect) {
      onDidSelect()
    }
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
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  return (
    <div
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.show : ''}`}
    >
      {/* Sidebar Header */}
      <div className={styles.sidebarHeader}>
        <div className="d-flex justify-content-between align-items-center">
          <h5
            className="mb-0"
            type="button"
            onClick={!isMobileOpen ? onToggleCollapse : () => {}}
          >
            <i className="fas fa-list me-2"></i>
            {!isCollapsed && 'Lists'}
          </h5>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className={styles.sidebarContent}>
        {listsLoading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            {!isCollapsed && (
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
                  {!isCollapsed && (
                    <span className="text-truncate" title={list.name}>
                      {list.name}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
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

            {!listsLoading && lists.length === 0 && !isCollapsed && (
              <div className="text-center py-4">
                <i className="fas fa-folder-plus fa-2x text-muted mb-2"></i>
                <p className="small text-muted">No lists yet</p>
                <p className="small text-muted">Create your first list below</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        {showCreateForm && !isCollapsed ? (
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
            onClick={() => setShowCreateForm(true)}
            title={isCollapsed ? 'Create new list' : undefined}
          >
            <i className={`fas fa-plus ${!isCollapsed ? 'me-2' : ''}`}></i>
            {!isCollapsed && (
              <span className={styles.listItemText}>New List</span>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

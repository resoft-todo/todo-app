import React, { useEffect, useState } from 'react'
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
  updateListNameAction,
} from '../../redux/actions/listsAction'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import styles from './styles.module.scss'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function Sidebar({
  isMobileOpen,
  isCollapsed,
  onToggleCollapse,
  onDidSelect,
}) {
  const dispatch = useDispatch()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const lists = useSelector(selectAllLists)
  const listsLoading = useSelector(selectListsLoading)
  const selectedListId = useSelector(selectSelectedListId)
  const [listIdToDelete, setListIdToDelete] = useState(null)

  const [loading, setLoading] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [editListId, setEditListId] = useState(null)
  const [editListName, setEditListName] = useState('')

  const handleSelectList = (listId) => {
    if (editListId === listId) return

    dispatch(selectList(listId))
    if (onDidSelect) {
      onDidSelect()
    }
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpenId(null)
    }
    if (menuOpenId !== null) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpenId])

  const handleEditList = (list, e) => {
    e.stopPropagation()
    setEditListId(list.id)
    setEditListName(list.name)
    setShowCreateForm(false)
    setMenuOpenId(null)
  }

  const cancelEdit = () => {
    setEditListId(null)
    setEditListName('')
  }

  const handleUpdateList = async (e) => {
    e.preventDefault()
    if (!editListName.trim()) return
    try {
      await dispatch(updateListNameAction(editListId, editListName.trim()))
      setEditListId(null)
      setEditListName('')
    } catch (error) {
      console.error('Error updating list:', error)
    }
  }

  const toggleMenu = (listId, e) => {
    e.stopPropagation()
    setMenuOpenId(menuOpenId === listId ? null : listId)
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

  const cancelCreate = () => {
    setShowCreateForm(false)
    setNewListName('')
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
  }

  const handleOpenDelete = (listId, e) => {
    e.stopPropagation()
    setListIdToDelete(listId)
    setShowConfirm(true)
  }

  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      await dispatch(deleteListAction(listIdToDelete))
      setShowConfirm(false)
      setListIdToDelete(null)
    } catch (error) {
      console.error('Error deleting list:', error)
    } finally {
      setLoading(false)
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
            {lists.map((list) =>
              editListId === list.id ? (
                <form
                  key={`edit-${list.id}`}
                  onSubmit={handleUpdateList}
                  className="mb-1"
                >
                  <div className="input-group input-group-sm">
                    <Input
                      type="text"
                      value={editListName}
                      onChange={(e) => setEditListName(e.target.value)}
                      autoFocus
                      maxLength={50}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!editListName.trim()}
                    >
                      <i className="fas fa-check"></i>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={cancelEdit}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                </form>
              ) : (
                <div
                  key={list.id}
                  className={`${styles.listItem} ${selectedListId === list.id ? 'selected' : ''}`}
                  onClick={() => handleSelectList(list.id)}
                >
                  <div className={styles.listNameContainer}>
                    <i className="fas fa-folder me-2"></i>
                    {!isCollapsed && (
                      <span className={styles.listNameText} title={list.name}>
                        {list.name}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="position-relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 ms-1"
                        onClick={(e) => toggleMenu(list.id, e)}
                        title="Options"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </Button>

                      {menuOpenId === list.id && (
                        <div className={styles.contextMenu}>
                          <div onClick={(e) => handleEditList(list, e)}>
                            Edit
                          </div>
                          <div onClick={(e) => handleOpenDelete(list.id, e)}>
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )}

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
                maxLength={50}
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
                onClick={cancelCreate}
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
            onClick={() => {
              setShowCreateForm(true)
            }}
            title={isCollapsed ? 'Create new list' : undefined}
            disabled={editListId !== null}
          >
            <i className={`fas fa-plus ${!isCollapsed ? 'me-2' : ''}`}></i>
            {!isCollapsed && (
              <span className={styles.listItemText}>New List</span>
            )}
          </Button>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete this list?"
        message={
          'Are you sure you want to delete this list? This action cannot be undone.'
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={loading}
      />
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import Modal from '../../common/Modal'
import Button from '../../common/Button'
import Input from '../../common/Input'
import styles from './styles.module.scss'

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, logout, updateUser, loading: userLoading } = useAuth()

  const [isEditingName, setIsEditingName] = useState(false)

  const [name, setName] = useState('')
  const [isNotificationOn, setNotificationOn] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const hasChanges = user
    ? name !== user.name || isNotificationOn !== user.isNotificationOn
    : false

  useEffect(() => {
    if (user) {
      setName(user.name)
      setNotificationOn(user.isNotificationOn)
    }
    setIsEditingName(false)
  }, [user, isOpen])

  const handleCancelEdit = () => {
    setName(user.name)
    setIsEditingName(false)
  }

  const handleSaveChanges = async () => {
    // if (!hasChanges) {
    //   onClose()
    //   return
    // }

    setIsSaving(true)
    try {
      await updateUser({ name, isNotificationOn })
      setIsEditingName(false)
      //onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = (e) => {
    e.stopPropagation()
    logout()
  }

  const modalFooter = (
    <>
      <Button
        variant="danger"
        outline
        onClick={handleLogout}
        disabled={isSaving}
      >
        <i className="fas fa-sign-out-alt me-2"></i>
        Logout
      </Button>
      <Button
        variant="primary"
        onClick={handleSaveChanges}
        disabled={!hasChanges || isSaving || userLoading}
      >
        {isSaving ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Saving...
          </>
        ) : (
          <>
            <i className="fas fa-save me-2"></i>
            Save Changes
          </>
        )}
      </Button>
    </>
  )

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      title="My Profile"
      footer={modalFooter}
    >
      {userLoading || !user ? (
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.profileRow}>
            <span className={styles.profileLabel}>Email:</span>
            <span className={styles.profileValue} title={user.email}>
              {user.email}
            </span>
          </div>

          <div className={styles.profileRow}>
            <span className={styles.profileLabel}>Name:</span>
            {isEditingName ? (
              <div className="input-group input-group-sm flex-grow-1">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleCancelEdit}
                  title="Cancel"
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            ) : (
              <>
                <span className={styles.profileValue} title={user.name}>
                  {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 ms-2"
                  onClick={() => setIsEditingName(true)}
                  title="Edit name"
                >
                  <i className="fas fa-pencil-alt text-muted"></i>
                </Button>
              </>
            )}
          </div>

          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="notificationSwitch"
              checked={isNotificationOn}
              onChange={() => setNotificationOn(!isNotificationOn)}
              disabled={isSaving}
            />
            <label className="form-check-label" htmlFor="notificationSwitch">
              Enable Email Notifications
            </label>
          </div>
        </>
      )}
    </Modal>
  )
}

export default ProfileModal

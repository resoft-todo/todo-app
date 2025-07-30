import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'

const modalRoot = document.getElementById('modal-root')

const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
}) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onCancel()
      setIsClosing(false)
    }, 300)
  }

  const handleConfirm = () => {
    onConfirm()
    handleClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      handleClose()
    }
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (!isOpen) return null

  return createPortal(
    <div
      className={`modal-backdrop ${isClosing ? 'fade-out' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`modal-content card text-center px-3 pt-4 pb-3 ${isClosing ? 'fade-out' : 'fade-in'}`}
      >
        <div className="mb-3">
          <i className="fas fa-exclamation-triangle text-danger fa-2x"></i>
        </div>
        <h5 className="fw-semibold mb-2 text-gray">{title}</h5>
        <p className="text-muted small mb-4">{message}</p>

        <div className="d-flex justify-content-center gap-2">
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4"
          >
            <>
              <i className="fas fa-check me-2"></i>
              {confirmText}
            </>
          </Button>
          <Button
            variant="dark"
            outline
            onClick={handleClose}
            disabled={loading}
          >
            <i className="fas fa-times me-2"></i>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    modalRoot
  )
}

export default ConfirmModal

import React, { useEffect, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { createPortal } from 'react-dom'

const modalRoot = document.getElementById('modal-root')

const TodoForm = ({
  onSubmit,
  loading = false,
  editTask = null,
  onCancel = null,
}) => {
  const [formData, setFormData] = useState({
    title: editTask ? editTask.title : '',
    description: editTask ? editTask.description : '',
  })
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    setFormData({
      title: editTask ? editTask.title : '',
      description: editTask ? editTask.description : '',
    })
  }, [editTask])
  const isEditing = !!editTask

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleCancel()

    if (formData.title.trim()) {
      if (isEditing) {
        onSubmit({ ...editTask, ...formData })
      } else {
        onSubmit({ ...formData })
      }
      setFormData({ title: '', description: '' })
    }
  }

  const handleCancel = () => {
    setIsClosing(true)

    setTimeout(() => {
      if (onCancel) {
        onCancel()
      }
      if (!isEditing) {
        setFormData({ title: '', description: '' })
      }
      setIsClosing(false)
    }, 300)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  const modalContent = (
    <div
      className={`modal-backdrop ${isClosing ? 'fade-out' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`modal-content card ${isClosing ? 'fade-out' : 'fade-in'}`}
      >
        <div className="card-header bg-light">
          <h5 className="card-title mb-0">
            <i
              className={`fas ${isEditing ? 'fa-edit' : 'fa-plus-circle'} me-2 text-primary`}
            ></i>
            {isEditing ? 'Edit task' : 'Add new task'}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                Task name *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a task name..."
                required
                disabled={loading}
                maxLength={50}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-semibold">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description..."
                rows={3}
                disabled={loading}
                maxLength={200}
                style={{ maxHeight: '150px', overflowY: 'auto' }}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              {isEditing && (
                <Button
                  type="button"
                  variant="primary"
                  outline
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !formData.title.trim()}
                className="px-4"
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    {isEditing ? 'Saving...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <i
                      className={`fas ${isEditing ? 'fa-save' : 'fa-plus'} me-2`}
                    ></i>
                    {isEditing ? 'Save changes' : 'Add new task'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, modalRoot)
}

export default TodoForm

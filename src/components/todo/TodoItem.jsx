import React, { useState } from 'react'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'

const TodoItem = ({ task, onToggle, onEdit, onDelete, loading = false }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const handleToggle = () => {
    onToggle(task._id, !task.isCompleted)
  }

  const handleEdit = () => {
    onEdit(task)
  }

  const handleDeleteClick = () => {
    onDelete(task._id)
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`card ${task.isCompleted ? 'task-completed' : ''}`}>
      <div className="card-body">
        <div className="d-flex align-items-start">
          <div className={'me-3'}>
            <Checkbox
              id={task._id}
              checked={task.isCompleted}
              onChange={handleToggle}
              disabled={loading}
            />
          </div>

          <div className={'flex-grow-1'}>
            <div className="d-flex justify-content-between align-items-start">
              <div className={'task-content'}>
                <div className="d-flex align-items-center">
                  <h6
                    className={`card-title mb-2 ${task.isCompleted ? 'text-decoration-line-through text-muted' : ''}`}
                  >
                    {task.title}
                  </h6>
                  {task.description && (
                    <button
                      className="btn btn-link btn-sm p-0 ms-2"
                      onClick={toggleDescription}
                      style={{ textDecoration: 'none' }}
                    >
                      <i
                        className={`fas fa-chevron-${isDescriptionExpanded ? 'up' : 'down'} text-muted`}
                        style={{ fontSize: '0.8rem' }}
                      ></i>
                    </button>
                  )}
                </div>

                {task.description && isDescriptionExpanded && (
                  <p
                    className={`card-text small mb-2 ${task.isCompleted ? 'text-muted' : 'text-gray'}`}
                  >
                    {task.description}
                  </p>
                )}

                {task.createdAt && (
                  <div className="text-muted small">
                    <i className={`fas fa-clock me-1`}></i>
                    {formatDate(task.createdAt)}
                  </div>
                )}
              </div>

              <div className={'btn-group btn-group-sm ms-3'} role={'group'}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleEdit}
                  disabled={loading}
                  title="Edit"
                >
                  <i className="fas fa-edit"></i>{' '}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleDeleteClick}
                  disabled={loading}
                  title="Delete"
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoItem

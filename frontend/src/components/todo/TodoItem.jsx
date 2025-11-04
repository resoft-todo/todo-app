import React, { useState } from 'react'
import Button from '../common/Button'
import Checkbox from '../common/Checkbox'
import { formatDate, isOverdue } from '../../utils/formats'
import { getListById } from '../../redux/selectors'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const TodoItem = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  loading = false,
  inDashboard = false,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const navigate = useNavigate()

  const handleToggle = () => {
    const newStatus = task.status !== 'completed'
    onToggle(task.id, newStatus)
  }

  const handleEdit = () => {
    onEdit(task)
  }

  const handleDeleteClick = () => {
    onDelete(task.id)
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  const list = useSelector(getListById(task.list?.id))

  return (
    <div
      className={`card ${task.status === 'completed' ? 'task-completed' : ''}`}
    >
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-center">
          <div className={'me-3'}>
            <Checkbox
              id={task.id}
              checked={task.status === 'completed'}
              onChange={handleToggle}
              disabled={loading}
            />
          </div>

          <div className={'flex-grow-1'}>
            <div className="d-flex justify-content-between align-items-start">
              <div className={'task-content'}>
                <div className="d-flex align-items-center">
                  <h6
                    className={`card-title mb-0 ${task.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}`}
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
                    className={`card-text small mb-2 ${task.status === 'completed' ? 'text-muted' : 'text-gray'}`}
                  >
                    {task.description}
                  </p>
                )}

                {(task.dueDate || (inDashboard && list)) && (
                  <div className="d-flex flex-wrap align-items-center todo-meta">
                    {task.dueDate && (
                      <div
                        className={`d-flex align-items-center me-3 mb-1 mt-1 ${
                          isOverdue(task.dueDate) && task.status !== 'completed'
                            ? 'text-danger'
                            : 'text-muted'
                        }`}
                      >
                        <i className="fas fa-clock me-1"></i>
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    )}

                    {inDashboard && list && (
                      <div className="d-flex align-items-center mb-1 mt-1 text-muted todo-folder-group">
                        <i className="fas fa-folder me-1"></i>
                        <span
                          className="todo-folder-name"
                          title={list.name}
                          onClick={() => navigate(`/lists/${list.id}`)}
                        >
                          {list.name}
                        </span>
                      </div>
                    )}
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

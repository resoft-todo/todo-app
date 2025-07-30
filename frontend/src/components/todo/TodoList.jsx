import React, { useState } from 'react'
import TodoItem from './TodoItem'

const TodoList = ({ tasks, onToggle, onEdit, onDelete, loading = false }) => {
  const [showCompleted, setShowCompleted] = useState(true)

  const activeTasks = tasks.filter((task) => !task.isCompleted)
  const completedTasks = tasks.filter((task) => task.isCompleted)

  const toggleCompleted = () => {
    setShowCompleted(!showCompleted)
  }
  if (tasks.length === 0) {
    return (
      <div className="text-center py-5 fade-in">
        <div className="mb-4">
          <i className="fas fa-clipboard-list text-muted"></i>
        </div>
        <h5 className="text-muted">No tasks yet</h5>
        <p className="text-muted">Add your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="todo-list">
      {activeTasks.length > 0 && (
        <div className="active-tasks d-flex flex-column gap-1 mb-4">
          {activeTasks.map((task) => (
            <div key={task._id}>
              <TodoItem
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={loading}
              />
            </div>
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="completed-section">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="text-gray fw-semibold mb-0">
              Completed ({completedTasks.length})
            </h6>
            <button
              className="btn btn-sm btn-light"
              onClick={toggleCompleted}
              aria-label="Toggle completed tasks"
            >
              <i
                className={`fas fa-chevron-${showCompleted ? 'up' : 'down'}`}
              ></i>
            </button>
          </div>
          {showCompleted && (
            <div className="d-flex flex-column gap-1">
              {completedTasks.map((task) => (
                <div key={task._id}>
                  <TodoItem
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    loading={loading}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TodoList

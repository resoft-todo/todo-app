import React, { useState, useEffect } from 'react'
import TodoForm from '../components/todo/TodoForm'
import TodoList from '../components/todo/TodoList'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import ConfirmModal from '../components/common/ConfirmModal'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveListTasks,
  selectActiveListTasksError,
  selectActiveListTasksLoading,
  selectAllLists,
  selectListsLoading,
  selectSelectedListId,
} from '../redux/selectors'
import { fetchListsAction } from '../redux/actions/listsAction'
import {
  createTaskAction,
  deleteTaskAction,
  fetchTasksForListAction,
  updateTaskAction,
} from '../redux/actions/tasksAction'

const TodoPage = () => {
  const dispatch = useDispatch()

  const lists = useSelector(selectAllLists)
  const listsLoading = useSelector(selectListsLoading)
  const selectedListId = useSelector(selectSelectedListId)
  const tasks = useSelector(selectActiveListTasks)
  const tasksLoading = useSelector(selectActiveListTasksLoading)
  const tasksError = useSelector(selectActiveListTasksError)

  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchListsAction())
  }, [dispatch])

  useEffect(() => {
    if (selectedListId) {
      dispatch(fetchTasksForListAction(selectedListId))
    }
  }, [selectedListId, dispatch])

  useEffect(() => {
    if (tasksError) {
      setError(tasksError)
    }
  }, [tasksError])

  const handleSubmitTask = async (taskData) => {
    try {
      setError(null)

      if (!selectedListId) {
        setError('No active list selected')
        return
      }

      if (editingTask) {
        await dispatch(
          updateTaskAction(editingTask.id, {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            dueDate: taskData.dueDate,
          })
        )
        setEditingTask(null)
      } else {
        await dispatch(
          createTaskAction(
            taskData.title,
            selectedListId,
            taskData.description,
            taskData.status,
            taskData.dueDate
          )
        )
      }
    } catch (err) {
      setError(
        editingTask
          ? 'Error saving changes. Please try again.'
          : 'Error creating task. Please try again.'
      )
      console.error('Error submitting task:', err)
    }
  }

  const handleToggleTask = async (id, isCompleted) => {
    try {
      setError(null)

      const currentTask = tasks.find((task) => task.id === id)
      if (!currentTask) {
        throw new Error('Task not found')
      }

      const status = isCompleted ? 'completed' : 'not_started'

      await dispatch(updateTaskAction(id, { status }))
    } catch (err) {
      setError('Error updating task status.')
      console.error('Error toggling task:', err)
    }
  }

  const handleEditTask = (task) => {
    console.log('Set editing task:', task)
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  const handleDeleteRequest = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    setTaskToDelete(task)
    setShowConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!taskToDelete || !selectedListId) return

    try {
      setError(null)
      await dispatch(deleteTaskAction(taskToDelete.id, selectedListId))

      if (editingTask && editingTask.id === taskToDelete.id) {
        setEditingTask(null)
      }

      setShowConfirm(false)
      setTaskToDelete(null)
    } catch (err) {
      setError('Error deleting task. Please try again.')
      console.error('Error deleting task:', err)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
    setTaskToDelete(null)
  }

  const handleCloseAlert = () => {
    setError(null)
  }

  if (listsLoading && lists.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading lists...</p>
      </div>
    )
  }

  if (!listsLoading && lists.length === 0) {
    return (
      <div className="min-vh-100 py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <div className="text-center py-5">
                <i className="fas fa-list-ul fa-3x text-muted mb-3"></i>
                <h3 className="text-muted">No lists found</h3>
                <p className="text-muted">
                  Create your first list to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedList = lists.find((list) => list.id === selectedListId)

  return (
    <div className="min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="todo-container">
              <div className="d-flex flex-md-row justify-content-center align-items-start mb-4 gap-3">
                <div className="todo-header text-center">
                  <h1 className="mb-1">
                    <i className="fas fa-tasks me-3"></i>
                    {selectedList ? selectedList.name : 'TODO List'}
                  </h1>
                  <p className="text-muted mb-0">
                    Organize your tasks efficiently
                  </p>
                </div>
              </div>

              <div>
                {error && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={handleCloseAlert}
                    className="mb-4"
                  >
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </Alert>
                )}

                {showForm && (
                  <div className="mb-4">
                    <TodoForm
                      onSubmit={handleSubmitTask}
                      loading={tasksLoading}
                      editTask={editingTask}
                      onCancel={() => {
                        handleCancelEdit()
                        setShowForm(false)
                      }}
                    />
                  </div>
                )}

                {tasksLoading && tasks.length === 0 && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading tasks...</p>
                  </div>
                )}

                {(!tasksLoading || tasks.length > 0) && selectedListId && (
                  <TodoList
                    tasks={tasks}
                    onToggle={handleToggleTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteRequest}
                    loading={tasksLoading}
                  />
                )}
              </div>

              {selectedListId && (
                <Button
                  className="rounded-btn"
                  variant="light"
                  onClick={() => {
                    setShowForm((prev) => !prev)
                    setEditingTask(null)
                  }}
                >
                  <i className="fas fa-plus"></i>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Delete this task?"
        message={
          'Are you sure you want to delete this task? This action cannot be undone.'
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={tasksLoading}
      />
    </div>
  )
}

export default TodoPage

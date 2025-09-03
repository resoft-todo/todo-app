import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TodoList from '../components/todo/TodoList'
import { selectTodayTasks, selectTodayTasksLoading } from '../redux/selectors'
import { fetchTodayTasksAction } from '../redux/actions/dashboardAction'
import {
  updateTaskAction,
  deleteTaskAction,
} from '../redux/actions/tasksAction'
import ConfirmModal from '../components/common/ConfirmModal'
import { toast } from 'react-toastify'
import TodoForm from '../components/todo/TodoForm'
//import Button from '../components/common/Button'
import { selectAllLists, selectSelectedListId } from '../redux/selectors'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const todayTasks = useSelector(selectTodayTasks) || []
  const loading = useSelector(selectTodayTasksLoading)
  const lists = useSelector(selectAllLists)
  const selectedListId = useSelector(selectSelectedListId)

  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  useEffect(() => {
    if (!todayTasks || (todayTasks && todayTasks.length === 0)) {
      dispatch(fetchTodayTasksAction())
    }
  }, [])

  const handleSubmitTask = async (taskData) => {
    try {
      if (!selectedListId && !taskData.listId) {
        toast.error('Please select a list or create one to add new tasks.')
        return
      }
      const listIdToUse = taskData.listId || selectedListId

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
        //toast.success('Task updated successfully!')
      } else {
        await dispatch(
          updateTaskAction(null, {
            title: taskData.title,
            listId: listIdToUse,
            description: taskData.description,
            status: taskData.status,
            dueDate: taskData.dueDate,
          })
        )
        //toast.success('Task created successfully!')
      }
      setShowForm(false)
    } catch (err) {
      toast.error('Error submitting task. Please try again.')
      console.error('Error submitting task:', err)
    }
  }

  const handleToggleTask = async (id, isCompleted) => {
    try {
      const currentTask = todayTasks.find((task) => task.id === id)
      if (!currentTask) {
        toast.error("Task not found in today's tasks.")
        return
      }
      const status = isCompleted ? 'completed' : 'not_started'
      await dispatch(updateTaskAction(id, { status }))
      //toast.success(`Task "${currentTask.title}" status updated.`)
    } catch (err) {
      toast.error('Error updating task status.')
      console.error('Error toggling task:', err)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setShowForm(false)
  }

  const handleDeleteRequest = (taskId) => {
    const task = todayTasks.find((t) => t.id === taskId)
    setTaskToDelete(task)
    setShowConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return

    try {
      await dispatch(deleteTaskAction(taskToDelete.id, taskToDelete.listId))
      setShowConfirm(false)
      setTaskToDelete(null)
      //toast.success('Task deleted successfully!')
    } catch (err) {
      toast.error('Error deleting task. Please try again.')
      console.error('Error deleting task:', err)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
    setTaskToDelete(null)
  }

  return (
    <div className="py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="dashboard-container">
              <h1 className="mb-4 text-center">Today&apos;s Tasks</h1>

              {showForm && (
                <div className="mb-4">
                  <TodoForm
                    onSubmit={handleSubmitTask}
                    loading={loading}
                    editTask={editingTask}
                    onCancel={handleCancelEdit}
                    lists={lists}
                    initialListId={selectedListId}
                  />
                </div>
              )}

              {loading && todayTasks.length === 0 && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">
                    Loading today&apos;s tasks...
                  </p>
                </div>
              )}

              {!loading && todayTasks.length === 0 && (
                <div className="text-center py-5">
                  <h3 className="text-muted mb-3">
                    No tasks scheduled for today!
                  </h3>
                  <p className="text-muted">
                    You&apos;re all caught up, or plan something new!
                  </p>
                </div>
              )}

              {todayTasks.length > 0 && (
                <TodoList
                  tasks={todayTasks}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteRequest}
                  loading={loading}
                  inDashboard={true}
                />
              )}

              {/*<Button*/}
              {/*  className="rounded-btn shadow-sm"*/}
              {/*  variant="primary"*/}
              {/*  onClick={() => {*/}
              {/*    setShowForm((prev) => !prev)*/}
              {/*    setEditingTask(null)*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <i className="fas fa-plus"></i>*/}
              {/*</Button>*/}
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
        loading={loading}
      />
    </div>
  )
}

export default DashboardPage

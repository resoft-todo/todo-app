import axiosInstance from './axiosInstance'

export const createTask = async (
  title,
  listId,
  description,
  status,
  dueDate
) => {
  try {
    const payload = { title, listId }
    if (description) payload.description = description
    if (status) payload.status = status
    if (dueDate) payload.dueDate = dueDate

    const response = await axiosInstance.post('/tasks', payload)
    return response.data
  } catch (err) {
    console.error('Failed to create task: ', err)
    throw err
  }
}

export const getTasksByStatus = async (status) => {
  try {
    const response = await axiosInstance.get('/tasks', {
      params: { status },
    })
    return response.data
  } catch (err) {
    console.error('Failed to get tasks:', err)
    throw err
  }
}

export const getTasksForList = async (listId, status) => {
  try {
    const params = {}
    if (status !== undefined && status !== null) {
      params.status = status
    }

    const response = await axiosInstance.get(`/lists/${listId}/tasks`, {
      params,
    })
    return response.data
  } catch (err) {
    console.error('Failed to get tasks for list:', err)
    throw err
  }
}

export const updateTask = async (taskId, updateData) => {
  try {
    // updateData — title, description, status, dueDate
    const response = await axiosInstance.patch(`/tasks/${taskId}`, updateData)
    return response.data
  } catch (err) {
    console.error('Failed to update task:', err)
    throw err
  }
}

export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`)
    return response.data
  } catch (err) {
    console.error(`Failed to delete task by id ${taskId}: `, err)
    throw err
  }
}

export const getTodayTasks = async () => {
  try {
    const response = await axiosInstance.get(`/tasks/today`)
    return response.data
  } catch (err) {
    console.error('Failed to get today tasks for list:', err)
    throw err
  }
}

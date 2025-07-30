import axiosInstance from './axiosInstance'

export const getTasks = async () => {
  try {
    const response = await axiosInstance.get('/tasks')
    return response.data
  } catch (err) {
    console.error('Failed to get tasks: ', err)
    throw err
  }
}

export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post('/tasks', taskData)
    return response.data
  } catch (err) {
    console.error('Failed to create task: ', err)
    throw err
  }
}

export const updateTask = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/tasks/${id}`, updatedData)
    return response.data
  } catch (err) {
    console.error(`Failed to update task ${id}: `, err)
    throw err
  }
}

export const deleteTask = async (id) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${id}`)
    return response.data
  } catch (err) {
    console.error(`Failed to delete task ${id}: `, err)
    throw err
  }
}

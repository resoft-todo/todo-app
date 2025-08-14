import axiosInstance from './axiosInstance'

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/users/me')
    return response.data
  } catch (err) {
    console.error('Failed to get user profile: ', err)
    throw err
  }
}

export const deleteUserProfile = async () => {
  try {
    const response = await axiosInstance.delete('/users/me')
    return response.data
  } catch (err) {
    console.error('Failed to delete user profile: ', err)
    throw err
  }
}

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users')
    return response.data
  } catch (err) {
    console.error('Failed to get users: ', err)
    throw err
  }
}

export const updateUserNameProfile = async (newName) => {
  try {
    const response = await axiosInstance.patch('/users/me/name', {
      newName: newName,
    })
    return response.data
  } catch (err) {
    console.error(`Failed to update user name to ${newName}: `, err)
    throw err
  }
}

export const updateNotificationsProfile = async (isNotificationOn) => {
  try {
    const response = await axiosInstance.patch('/users/me/notifications', {
      isNotificationOn: isNotificationOn,
    })
    return response.data
  } catch (err) {
    console.error(`Failed to update notifications ${isNotificationOn}: `, err)
    throw err
  }
}

import axiosInstance from './axiosInstance'

export const getAllLists = async () => {
  try {
    const response = await axiosInstance.get('/lists')
    return response.data
  } catch (err) {
    console.error('Failed to get lists: ', err)
    throw err
  }
}

export const createList = async (name, groupId) => {
  try {
    const payload = groupId ? { name, groupId } : { name }

    const response = await axiosInstance.post('/lists', payload)
    return response.data
  } catch (err) {
    console.error('Failed to create list: ', err)
    throw err
  }
}

export const getListById = async (id) => {
  try {
    const response = await axiosInstance.get(`/lists/${id}`)
    return response.data
  } catch (err) {
    console.error(`Failed to get lists by id ${id}: `, err)
    throw err
  }
}

export const updateListName = async (listId, name) => {
  try {
    const response = await axiosInstance.patch(`/lists/${listId}`, name)
    return response.data
  } catch (err) {
    console.error(`Failed to update listName ${listId} to ${name}: `, err)
    throw err
  }
}

export const deleteListById = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lists/${id}`)
    return response.data
  } catch (err) {
    console.error(`Failed to delete list by id ${id}: `, err)
    throw err
  }
}

export const addListToGroup = async (listId, groupId) => {
  try {
    const response = await axiosInstance.patch(
      `/lists/${listId}/group`,
      groupId
    )
    return response.data
  } catch (err) {
    console.error(
      `Failed to add list by id ${listId} to group ${groupId}: `,
      err
    )
    throw err
  }
}

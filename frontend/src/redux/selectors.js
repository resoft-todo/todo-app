// Selectors for lists
import { createSelector } from 'reselect'

export const selectAllLists = (state) => state.lists.items
export const selectListsLoading = (state) => state.lists.loading
export const selectListsError = (state) => state.lists.error
export const selectSelectedListId = (state) => state.lists.selectedListId
export const selectSelectedList = (state) => {
  const selectedId = selectSelectedListId(state)
  return selectedId
    ? state.lists.items.find((list) => list.id === selectedId)
    : null
}

// Selectors for tasks
export const selectTasksByListId = (listId) => (state) =>
  state.tasks.byListId[listId] || []

export const selectTasksLoadingForList = (listId) => (state) =>
  state.tasks.loading[listId] || false

export const selectTasksErrorForList = (listId) => (state) =>
  state.tasks.error[listId] || null

// Selectors for active list
export const selectActiveListTasks = createSelector(
  [selectSelectedListId, (state) => state.tasks.byListId],
  (selectedListId, byListId) => {
    if (!selectedListId) return []
    return byListId[selectedListId] || []
  }
)

export const selectActiveListTasksLoading = (state) => {
  const selectedListId = selectSelectedListId(state)
  return selectedListId
    ? selectTasksLoadingForList(selectedListId)(state)
    : false
}

export const selectActiveListTasksError = (state) => {
  const selectedListId = selectSelectedListId(state)
  return selectedListId ? selectTasksErrorForList(selectedListId)(state) : null
}

// Selectors for tasks with status
export const selectTasksByStatus = (listId, status) => (state) => {
  const tasks = selectTasksByListId(listId)(state)
  return status ? tasks.filter((task) => task.status === status) : tasks
}

export const selectActiveListTasksByStatus = (status) => (state) => {
  const tasks = selectActiveListTasks(state)
  return status ? tasks.filter((task) => task.status === status) : tasks
}

// Selectors for count tasks
export const selectTasksCountByListId = (listId) => (state) => {
  const tasks = selectTasksByListId(listId)(state)
  return tasks.length
}

export const selectCompletedTasksCountByListId = (listId) => (state) => {
  const tasks = selectTasksByListId(listId)(state)
  return tasks.filter((task) => task.status === 'completed').length
}

// Selector: tasks loaded or not
export const selectAreTasksLoadedForList = (listId) => (state) => {
  return Boolean(state.tasks.byListId[listId])
}

// Selector: dashboard tasks
export const selectTodayTasks = (state) => state.dashboard.todayTasks
export const selectTodayTasksLoading = (state) => state.dashboard.loading
export const selectTodayTasksError = (state) => state.dashboard.error

export const getListById = (listId) => (state) => {
  const list = state.lists.items.find((list) => list.id === listId)
  return list
}

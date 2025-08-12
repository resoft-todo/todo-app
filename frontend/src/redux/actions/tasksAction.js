import {
  createTask,
  deleteTask,
  getTasksForList,
  updateTask,
} from '../../api/taskApi'

export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST'
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS'
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE'

export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS'
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS'
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS'

export const CLEAR_TASKS_FOR_LIST = 'CLEAR_TASKS_FOR_LIST'

const fetchTasksRequest = (listId) => ({
  type: FETCH_TASKS_REQUEST,
  payload: { listId },
})
const fetchTasksSuccess = (tasks, listId) => ({
  type: FETCH_TASKS_SUCCESS,
  payload: { tasks, listId },
})
const fetchTasksFailure = (error, listId) => ({
  type: FETCH_TASKS_FAILURE,
  payload: { error, listId },
})

const createTaskSuccess = (task) => ({
  type: CREATE_TASK_SUCCESS,
  payload: task,
})
const updateTaskSuccess = (task) => ({
  type: UPDATE_TASK_SUCCESS,
  payload: task,
})
const deleteTaskSuccess = (taskId, listId) => ({
  type: DELETE_TASK_SUCCESS,
  payload: { taskId, listId },
})

export const clearTasksForList = (listId) => ({
  type: CLEAR_TASKS_FOR_LIST,
  payload: listId,
})

export const fetchTasksForListAction =
  (listId, status) => async (dispatch, getState) => {
    const { tasks } = getState()
    if (tasks.byListId[listId] && !tasks.loading[listId]) {
      return
    }
    dispatch(fetchTasksRequest(listId))
    try {
      const data = await getTasksForList(listId, status)
      dispatch(fetchTasksSuccess(data, listId))
    } catch (err) {
      dispatch(fetchTasksFailure(err.message, listId))
    }
  }

export const createTaskAction =
  (title, listId, description, status, dueDate) => async (dispatch) => {
    try {
      const newTask = await createTask(
        title,
        listId,
        description,
        status,
        dueDate
      )
      dispatch(createTaskSuccess(newTask))
    } catch (err) {
      console.error(err)
    }
  }

export const updateTaskAction = (taskId, updateData) => async (dispatch) => {
  try {
    const updated = await updateTask(taskId, updateData)
    dispatch(updateTaskSuccess(updated))
  } catch (err) {
    console.error(err)
  }
}

export const deleteTaskAction = (taskId, listId) => async (dispatch) => {
  try {
    await deleteTask(taskId)
    dispatch(deleteTaskSuccess(taskId, listId))
  } catch (err) {
    console.error(err)
  }
}

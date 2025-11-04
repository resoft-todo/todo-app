import { getTodayTasks } from '../../api/taskApi'

export const FETCH_TODAY_TASKS_REQUEST = 'FETCH_TODAY_TASKS_REQUEST'
export const FETCH_TODAY_TASKS_SUCCESS = 'FETCH_TODAY_TASKS_SUCCESS'
export const FETCH_TODAY_TASKS_FAILURE = 'FETCH_TODAY_TASKS_FAILURE'

export const SET_TODAY_TASKS_WS = 'SET_TODAY_TASKS_WS' // Для завдань, отриманих через WebSocket

export const UPDATE_TODAY_TASK_SUCCESS = 'UPDATE_TODAY_TASK_SUCCESS'
export const DELETE_TODAY_TASK_SUCCESS = 'DELETE_TODAY_TASK_SUCCESS'

// Action Creators
export const fetchTodayTasksRequest = () => ({
  type: FETCH_TODAY_TASKS_REQUEST,
})
export const fetchTodayTasksSuccess = (tasks) => ({
  type: FETCH_TODAY_TASKS_SUCCESS,
  payload: tasks,
})
export const fetchTodayTasksFailure = (error) => ({
  type: FETCH_TODAY_TASKS_FAILURE,
  payload: error,
})

export const setTodayTasksWS = (tasks) => ({
  type: SET_TODAY_TASKS_WS,
  payload: tasks,
})

export const updateTodayTaskSuccess = (task) => ({
  type: UPDATE_TODAY_TASK_SUCCESS,
  payload: task,
})

export const deleteTodayTaskSuccess = (taskId) => ({
  type: DELETE_TODAY_TASK_SUCCESS,
  payload: taskId,
})

export const fetchTodayTasksAction = () => async (dispatch) => {
  dispatch(fetchTodayTasksRequest())
  try {
    const tasks = await getTodayTasks()
    dispatch(fetchTodayTasksSuccess(tasks))
  } catch (err) {
    dispatch(fetchTodayTasksFailure(err.message))
    console.error("Error fetching today's tasks:", err)
    throw err
  }
}

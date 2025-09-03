import {
  FETCH_TODAY_TASKS_REQUEST,
  FETCH_TODAY_TASKS_SUCCESS,
  FETCH_TODAY_TASKS_FAILURE,
  SET_TODAY_TASKS_WS,
} from '../actions/dashboardAction'

import {
  UPDATE_TASK_SUCCESS,
  DELETE_TASK_SUCCESS,
  CREATE_TASK_SUCCESS,
} from '../actions/tasksAction'
import { isOverdue } from '../../utils/formats'

const initialState = {
  todayTasks: [],
  loading: false,
  error: null,
  isFetched: false,
}

export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TODAY_TASKS_REQUEST:
      return { ...state, loading: true, error: null }

    case FETCH_TODAY_TASKS_SUCCESS:
    case SET_TODAY_TASKS_WS:
      return {
        ...state,
        loading: false,
        todayTasks: action.payload,
        error: null,
        isFetched: true,
      }

    case FETCH_TODAY_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload }

    case UPDATE_TASK_SUCCESS: {
      if (!state.isFetched) {
        return state
      }
      const updatedTask = action.payload

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const isTaskStillForToday =
        updatedTask.dueDate && isOverdue(updatedTask.dueDate)

      const taskIndex = state.todayTasks.findIndex(
        (task) => task.id === updatedTask.id
      )

      if (taskIndex > -1) {
        if (isTaskStillForToday) {
          return {
            ...state,
            todayTasks: state.todayTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          }
        } else {
          return {
            ...state,
            todayTasks: state.todayTasks.filter(
              (task) => task.id !== updatedTask.id
            ),
          }
        }
      } else {
        if (isTaskStillForToday) {
          return {
            ...state,
            todayTasks: [...state.todayTasks, updatedTask],
          }
        }
      }
      return state
    }

    case DELETE_TASK_SUCCESS: {
      if (!state.isFetched) {
        return state
      }
      const { taskId } = action.payload
      return {
        ...state,
        todayTasks: state.todayTasks.filter((task) => task.id !== taskId),
      }
    }

    case CREATE_TASK_SUCCESS: {
      const newTask = action.payload

      if (!state.isFetched) {
        return state
      }

      if (newTask.dueDate && !isOverdue(newTask.dueDate)) {
        return state
      }

      return {
        ...state,
        todayTasks: [...state.todayTasks, newTask],
      }
    }

    default:
      return state
  }
}

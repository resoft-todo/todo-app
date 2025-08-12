import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  CREATE_TASK_SUCCESS,
  UPDATE_TASK_SUCCESS,
  DELETE_TASK_SUCCESS,
  CLEAR_TASKS_FOR_LIST,
} from '../actions/tasksAction'
import { DELETE_LIST_SUCCESS } from '../actions/listsAction'

const initialState = {
  byListId: {}, // { [listId]: [task1, task2, ...] }
  loading: {}, // { [listId]: boolean }
  error: {}, // { [listId]: string }
}

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_REQUEST:
      const { listId: requestListId } = action.payload
      return {
        ...state,
        loading: {
          ...state.loading,
          [requestListId]: true,
        },
        error: {
          ...state.error,
          [requestListId]: null,
        },
      }
    case FETCH_TASKS_SUCCESS:
      const { tasks, listId: successListId } = action.payload
      return {
        ...state,
        byListId: {
          ...state.byListId,
          [successListId]: tasks,
        },
        loading: {
          ...state.loading,
          [successListId]: false,
        },
        error: {
          ...state.error,
          [successListId]: null,
        },
      }
    case FETCH_TASKS_FAILURE:
      const { error, listId: failureListId } = action.payload
      return {
        ...state,
        loading: {
          ...state.loading,
          [failureListId]: false,
        },
        error: {
          ...state.error,
          [failureListId]: error,
        },
      }
    case CREATE_TASK_SUCCESS:
      const newTask = action.payload
      const taskListId = newTask.list?.id || newTask.listId

      return {
        ...state,
        byListId: {
          ...state.byListId,
          [taskListId]: [...(state.byListId[taskListId] || []), newTask],
        },
      }
    case UPDATE_TASK_SUCCESS:
      const updatedTask = action.payload
      const updatedTaskListId = updatedTask.list?.id || updatedTask.listId

      return {
        ...state,
        byListId: {
          ...state.byListId,
          [updatedTaskListId]: (state.byListId[updatedTaskListId] || []).map(
            (task) => (task.id === updatedTask.id ? updatedTask : task)
          ),
        },
      }
    case DELETE_TASK_SUCCESS:
      const { taskId, listId: deleteListId } = action.payload
      return {
        ...state,
        byListId: {
          ...state.byListId,
          [deleteListId]: (state.byListId[deleteListId] || []).filter(
            (task) => task.id !== taskId
          ),
        },
      }

    case CLEAR_TASKS_FOR_LIST:
      const listIdToClear = action.payload
      const newByListId = { ...state.byListId }
      const newLoading = { ...state.loading }
      const newError = { ...state.error }

      delete newByListId[listIdToClear]
      delete newLoading[listIdToClear]
      delete newError[listIdToClear]

      return {
        ...state,
        byListId: newByListId,
        loading: newLoading,
        error: newError,
      }

    case DELETE_LIST_SUCCESS:
      const deletedListId = action.payload
      const cleanByListId = { ...state.byListId }
      const cleanLoading = { ...state.loading }
      const cleanError = { ...state.error }

      delete cleanByListId[deletedListId]
      delete cleanLoading[deletedListId]
      delete cleanError[deletedListId]

      return {
        ...state,
        byListId: cleanByListId,
        loading: cleanLoading,
        error: cleanError,
      }

    default:
      return state
  }
}

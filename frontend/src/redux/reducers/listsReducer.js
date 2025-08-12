import {
  FETCH_LISTS_REQUEST,
  FETCH_LISTS_SUCCESS,
  FETCH_LISTS_FAILURE,
  CREATE_LIST_SUCCESS,
  UPDATE_LIST_SUCCESS,
  DELETE_LIST_SUCCESS,
  SELECT_LIST,
} from '../actions/listsAction'

const initialState = {
  items: [],
  loading: false,
  error: null,
  selectedListId: null,
}

export const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LISTS_REQUEST:
      return { ...state, loading: true, error: null }

    case FETCH_LISTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null,
      }

    case FETCH_LISTS_FAILURE:
      return { ...state, loading: false, error: action.payload }

    case CREATE_LIST_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.payload],
      }

    case UPDATE_LIST_SUCCESS:
      return {
        ...state,
        items: state.items.map((list) =>
          list.id === action.payload.id ? action.payload : list
        ),
      }

    case DELETE_LIST_SUCCESS:
      const newItems = state.items.filter((list) => list.id !== action.payload)
      return {
        ...state,
        items: newItems,
        selectedListId:
          state.selectedListId === action.payload
            ? newItems.length > 0
              ? newItems[0].id
              : null
            : state.selectedListId,
      }
    case SELECT_LIST:
      return { ...state, selectedListId: action.payload }
    default:
      return state
  }
}

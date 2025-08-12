import {
  createList,
  deleteListById,
  getAllLists,
  updateListName,
} from '../../api/listApi'

export const FETCH_LISTS_REQUEST = 'FETCH_LISTS_REQUEST'
export const FETCH_LISTS_SUCCESS = 'FETCH_LISTS_SUCCESS'
export const FETCH_LISTS_FAILURE = 'FETCH_LISTS_FAILURE'

export const CREATE_LIST_SUCCESS = 'CREATE_LIST_SUCCESS'
export const UPDATE_LIST_SUCCESS = 'UPDATE_LIST_SUCCESS'
export const DELETE_LIST_SUCCESS = 'DELETE_LIST_SUCCESS'

export const SELECT_LIST = 'SELECT_LIST'

export const fetchListsRequest = () => ({ type: FETCH_LISTS_REQUEST })
export const fetchListsSuccess = (lists) => ({
  type: FETCH_LISTS_SUCCESS,
  payload: lists,
})
export const fetchListsFailure = (error) => ({
  type: FETCH_LISTS_FAILURE,
  payload: error,
})

const createListSuccess = (list) => ({
  type: CREATE_LIST_SUCCESS,
  payload: list,
})
const updateListSuccess = (list) => ({
  type: UPDATE_LIST_SUCCESS,
  payload: list,
})
const deleteListSuccess = (listId) => ({
  type: DELETE_LIST_SUCCESS,
  payload: listId,
})

export const selectList = (listId) => ({ type: SELECT_LIST, payload: listId })

export const fetchListsAction = () => async (dispatch) => {
  dispatch(fetchListsRequest())
  try {
    const lists = await getAllLists()
    dispatch(fetchListsSuccess(lists))

    if (lists.length > 0) {
      dispatch(selectList(lists[0].id))
    }
  } catch (err) {
    dispatch(fetchListsFailure(err.message))
  }
}

export const createListAction = (name, groupId) => async (dispatch) => {
  try {
    const newList = await createList(name, groupId)
    dispatch(createListSuccess(newList))
  } catch (err) {
    console.error(err)
  }
}

export const updateListNameAction = (listId, name) => async (dispatch) => {
  try {
    const updated = await updateListName(listId, name)
    dispatch(updateListSuccess(updated))
  } catch (err) {
    console.error(err)
  }
}

export const deleteListAction = (listId) => async (dispatch) => {
  try {
    await deleteListById(listId)
    dispatch(deleteListSuccess(listId))
  } catch (err) {
    console.error(err)
  }
}

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { listsReducer } from './reducers/listsReducer'
import { tasksReducer } from './reducers/tasksReducer'

const rootReducer = combineReducers({
  lists: listsReducer,
  tasks: tasksReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

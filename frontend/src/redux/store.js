import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { listsReducer } from './reducers/listsReducer'
import { tasksReducer } from './reducers/tasksReducer'
import { thunk } from 'redux-thunk'

const rootReducer = combineReducers({
  lists: listsReducer,
  tasks: tasksReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
)

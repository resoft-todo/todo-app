import React from 'react'
import TodoPage from '../pages/TodoPage'

export const privateRoutes = [
  {
    index: true,
    element: <TodoPage />,
  },
  {
    path: '/todos',
    element: <TodoPage />,
  },
  {
    path: '/lists',
    element: <TodoPage />,
  },
  {
    path: '/lists/:listId',
    element: <TodoPage />,
  },
]

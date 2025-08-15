import React from 'react'
import TodoPage from '../pages/TodoPage'
import { Navigate } from 'react-router-dom'

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
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

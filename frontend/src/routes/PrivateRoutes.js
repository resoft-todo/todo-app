import React from 'react'
import TodoPage from '../pages/TodoPage'
import { Navigate } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'

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
    path: 'lists/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]

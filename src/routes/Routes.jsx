import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TodoPage from '../pages/TodoPage'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<TodoPage />} />
    <Route path="*" element={<TodoPage />} />
  </Routes>
)

export default AppRoutes

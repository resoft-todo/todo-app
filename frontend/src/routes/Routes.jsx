import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TodoPage from '../pages/TodoPage'
import Login from '../pages/Auth/Login'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<TodoPage />} />
    <Route path="*" element={<TodoPage />} />
    <Route path="/login" element={<Login />} />
  </Routes>
)

export default AppRoutes

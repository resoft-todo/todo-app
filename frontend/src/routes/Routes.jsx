import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TodoPage from '../pages/TodoPage'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<TodoPage />} />
    <Route path="*" element={<TodoPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
)

export default AppRoutes

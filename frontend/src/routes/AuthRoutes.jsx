import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ResetPassword from '../pages/Auth/ResetPassword'
import ForgotPassword from '../pages/Auth/ForgotPassword'

export default function AuthRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>
    </Routes>
  )
}

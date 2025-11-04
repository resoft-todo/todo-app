import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import { authRoutes } from './AuthRoutes'
import PrivateLayout from '../layouts/PrivateLayout/PrivateLayout'
import { privateRoutes } from './PrivateRoutes'

const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      {authRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Route>

    <Route path="/" element={<PrivateLayout />}>
      {privateRoutes.map((route, index) => {
        return <Route key={index} {...route} />
      })}
    </Route>
  </Routes>
)

export default AppRoutes

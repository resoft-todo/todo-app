import React from 'react'
import AuthRoutes from './AuthRoutes'
import PrivateRoutes from './PrivateRoutes'

const AppRoutes = () => (
  <>
    <AuthRoutes />
    <PrivateRoutes />
  </>
)

export default AppRoutes

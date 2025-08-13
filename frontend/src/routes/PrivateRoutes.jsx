import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PrivateLayout from '../layouts/PrivateLayout/PrivateLayout'
import TodoPage from '../pages/TodoPage'

export default function PrivateRoutes() {
  return (
    <Routes>
      <Route element={<PrivateLayout />}>
        <Route path="/" element={<TodoPage />} />
        <Route path="/todos" element={<TodoPage />} />
        <Route path="/lists" element={<TodoPage />} />
        <Route path="/lists/:listId" element={<TodoPage />} />
      </Route>
    </Routes>
  )
}

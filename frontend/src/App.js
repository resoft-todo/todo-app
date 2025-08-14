import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/Routes'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App

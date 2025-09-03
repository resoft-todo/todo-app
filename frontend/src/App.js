import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/Routes'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import SocketInitializer from './utils/socketInitializer'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <SocketInitializer />
          <AppRoutes />
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App

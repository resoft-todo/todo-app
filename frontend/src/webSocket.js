import { io } from 'socket.io-client'
import { toast } from 'react-toastify'
import { setTodayTasksWS } from './redux/actions/dashboardAction'

const SOCKET_SERVER_URL = 'http://localhost:8000'

let socket = null

export const initSocket = (userId, dispatch) => {
  if (socket && socket.connected) {
    console.log('Socket already connected.')
    return
  }

  socket = io(SOCKET_SERVER_URL, {
    withCredentials: true,
  })

  socket.on('connect', () => {
    console.log('Connected to WebSocket server')
    if (userId) {
      socket.emit('authenticate', userId)
    } else {
      console.warn('No userId provided to authenticate with WebSocket.')
    }
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server')
    //toast.info('Disconnected from real-time updates.')
  })

  socket.on('todayTasks', (data) => {
    console.log('Received todayTasks via WebSocket:', data)
    if (data) {
      dispatch(setTodayTasksWS(data))
      const activeCount = data.filter(
        (task) => task.status !== 'completed'
      ).length

      toast.info(`You have ${activeCount} active tasks for today!`)
    }
  })

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error)
    toast.error('Failed to connect to real-time updates.')
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect()
    socket = null
  }
  console.log('Disconnected from WebSocket server')
}

export const getSocket = () => socket

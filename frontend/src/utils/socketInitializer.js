import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getStoredUser } from '../api/authService'
import { initSocket } from '../webSocket'

const SocketInitializer = () => {
  const dispatch = useDispatch()
  const storedUser = getStoredUser()
  const userId = storedUser?.id

  useEffect(() => {
    if (userId) {
      initSocket(userId, dispatch)
    }
  }, [userId, dispatch])

  return null
}

export default SocketInitializer

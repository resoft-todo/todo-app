import { useState, useEffect } from 'react'
import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { setNewResetPassword } from '../../api/authService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  })

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset link.')
      navigate('/login')
    }
  }, [token, navigate])

  const validatePassword = (password) => {
    if (!password.trim()) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    if (!/[A-Z]/.test(password))
      return 'Must contain at least one uppercase letter'
    if (!/[a-z]/.test(password))
      return 'Must contain at least one lowercase letter'
    if (!/[0-9]/.test(password)) return 'Must contain at least one number'
    return ''
  }

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Confirm password is required'
    if (confirmPassword !== password) return 'Passwords do not match'
    return ''
  }

  const passwordError = validatePassword(password)
  const confirmPasswordError = validateConfirmPassword(
    confirmPassword,
    password
  )

  const isFormValid = !passwordError && !confirmPasswordError && !loading

  const handleChange = (setter) => (e) => {
    setter(e.target.value)
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setTouched({ password: true, confirmPassword: true })

    if (!isFormValid) {
      return
    }

    setLoading(true)

    try {
      await setNewResetPassword(token, password)
      toast.success('Your password has been reset successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="text-center mb-3">Set New Password</h3>
              <form onSubmit={handleResetPassword}>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="mb-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handleChange(setPassword)}
                    onBlur={() => handleBlur('password')}
                    disabled={loading}
                    placeholder="Enter new password"
                    hasError={touched.password && !!passwordError}
                    errorMessage={touched.password ? passwordError : ''}
                    maxLength={50}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="confirmPassword" className="mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={handleChange(setConfirmPassword)}
                    onBlur={() => handleBlur('confirmPassword')}
                    disabled={loading}
                    placeholder="Confirm new password"
                    hasError={touched.confirmPassword && !!confirmPasswordError}
                    errorMessage={
                      touched.confirmPassword ? confirmPasswordError : ''
                    }
                    maxLength={50}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || loading}
                  loading={loading}
                  spinnerColor="light"
                  className="w-100"
                >
                  Reset Password
                </Button>
              </form>
              <p className="text-center mt-3">
                Changed your mind? <Link to="/login">Back to Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

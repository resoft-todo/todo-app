import { useState } from 'react'
import { login } from '../../api/authService'
import React from 'react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [touchedEmail, setTouchedEmail] = useState(false)
  const [touchedPassword, setTouchedPassword] = useState(false)

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required'
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email.trim()) ? '' : 'Email is invalid'
  }

  const validatePassword = (password) => {
    if (!password) return 'Password is required'
    return password.length >= 6 ? '' : 'Password must be at least 6 characters'
  }

  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)

  const isFormValid = !emailError && !passwordError && !loading

  const onEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
    if (error) setError('')
  }

  const onEmailBlur = () => setTouchedEmail(true)
  const onPasswordBlur = () => setTouchedPassword(true)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!isFormValid) {
      setTouchedEmail(true)
      setTouchedPassword(true)
      return
    }
    setLoading(true)
    setError('')

    try {
      const response = await login(email, password)

      if (response && response.user) {
        window.alert('Logged in successfully!', response.user.name)
        setEmail('')
        setTouchedEmail(false)
        setPassword('')
        setTouchedPassword(false)
      } else {
        setError('Unexpected response from server')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="text-center mb-2">Login</h3>
              {error && (
                <div className=" mb-1 text-center">
                  <span className="red">{error}</span>
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="mb-1">
                    Email{' '}
                  </label>
                  <Input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={onEmailChange}
                    onBlur={onEmailBlur}
                    required
                    disabled={loading}
                    maxLength={50}
                    placeholder="Enter your email"
                    hasError={touchedEmail && !!emailError}
                    errorMessage={touchedEmail ? emailError : ''}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={onPasswordChange}
                    onBlur={onPasswordBlur}
                    disabled={loading}
                    maxLength={50}
                    placeholder="Enter your password"
                    hasError={touchedPassword && !!passwordError}
                    errorMessage={touchedPassword ? passwordError : ''}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !isFormValid}
                  loading={loading}
                  spinnerColor="light"
                  className="w-100"
                >
                  Login
                </Button>
              </form>
              <p className="text-center mt-3">
                Dont have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { register } from '../../api/authService'
import React from 'react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  const validateName = (name) => {
    if (!name.trim()) return 'Name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters'
    return ''
  }

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required'
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email.trim()) ? '' : 'Email is invalid'
  }

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
    if (!confirmPassword.trim()) return 'Confirm password is required'
    if (confirmPassword !== password) return 'Passwords do not match'
    return ''
  }

  const nameError = validateName(name)
  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)
  const confirmPasswordError = validateConfirmPassword(
    confirmPassword,
    password
  )

  const isFormValid =
    !nameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    !loading

  const handleChange = (setter) => (e) => {
    setter(e.target.value)
    if (error) setError('')
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!isFormValid) {
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      })
      return
    }
    setLoading(true)
    setError('')

    try {
      await register(name, email, password, confirmPassword)
      window.alert('Register successfully!')
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setTouched({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      })
    } catch (error) {
      setError(error.message || 'Registration failed')
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
              <h3 className="text-center mb-2">Register</h3>
              {error && (
                <div className="mb-1 text-center">
                  <span className="red">{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="form-group mb-3">
                  <label htmlFor="name" className="mb-1">
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleChange(setName)}
                    onBlur={() => handleBlur('name')}
                    disabled={loading}
                    placeholder="Enter your name"
                    hasError={touched.name && !!nameError}
                    errorMessage={touched.name ? nameError : ''}
                    maxLength={50}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="email" className="mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    autoComplete="username"
                    value={email}
                    onChange={handleChange(setEmail)}
                    onBlur={() => handleBlur('email')}
                    disabled={loading}
                    placeholder="Enter your email"
                    hasError={touched.email && !!emailError}
                    errorMessage={touched.email ? emailError : ''}
                    maxLength={50}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password" className="mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={handleChange(setPassword)}
                    onBlur={() => handleBlur('password')}
                    disabled={loading}
                    placeholder="Enter your password"
                    hasError={touched.password && !!passwordError}
                    errorMessage={touched.password ? passwordError : ''}
                    maxLength={50}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="confirmPassword" className="mb-1">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={handleChange(setConfirmPassword)}
                    onBlur={() => handleBlur('confirmPassword')}
                    disabled={loading}
                    placeholder="Confirm your password"
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
                  Register
                </Button>
              </form>
              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

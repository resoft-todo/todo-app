import { useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import { forgotPasswordReset } from '../../api/authService'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'
import { validateEmail } from '../../utils/validation'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const emailError = validateEmail(email)
  const isFormValid = !emailError && !loading

  const onEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const onEmailBlur = () => {
    setTouched(true)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setTouched(true)

    if (!isFormValid) {
      return
    }

    setLoading(true)

    try {
      await forgotPasswordReset(email)
      setIsSubmitted(true)
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
              {isSubmitted ? (
                <div className="text-center">
                  <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                  <h4 className="mb-3">Check your email</h4>
                  <p>
                    We have sent a password reset link to{' '}
                    <strong>{email}</strong>. Please check your inbox and spam
                    folder.
                  </p>
                  <Link to="/login" className="btn btn-primary w-100 mt-2">
                    Back to Login
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="text-center mb-2">Forgot Password</h3>
                  <p className="text-center text-muted mb-4">
                    {`Enter your email address and we'll send you a link to reset your password.`}
                  </p>

                  <form onSubmit={handleForgotPassword}>
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={onEmailChange}
                        onBlur={onEmailBlur}
                        disabled={loading}
                        placeholder="Enter your email"
                        hasError={touched && !!emailError}
                        errorMessage={touched ? emailError : ''}
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
                      Send Reset Link
                    </Button>
                  </form>
                  <p className="text-center mt-3">
                    Remember your password? <Link to="/login">Login</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

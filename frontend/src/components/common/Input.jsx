import React from 'react'

const Input = ({
  className = '',
  hasError = false,
  errorMessage = '',
  ...props
}) => {
  return (
    <>
      <input
        className={`form-control ${className} ${hasError ? 'is-invalid' : ''}`}
        {...props}
      />
      {hasError && errorMessage && (
        <div className="invalid-feedback">{errorMessage}</div>
      )}
    </>
  )
}

export default Input

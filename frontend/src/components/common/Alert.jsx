import React from 'react'

const Alert = ({
  variant = 'primary',
  children,
  dismissible,
  onClose,
  className = '',
}) => {
  return (
    <div
      className={`alert alert-${variant} ${dismissible ? 'alert-dismissible' : ''} fade show ${className}`}
    >
      {children}
      {dismissible && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  )
}

export default Alert

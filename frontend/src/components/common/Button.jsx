import React from 'react'

const Button = ({
  children,
  variant = 'primary',
  outline = false,
  onClick,
  size,
  disabled = false,
  type = 'button',
  spinnerColor = 'light',
  spinnerStyle = {},
  className = '',
  loading = false,
  ...props
}) => {
  const variantClass = outline ? `btn-outline-${variant}` : `btn-${variant}`
  const classes =
    `btn ${variantClass} ${size ? `btn-${size}` : ''} ${className}`.trim()

  const spinnerColorClass = `text-${spinnerColor}`

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div
          className={`spinner-border spinner-border-sm ${spinnerColorClass}`}
          role="status"
          style={spinnerStyle}
        >
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button

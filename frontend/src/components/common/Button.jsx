import React from 'react'

const Button = ({
  children,
  variant = 'primary',
  outline = false,
  onClick,
  size,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  const variantClass = outline ? `btn-outline-${variant}` : `btn-${variant}`
  const classes =
    `btn ${variantClass} ${size ? `btn-${size}` : ''} ${className}`.trim()

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

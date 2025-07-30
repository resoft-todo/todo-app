import React from 'react'

const Checkbox = ({
  checked,
  onChange,
  label,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-check ${className} cursor-pointer`}>
      <input
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={id}
        {...props}
      />
      {label && (
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  )
}

export default Checkbox

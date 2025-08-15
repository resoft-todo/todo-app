export const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.trim()) ? '' : 'Email is invalid'
}

export const validateName = (name) => {
  if (!name.trim()) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  return ''
}

export const validatePassword = (password) => {
  if (!password.trim()) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  if (!/[A-Z]/.test(password))
    return 'Must contain at least one uppercase letter'
  if (!/[a-z]/.test(password))
    return 'Must contain at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Must contain at least one number'
  return ''
}

export const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword.trim()) return 'Confirm password is required'
  if (confirmPassword !== password) return 'Passwords do not match'
  return ''
}

export function normalizeToDate(dateString) {
  const d = new Date(dateString)
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  ).getTime()
}

export function isOverdue(dueDate) {
  const today = new Date()
  const todayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  ).getTime()
  return normalizeToDate(dueDate) <= todayUTC
}

export const formatDate = (dateString) => {
  if (!dateString) return ''
  const dateOnly = dateString.split('T')[0]
  const date = new Date(dateOnly + 'T00:00:00')
  return date.toLocaleDateString({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

import React from 'react'

const TodoStats = (activeTasks, completedTasks) => {
  return (
    <div className="bg-light rounded-4 shadow-sm p-3 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-muted fw-semibold">Active:</span>
        <span className="text-warning fw-bold">{activeTasks.length}</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-muted fw-semibold">Completed:</span>
        <span className="text-success fw-bold">{completedTasks.length}</span>
      </div>

      <hr className="my-3" />

      <div className="d-flex justify-content-between align-items-center">
        <span className="text-muted fw-semibold">Total:</span>
        <span className="text-primary fw-bold">{tasks.length}</span>
      </div>
    </div>
  )
}

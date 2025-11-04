import React from 'react'

const Modal = ({ show, onHide, title, children, footer }) => {
  if (!show) return null

  return (
    <div
      className={`modal fade show`}
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onHide}
    >
      <div
        className={`modal-dialog modal-dialog-centered`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export default Modal

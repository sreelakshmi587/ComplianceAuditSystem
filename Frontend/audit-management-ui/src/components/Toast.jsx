import { useEffect } from 'react'
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import '../styles/toast.css'

export default function Toast({ id, message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 4000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' ? (
          <IoCheckmarkCircle />
        ) : (
          <IoCloseCircle />
        )}
      </div>
      <p className="toast-message">{message}</p>
      <button className="toast-close" onClick={() => onClose(id)}>
        ✕
      </button>
    </div>
  )
}

import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'
import Toast from './Toast'
import '../styles/toast.css'

export default function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Router = {
  _navigate: null,
  setNavigate(fn) {
    this._navigate = fn
  },
  push(path, options) {
    if (!this._navigate) return console.warn('Router: navigate not initialized')
    this._navigate(path, options)
  },
  replace(path, options) {
    if (!this._navigate) return console.warn('Router: navigate not initialized')
    this._navigate(path, { replace: true, ...(options || {}) })
  },
}

export default Router

export function NavigatorSetter() {
  const navigate = useNavigate()
  useEffect(() => {
    Router.setNavigate(navigate)
  }, [navigate])
  return null
}

import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Router from './router/Router'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import SideNav from './components/SideNav'
import Audit from './pages/Audit'
import Admin from './pages/Admin'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'
import './styles/sidebar.css'

function AppContent() {
  const [user, setUser] = useState(null)
  const location = useLocation()

  function handleAuthSuccess(userInfo) {
    setUser(userInfo)
    Router.push('/dashboard')
  }

  function handleSignOut() {
    setUser(null)
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    Router.push('/')
  }

  return (
    <div className="app-layout">
      {location.pathname !== '/' && <SideNav />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Auth onAuthSuccess={handleAuthSuccess} />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} onSignOut={handleSignOut} /> : <Navigate to="/" />}
          />
          <Route path="/audit" element={user ? <Audit /> : <Navigate to="/" />} />
          <Route path="/admin" element={user ? <Admin /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App

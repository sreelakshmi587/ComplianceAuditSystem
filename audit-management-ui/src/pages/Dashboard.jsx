// import React from 'react'
import '../styles/auth.css'

export default function Dashboard({ user, onSignOut }) {
  return (
    <div className="page-root">
      <div className="page-card">
        <div className="auth-card">
          <h2>Welcome{user?.username ? `, ${user.username}` : ''}!</h2>
          <p className="muted">This is your dashboard. Replace with real content.</p>

          <div style={{ marginTop: 20 }}>
            <button className="primary" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  )
}

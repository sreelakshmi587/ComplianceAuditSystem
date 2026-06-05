
import { NavLink } from 'react-router-dom'
import '../styles/sidebar.css'

export default function SideNav() {
  return (
    <aside className="sidenav">
      <div className="sidenav-brand">AS Corp</div>
      <nav className="sidenav-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sidenav-item active' : 'sidenav-item'}>Dashboard</NavLink>
        <NavLink to="/audit" className={({ isActive }) => isActive ? 'sidenav-item active' : 'sidenav-item'}>Audits</NavLink>
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'sidenav-item active' : 'sidenav-item'}>Admin</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'sidenav-item active' : 'sidenav-item'}>Settings</NavLink>
      </nav>
    </aside>
  )
}

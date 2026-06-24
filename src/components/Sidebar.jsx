import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = ({ items = [] }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">🏨</span>
        <div>
          <strong>HotelConnect</strong>
          <small>Management</small>
        </div>
      </div>
      <nav>
        <ul>
          {items.map((it) => (
            <li key={it.path}>
              <NavLink
                to={it.path}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                <span className="sidebar__icon">{it.icon}</span>
                {it.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

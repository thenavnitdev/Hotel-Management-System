import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <header className="navbar">
      <h1 className="navbar__title">Hotel Management System</h1>
      <div className="navbar__actions">
        <span className="navbar__role">{user?.role}</span>
        <span className="navbar__user">{user?.name}</span>
        <button type="button" className="navbar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar

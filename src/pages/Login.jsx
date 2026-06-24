import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const features = [
  'Guest Management',
  'Staff Panel',
  'Billing & Payments',
  'Analytics',
  'Room Occupancy',
  'Reports',
]

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__hero">
        <div className="login-page__brand">
          <span className="login-page__logo">🏨</span>
          <div>
            <strong>HotelConnect</strong>
            <small>Empowering Hospitality</small>
          </div>
        </div>

        <p className="login-page__welcome">Welcome to HotelConnect</p>
        <h1>
          Smart Hotel
          <br />
          Management System
        </h1>
        <p className="login-page__desc">
          Manage guests, staff, rooms, bookings, billing, and reports — all in one powerful platform.
        </p>
        <p className="login-page__tagline">✦ One platform. Complete hotel control.</p>

        <div className="login-page__features">
          {features.map((f) => (
            <span key={f} className="login-page__feature">{f}</span>
          ))}
        </div>

        <footer className="login-page__footer">
          <span>© 2026 HotelConnect. All rights reserved.</span>
          <span>Privacy Policy · Terms & Conditions</span>
        </footer>
      </div>

      <div className="login-page__form-panel">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p>Sign in to access your dashboard</p>

          <form onSubmit={handleSubmit}>
            <label>
              Email / Username
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hotel.com"
                required
              />
            </label>

            <label>
              <span className="login-card__label-row">
                Password
                <a href="#">Forgot password?</a>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </label>

            <label className="login-card__remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember Me
            </label>

            {error && <p className="login-card__error">{error}</p>}

            <button type="submit" className="login-card__btn">Login to Dashboard</button>
          </form>

          <p className="login-card__roles">Access for Admin, Manager & Receptionist</p>
          <p className="login-card__hint">
            You'll be automatically redirected to your dashboard based on your role.
          </p>
          <p className="login-card__contact">
            Don't have an account? <a href="#">Contact Admin</a>
          </p>

          <div className="login-card__demo">
            <strong>Demo credentials:</strong>
            <span>admin@hotel.com / admin123</span>
          </div>
        </div>

        <footer className="login-card__bottom">
          © 2026 HotelConnect · Privacy · Terms
        </footer>
      </div>
    </div>
  )
}

export default Login

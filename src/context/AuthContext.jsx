import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
  admin: { email: 'admin@hotel.com', password: 'admin123', role: 'Admin', name: 'Admin User' },
  manager: { email: 'manager@hotel.com', password: 'manager123', role: 'Manager', name: 'Hotel Manager' },
  reception: { email: 'reception@hotel.com', password: 'reception123', role: 'Receptionist', name: 'Front Desk' },
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('hotel-auth')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = (email, password) => {
    const found = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password
    )
    if (!found) return { success: false, message: 'Invalid email or password' }
    const session = { email: found.email, role: found.role, name: found.name }
    localStorage.setItem('hotel-auth', JSON.stringify(session))
    setUser(session)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('hotel-auth')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

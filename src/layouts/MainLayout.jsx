import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import './MainLayout.css'

export const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Guests', path: '/guests', icon: '👥' },
  { label: 'Staff', path: '/staff', icon: '👔' },
  { label: 'Rooms', path: '/rooms', icon: '🛏️' },
  { label: 'Bookings', path: '/bookings', icon: '📅' },
  { label: 'Billing', path: '/billing', icon: '💰' },
  { label: 'Reports', path: '/reports', icon: '📄' },
]

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar items={navItems} />
      <div className="main-layout__content">
        <Navbar />
        <main className="main-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

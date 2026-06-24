import React, { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import { fetchDashboardStats, fetchBookings } from '../services/api'
import './pages.css'

const statusBadge = (status) => {
  const map = {
    Active: 'success',
    Upcoming: 'info',
    Completed: 'muted',
  }
  return <span className={`badge badge--${map[status] || 'muted'}`}>{status}</span>
}

const bookingColumns = [
  { key: 'guest', label: 'Guest' },
  { key: 'room', label: 'Room' },
  { key: 'checkIn', label: 'Check In' },
  { key: 'checkOut', label: 'Check Out' },
  { key: 'guests', label: 'Guests' },
  { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
]

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchDashboardStats().then(setStats)
    fetchBookings().then(setBookings)
  }, [])

  return (
    <div className="page">
      <div className="page__header">
        <h2>Dashboard</h2>
        <p className="page__subtitle">Hotel overview and analytics at a glance.</p>
      </div>

      {stats && (
        <div className="stat-grid">
          <StatCard icon="👥" label="Total Guests" value={stats.totalGuests} change="+8% this month" color="blue" />
          <StatCard icon="📅" label="Active Bookings" value={stats.activeBookings} change="+3 today" color="green" />
          <StatCard icon="🛏️" label="Available Rooms" value={stats.availableRooms} color="purple" />
          <StatCard icon="💰" label="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} change="+12% this month" color="orange" />
          <StatCard icon="📊" label="Occupancy Rate" value={`${stats.occupancyRate}%`} color="teal" />
          <StatCard icon="👔" label="Staff on Duty" value={stats.staffOnDuty} color="red" />
        </div>
      )}

      <section className="page__section">
        <h3>Recent Bookings</h3>
        <DataTable columns={bookingColumns} data={bookings} />
      </section>
    </div>
  )
}

export default Dashboard

import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { fetchBookings } from '../services/api'
import './pages.css'

const emptyBooking = {
  guest: '',
  room: '',
  checkIn: '',
  checkOut: '',
  guests: '',
  status: 'Upcoming',
}

const statusBadge = (status) => {
  const map = {
    Active: 'success',
    Upcoming: 'info',
    Completed: 'muted',
    Cancelled: 'danger',
  }
  return <span className={`badge badge--${map[status] || 'muted'}`}>{status}</span>
}

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyBooking)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings().then(setBookings)
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyBooking)
    setError('')
    setShowForm(true)
  }

  const openEditForm = (booking) => {
    setEditingId(booking.id)
    setForm({
      guest: booking.guest,
      room: booking.room,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: String(booking.guests),
      status: booking.status,
    })
    setError('')
    setShowForm(true)
  }

  const handleCancel = () => {
    setForm(emptyBooking)
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.guest.trim() || !form.room.trim() || !form.checkIn || !form.checkOut) {
      setError('Guest, room, check-in, and check-out are required.')
      return
    }

    const bookingData = {
      guest: form.guest.trim(),
      room: form.room.trim(),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: Number(form.guests) || 1,
      status: form.status,
    }

    if (editingId) {
      setBookings((prev) =>
        prev.map((b) => (b.id === editingId ? { ...b, ...bookingData } : b))
      )
    } else {
      setBookings((prev) => [{ id: Date.now(), ...bookingData }, ...prev])
    }

    handleCancel()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this booking?')) {
      setBookings((prev) => prev.filter((b) => b.id !== id))
      if (editingId === id) handleCancel()
    }
  }

  const columns = [
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'checkIn', label: 'Check In' },
    { key: 'checkOut', label: 'Check Out' },
    { key: 'guests', label: 'Guests' },
    { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <div className="table-actions">
          <button
            type="button"
            className="table-actions__btn table-actions__btn--edit"
            onClick={() => openEditForm(r)}
          >
            Edit
          </button>
          <button
            type="button"
            className="table-actions__btn table-actions__btn--delete"
            onClick={() => handleDelete(r.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="page">
      <div className="page__header page__header--row">
        <div>
          <h2>Room Occupancy</h2>
          <p className="page__subtitle">Track bookings, check-ins, and room occupancy.</p>
        </div>
        <button
          type="button"
          className="page__add-btn"
          onClick={() => (showForm && !editingId ? handleCancel() : openAddForm())}
        >
          {showForm && !editingId ? 'Cancel' : '+ Add Booking'}
        </button>
      </div>

      {showForm && (
        <form className="guest-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Booking' : 'Add New Booking'}</h3>

          <div className="guest-form__grid">
            <label>
              Guest Name *
              <input type="text" name="guest" value={form.guest} onChange={handleChange} placeholder="John Smith" />
            </label>
            <label>
              Room *
              <input type="text" name="room" value={form.room} onChange={handleChange} placeholder="101" />
            </label>
            <label>
              Check In *
              <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} />
            </label>
            <label>
              Check Out *
              <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} />
            </label>
            <label>
              Number of Guests
              <input type="number" name="guests" value={form.guests} onChange={handleChange} placeholder="2" min="1" />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
          </div>

          {error && <p className="guest-form__error">{error}</p>}

          <div className="guest-form__actions">
            <button type="button" className="guest-form__btn guest-form__btn--secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="guest-form__btn guest-form__btn--primary">
              {editingId ? 'Update Booking' : 'Save Booking'}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={bookings} emptyMessage="No bookings found." />
    </div>
  )
}

export default Bookings

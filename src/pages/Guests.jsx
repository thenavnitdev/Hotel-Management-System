import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { fetchGuests } from '../services/api'
import './pages.css'

const emptyGuest = {
  name: '',
  email: '',
  phone: '',
  room: '',
  checkIn: '',
  checkOut: '',
  status: 'Reserved',
}

const statusBadge = (status) => {
  const map = {
    'Checked In': 'success',
    Reserved: 'info',
    'Checked Out': 'muted',
  }
  return <span className={`badge badge--${map[status] || 'muted'}`}>{status}</span>
}

const today = () => new Date().toISOString().split('T')[0]

const Guests = () => {
  const [guests, setGuests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyGuest)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGuests().then(setGuests)
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyGuest)
    setError('')
    setShowForm(true)
  }

  const openEditForm = (guest) => {
    setEditingId(guest.id)
    setForm({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      room: guest.room === '-' ? '' : guest.room,
      checkIn: guest.checkIn === '-' ? '' : guest.checkIn,
      checkOut: guest.checkOut === '-' ? '' : guest.checkOut,
      status: guest.status,
    })
    setError('')
    setShowForm(true)
  }

  const handleCancel = () => {
    setForm(emptyGuest)
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Name, email, and phone are required.')
      return
    }

    const guestData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      room: form.room.trim() || '-',
      checkIn: form.checkIn || '-',
      checkOut: form.checkOut || '-',
      status: form.status,
    }

    if (editingId) {
      setGuests((prev) =>
        prev.map((g) => (g.id === editingId ? { ...g, ...guestData } : g))
      )
    } else {
      setGuests((prev) => [{ id: Date.now(), ...guestData }, ...prev])
    }

    handleCancel()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this guest?')) {
      setGuests((prev) => prev.filter((g) => g.id !== id))
      if (editingId === id) handleCancel()
    }
  }

  const handleCheckIn = (id) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: 'Checked In', checkIn: today() }
          : g
      )
    )
  }

  const handleCheckOut = (id) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: 'Checked Out', checkOut: today() }
          : g
      )
    )
  }

  const reservedCount = guests.filter((g) => g.status === 'Reserved').length
  const checkedInCount = guests.filter((g) => g.status === 'Checked In').length
  const checkedOutCount = guests.filter((g) => g.status === 'Checked Out').length

  const columns = [
    { key: 'name', label: 'Guest Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'room', label: 'Room' },
    { key: 'checkIn', label: 'Check In' },
    { key: 'checkOut', label: 'Check Out' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <div className="status-cell">
          {statusBadge(r.status)}
          {r.status === 'Reserved' && (
            <button
              type="button"
              className="table-actions__btn table-actions__btn--checkin"
              onClick={() => handleCheckIn(r.id)}
            >
              Check In
            </button>
          )}
          {r.status === 'Checked In' && (
            <button
              type="button"
              className="table-actions__btn table-actions__btn--checkout"
              onClick={() => handleCheckOut(r.id)}
            >
              Check Out
            </button>
          )}
        </div>
      ),
    },
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
          <h2>Guest Management</h2>
          <p className="page__subtitle">Manage hotel guests, check-ins, and reservations.</p>
        </div>
        <button
          type="button"
          className="page__add-btn"
          onClick={() => (showForm && !editingId ? handleCancel() : openAddForm())}
        >
          {showForm && !editingId ? 'Cancel' : '+ Add Guest'}
        </button>
      </div>

      <div className="guest-summary">
        <div className="guest-summary__item guest-summary__item--reserved">
          <span>Reserved</span>
          <strong>{reservedCount}</strong>
        </div>
        <div className="guest-summary__item guest-summary__item--checkin">
          <span>Checked In</span>
          <strong>{checkedInCount}</strong>
        </div>
        <div className="guest-summary__item guest-summary__item--checkout">
          <span>Checked Out</span>
          <strong>{checkedOutCount}</strong>
        </div>
        <div className="guest-summary__item">
          <span>Total Guests</span>
          <strong>{guests.length}</strong>
        </div>
      </div>

      {showForm && (
        <form className="guest-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Guest' : 'Add New Guest'}</h3>

          <div className="guest-form__grid">
            <label>
              Guest Name *
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Smith"
              />
            </label>

            <label>
              Email *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@email.com"
              />
            </label>

            <label>
              Phone *
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555-0100"
              />
            </label>

            <label>
              Room
              <input
                type="text"
                name="room"
                value={form.room}
                onChange={handleChange}
                placeholder="101"
              />
            </label>

            <label>
              Check In
              <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
              />
            </label>

            <label>
              Check Out
              <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
              />
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Reserved">Reserved</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
              </select>
            </label>
          </div>

          {error && <p className="guest-form__error">{error}</p>}

          <div className="guest-form__actions">
            <button type="button" className="guest-form__btn guest-form__btn--secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="guest-form__btn guest-form__btn--primary">
              {editingId ? 'Update Guest' : 'Save Guest'}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={guests} emptyMessage="No guests found." />
    </div>
  )
}

export default Guests

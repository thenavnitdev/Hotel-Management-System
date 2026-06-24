import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { fetchRooms } from '../services/api'
import './pages.css'

const emptyRoom = {
  number: '',
  type: 'Standard',
  floor: '',
  capacity: '',
  price: '',
  status: 'Available',
}

const isAvailable = (room) => room.status === 'Available'

const availabilityBadge = (room) => {
  const available = isAvailable(room)
  return (
    <span className={`badge badge--${available ? 'success' : 'danger'}`}>
      {available ? 'Available' : 'Not Available'}
    </span>
  )
}

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyRoom)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRooms().then(setRooms)
  }, [])

  const availableCount = rooms.filter(isAvailable).length
  const notAvailableCount = rooms.length - availableCount

  const toggleAvailability = (id) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === id
          ? { ...room, status: isAvailable(room) ? 'Not Available' : 'Available' }
          : room
      )
    )
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyRoom)
    setError('')
    setShowForm(true)
  }

  const openEditForm = (room) => {
    setEditingId(room.id)
    setForm({
      number: room.number,
      type: room.type,
      floor: String(room.floor),
      capacity: String(room.capacity),
      price: String(room.price),
      status: room.status,
    })
    setError('')
    setShowForm(true)
  }

  const handleCancel = () => {
    setForm(emptyRoom)
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.number.trim() || !form.floor || !form.capacity || !form.price) {
      setError('Room number, floor, capacity, and price are required.')
      return
    }

    const roomData = {
      number: form.number.trim(),
      type: form.type,
      floor: Number(form.floor),
      capacity: Number(form.capacity),
      price: Number(form.price),
      status: form.status,
    }

    if (editingId) {
      setRooms((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...roomData } : r))
      )
    } else {
      setRooms((prev) => [{ id: Date.now(), ...roomData }, ...prev])
    }

    handleCancel()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this room?')) {
      setRooms((prev) => prev.filter((r) => r.id !== id))
      if (editingId === id) handleCancel()
    }
  }

  const columns = [
    { key: 'number', label: 'Room No.' },
    { key: 'type', label: 'Type' },
    { key: 'floor', label: 'Floor' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'price', label: 'Price/Night', render: (r) => `$${r.price}` },
    {
      key: 'availability',
      label: 'Availability',
      render: (r) => (
        <div className="status-cell">
          {availabilityBadge(r)}
          <button
            type="button"
            className={`room-toggle ${isAvailable(r) ? 'room-toggle--mark-unavailable' : 'room-toggle--mark-available'}`}
            onClick={() => toggleAvailability(r.id)}
          >
            {isAvailable(r) ? 'Mark Not Available' : 'Mark Available'}
          </button>
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
          <h2>Room Management</h2>
          <p className="page__subtitle">View and manage room availability.</p>
        </div>
        <button
          type="button"
          className="page__add-btn"
          onClick={() => (showForm && !editingId ? handleCancel() : openAddForm())}
        >
          {showForm && !editingId ? 'Cancel' : '+ Add Room'}
        </button>
      </div>

      <div className="room-summary">
        <div className="room-summary__item room-summary__item--available">
          <span>Available</span>
          <strong>{availableCount}</strong>
        </div>
        <div className="room-summary__item room-summary__item--unavailable">
          <span>Not Available</span>
          <strong>{notAvailableCount}</strong>
        </div>
        <div className="room-summary__item">
          <span>Total Rooms</span>
          <strong>{rooms.length}</strong>
        </div>
      </div>

      {showForm && (
        <form className="guest-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Room' : 'Add New Room'}</h3>

          <div className="guest-form__grid">
            <label>
              Room Number *
              <input type="text" name="number" value={form.number} onChange={handleChange} placeholder="101" />
            </label>
            <label>
              Room Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Presidential">Presidential</option>
              </select>
            </label>
            <label>
              Floor *
              <input type="number" name="floor" value={form.floor} onChange={handleChange} placeholder="1" min="1" />
            </label>
            <label>
              Capacity *
              <input type="number" name="capacity" value={form.capacity} onChange={handleChange} placeholder="2" min="1" />
            </label>
            <label>
              Price/Night ($) *
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="120" min="1" />
            </label>
            <label>
              Availability
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </label>
          </div>

          {error && <p className="guest-form__error">{error}</p>}

          <div className="guest-form__actions">
            <button type="button" className="guest-form__btn guest-form__btn--secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="guest-form__btn guest-form__btn--primary">
              {editingId ? 'Update Room' : 'Save Room'}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={rooms} emptyMessage="No rooms found." />
    </div>
  )
}

export default Rooms

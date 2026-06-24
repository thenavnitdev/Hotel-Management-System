import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { fetchStaff } from '../services/api'
import './pages.css'

const emptyStaff = {
  name: '',
  role: '',
  department: '',
  email: '',
  phone: '',
  status: 'Active',
}

const statusBadge = (status) => {
  const map = {
    Active: 'success',
    'On Leave': 'warning',
    Inactive: 'muted',
  }
  return <span className={`badge badge--${map[status] || 'muted'}`}>{status}</span>
}

const Staff = () => {
  const [staff, setStaff] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyStaff)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStaff().then(setStaff)
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyStaff)
    setError('')
    setShowForm(true)
  }

  const openEditForm = (member) => {
    setEditingId(member.id)
    setForm({
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email,
      phone: member.phone,
      status: member.status,
    })
    setError('')
    setShowForm(true)
  }

  const handleCancel = () => {
    setForm(emptyStaff)
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.role.trim() || !form.email.trim()) {
      setError('Name, role, and email are required.')
      return
    }

    const staffData = {
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department.trim() || 'General',
      email: form.email.trim(),
      phone: form.phone.trim() || '-',
      status: form.status,
    }

    if (editingId) {
      setStaff((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...staffData } : s))
      )
    } else {
      setStaff((prev) => [{ id: Date.now(), ...staffData }, ...prev])
    }

    handleCancel()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this staff member?')) {
      setStaff((prev) => prev.filter((s) => s.id !== id))
      if (editingId === id) handleCancel()
    }
  }

  const columns = [
    { key: 'name', label: 'Staff Name' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
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
          <h2>Staff Panel</h2>
          <p className="page__subtitle">Manage hotel staff, roles, and departments.</p>
        </div>
        <button
          type="button"
          className="page__add-btn"
          onClick={() => (showForm && !editingId ? handleCancel() : openAddForm())}
        >
          {showForm && !editingId ? 'Cancel' : '+ Add Staff'}
        </button>
      </div>

      {showForm && (
        <form className="guest-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Staff' : 'Add New Staff'}</h3>

          <div className="guest-form__grid">
            <label>
              Staff Name *
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Robert Wilson" />
            </label>
            <label>
              Role *
              <input type="text" name="role" value={form.role} onChange={handleChange} placeholder="Manager" />
            </label>
            <label>
              Department
              <input type="text" name="department" value={form.department} onChange={handleChange} placeholder="Front Desk" />
            </label>
            <label>
              Email *
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="staff@hotel.com" />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555-0200" />
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          {error && <p className="guest-form__error">{error}</p>}

          <div className="guest-form__actions">
            <button type="button" className="guest-form__btn guest-form__btn--secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="guest-form__btn guest-form__btn--primary">
              {editingId ? 'Update Staff' : 'Save Staff'}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={staff} emptyMessage="No staff records found." />
    </div>
  )
}

export default Staff

import React, { useEffect, useState } from 'react'
import DataTable from '../components/DataTable'
import { fetchBilling } from '../services/api'
import './pages.css'

const emptyPayment = {
  guest: '',
  room: '',
  amount: '',
  paid: '',
  method: 'Cash',
  date: new Date().toISOString().split('T')[0],
}

const statusBadge = (status) => {
  const map = {
    Paid: 'success',
    Partial: 'warning',
    Pending: 'danger',
  }
  return <span className={`badge badge--${map[status] || 'muted'}`}>{status}</span>
}

const methodBadge = (method) => {
  const map = {
    Cash: 'success',
    Online: 'info',
  }
  const label = method === '-' ? 'Not Set' : method
  return (
    <span className={`badge badge--${map[method] || 'muted'}`}>
      {label}
    </span>
  )
}

const getPaymentStatus = (amount, paid) => {
  if (paid >= amount) return 'Paid'
  if (paid > 0) return 'Partial'
  return 'Pending'
}

const Billing = () => {
  const [billing, setBilling] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyPayment)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBilling().then(setBilling)
  }, [])

  const total = billing.reduce((sum, b) => sum + b.amount, 0)
  const collected = billing.reduce((sum, b) => sum + b.paid, 0)
  const cashTotal = billing.filter((b) => b.method === 'Cash').reduce((sum, b) => sum + b.paid, 0)
  const onlineTotal = billing.filter((b) => b.method === 'Online').reduce((sum, b) => sum + b.paid, 0)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm({ ...emptyPayment, date: new Date().toISOString().split('T')[0] })
    setError('')
    setShowForm(true)
  }

  const openEditForm = (payment) => {
    setEditingId(payment.id)
    setForm({
      guest: payment.guest,
      room: payment.room,
      amount: String(payment.amount),
      paid: String(payment.paid),
      method: payment.method === '-' ? 'Cash' : payment.method,
      date: payment.date,
    })
    setError('')
    setShowForm(true)
  }

  const handleCancel = () => {
    setForm({ ...emptyPayment, date: new Date().toISOString().split('T')[0] })
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.guest.trim() || !form.room.trim() || !form.amount || form.paid === '') {
      setError('Guest, room, amount, and paid amount are required.')
      return
    }

    const amount = Number(form.amount)
    const paid = Number(form.paid)

    if (paid > amount) {
      setError('Paid amount cannot be greater than total amount.')
      return
    }

    const paymentData = {
      guest: form.guest.trim(),
      room: form.room.trim(),
      amount,
      paid,
      method: form.method,
      date: form.date,
      status: getPaymentStatus(amount, paid),
    }

    if (editingId) {
      setBilling((prev) =>
        prev.map((b) => (b.id === editingId ? { ...b, ...paymentData } : b))
      )
    } else {
      setBilling((prev) => [{ id: Date.now(), ...paymentData }, ...prev])
    }

    handleCancel()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this payment record?')) {
      setBilling((prev) => prev.filter((b) => b.id !== id))
      if (editingId === id) handleCancel()
    }
  }

  const columns = [
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'amount', label: 'Amount', render: (r) => `$${r.amount}` },
    { key: 'paid', label: 'Paid', render: (r) => `$${r.paid}` },
    { key: 'method', label: 'Payment Method', render: (r) => methodBadge(r.method) },
    { key: 'date', label: 'Date' },
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
          <h2>Billing & Payments</h2>
          <p className="page__subtitle">Manage guest billing with Cash or Online payments.</p>
        </div>
        <button
          type="button"
          className="page__add-btn"
          onClick={() => (showForm && !editingId ? handleCancel() : openAddForm())}
        >
          {showForm && !editingId ? 'Cancel' : '+ Add Payment'}
        </button>
      </div>

      <div className="billing-summary">
        <div className="billing-summary__item">
          <span>Total Billed</span>
          <strong>${total.toLocaleString()}</strong>
        </div>
        <div className="billing-summary__item">
          <span>Collected</span>
          <strong>${collected.toLocaleString()}</strong>
        </div>
        <div className="billing-summary__item">
          <span>Outstanding</span>
          <strong>${(total - collected).toLocaleString()}</strong>
        </div>
        <div className="billing-summary__item billing-summary__item--cash">
          <span>Cash Payments</span>
          <strong>${cashTotal.toLocaleString()}</strong>
        </div>
        <div className="billing-summary__item billing-summary__item--online">
          <span>Online Payments</span>
          <strong>${onlineTotal.toLocaleString()}</strong>
        </div>
      </div>

      {showForm && (
        <form className="guest-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Payment' : 'Add Payment'}</h3>

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
              Total Amount ($) *
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="600" min="1" />
            </label>
            <label>
              Paid Amount ($) *
              <input type="number" name="paid" value={form.paid} onChange={handleChange} placeholder="600" min="0" />
            </label>
            <label>
              Payment Method *
              <select name="method" value={form.method} onChange={handleChange}>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </label>
            <label>
              Date
              <input type="date" name="date" value={form.date} onChange={handleChange} />
            </label>
          </div>

          {error && <p className="guest-form__error">{error}</p>}

          <div className="guest-form__actions">
            <button type="button" className="guest-form__btn guest-form__btn--secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="guest-form__btn guest-form__btn--primary">
              {editingId ? 'Update Payment' : 'Save Payment'}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={billing} emptyMessage="No billing records found." />
    </div>
  )
}

export default Billing

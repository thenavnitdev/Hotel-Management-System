import React from 'react'
import './pages.css'

const reports = [
  { title: 'Monthly Revenue Report', desc: 'Revenue breakdown by room type and services', date: 'Jun 2026', size: '2.4 MB' },
  { title: 'Occupancy Report', desc: 'Room occupancy rates and trends', date: 'Jun 2026', size: '1.8 MB' },
  { title: 'Guest Analytics', desc: 'Guest demographics and booking patterns', date: 'Jun 2026', size: '3.1 MB' },
  { title: 'Staff Performance', desc: 'Staff attendance and productivity metrics', date: 'May 2026', size: '1.2 MB' },
  { title: 'Billing Summary', desc: 'Payment collection and outstanding dues', date: 'Jun 2026', size: '980 KB' },
]

const Reports = () => (
  <div className="page">
    <div className="page__header">
      <h2>Reports</h2>
      <p className="page__subtitle">Generate and download hotel management reports.</p>
    </div>

    <div className="reports-grid">
      {reports.map((r) => (
        <div key={r.title} className="report-card">
          <div className="report-card__icon">📄</div>
          <div className="report-card__content">
            <h4>{r.title}</h4>
            <p>{r.desc}</p>
            <div className="report-card__meta">
              <span>{r.date}</span>
              <span>{r.size}</span>
            </div>
          </div>
          <button type="button" className="report-card__btn">Download</button>
        </div>
      ))}
    </div>
  </div>
)

export default Reports

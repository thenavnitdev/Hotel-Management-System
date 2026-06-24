import React from 'react'
import './StatCard.css'

const StatCard = ({ icon, label, value, change, color = 'blue' }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__content">
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value">{value}</strong>
      {change && <span className="stat-card__change">{change}</span>}
    </div>
  </div>
)

export default StatCard

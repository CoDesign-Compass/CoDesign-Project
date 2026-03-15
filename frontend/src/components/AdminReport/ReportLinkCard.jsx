import React from 'react'
import './ReportShared.css'

export default function ReportLinkCard({
  title,
  description,
  href,
  badge = 'View',
}) {
  return (
    <a className="report-link-card" href={href}>
      <div className="report-link-card-top">
        <h3 className="report-link-card-title">{title}</h3>
        <span className="report-link-card-badge">{badge}</span>
      </div>

      <p className="report-link-card-desc">{description}</p>
    </a>
  )
}

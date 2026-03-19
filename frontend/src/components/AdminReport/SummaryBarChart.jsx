import React from 'react'
import './ReportShared.css'

export default function SummaryBarChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="report-chart-empty">
        <div>
          <strong>No summary data available.</strong>
          <p style={{ margin: '8px 0 0 0' }}>
            A chart will appear here once report metrics are returned by the
            backend.
          </p>
        </div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="report-chart-box">
      <div className="report-chart-grid">
        {data.map((item) => {
          const widthPercent = Math.max((item.value / maxValue) * 100, 4)

          return (
            <div className="report-chart-row" key={item.label}>
              <div className="report-chart-label">{item.label}</div>

              <div className="report-chart-track" aria-hidden="true">
                <div
                  className="report-chart-bar"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              <div className="report-chart-value">{item.value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

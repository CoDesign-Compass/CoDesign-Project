import React from 'react'
import './IssueCard.css'

export default function IssueCard({ title, content, href }) {
  const isClickable = Boolean(href)

  const cardInner = (
    <>
      <div className="issue-card-top">
        <h3 className="issue-card-title">{title}</h3>
        <span className="issue-card-badge">
          {isClickable ? 'Open report' : 'Unavailable'}
        </span>
      </div>

      <p className="issue-card-content">
        {content || 'No report content available.'}
      </p>
    </>
  )

  if (isClickable) {
    return (
      <a className="issue-card issue-card-link" href={href}>
        {cardInner}
      </a>
    )
  }

  return (
    <section className="issue-card issue-card-disabled" aria-disabled="true">
      {cardInner}
    </section>
  )
}

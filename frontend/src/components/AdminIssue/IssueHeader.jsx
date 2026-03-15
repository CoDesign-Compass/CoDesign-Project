import React from 'react'
import './IssueHeader.css'

export default function IssueHeader({ issueTitle, issueContent, shareLink }) {
  return (
    <section className="issue-header">
      <div className="issue-header-top">
        <h1 className="issue-page-title">{issueTitle || 'Issue Report'}</h1>
        <p className="issue-page-subtitle">
          Review the issue summary and access the related report pages from one
          place.
        </p>
      </div>

      <div className="issue-section">
        <h2 className="issue-section-title">Issue Content</h2>
        <div className="issue-content-box">
          {issueContent || 'No issue content available.'}
        </div>
      </div>

      <div className="issue-section">
        <h2 className="issue-section-title">Share Link</h2>
        <div className="share-link-box">
          {shareLink ? (
            <a
              href={shareLink}
              target="_blank"
              rel="noreferrer"
              className="share-link-text"
            >
              {shareLink}
            </a>
          ) : (
            <span className="share-link-empty">No share link available.</span>
          )}
        </div>
      </div>
    </section>
  )
}

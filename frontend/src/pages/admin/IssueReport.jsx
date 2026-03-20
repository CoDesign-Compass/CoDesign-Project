import React, { useEffect, useState } from 'react'
import '../../components/AdminIssue/IssueReport.css'

export default function IssueReport() {
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'
  const handleExportRawData = () => {
    console.log('export raw data')
  }

  const handleExportIssueReport = () => {
    console.log('export issue report')
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const issueId = params.get('issueId')

    if (!issueId) {
      setPageError('No issueId was provided in the URL.')
      setLoading(false)
      return
    }

    const fetchIssue = async () => {
      setLoading(true)
      setPageError('')

      try {
        const res = await fetch(`${API_BASE}/api/issues/${issueId}`)
        const text = await res.text()

        if (!res.ok) {
          throw new Error(text || 'Failed to load issue.')
        }

        const data = text ? JSON.parse(text) : {}
        setIssue(data)
      } catch (err) {
        console.error(err)
        setPageError('Failed to load issue report.')
      } finally {
        setLoading(false)
      }
    }

    fetchIssue()
  }, [API_BASE])

  const shareId = issue?.shareId || ''
  const shareLink = shareId ? `${window.location.origin}/share/${shareId}` : ''

  return (
    <div className="issue-container">
      <main className="main-content">
        <section className="issue-page-shell">
          {loading && (
            <div className="issue-state-card">
              <h2 className="issue-state-title">Loading issue report</h2>
              <p className="issue-state-text">
                Please wait while the issue report is being prepared.
              </p>
            </div>
          )}

          {!loading && pageError && (
            <div className="issue-state-card issue-state-card-error">
              <h2 className="issue-state-title">Unable to load this issue</h2>
              <p className="issue-state-text">{pageError}</p>
            </div>
          )}

          {!loading && !pageError && (
            <section className="issue-report-section">
              <div className="issue-report-header">
                <div className="issue-report-header-top">
                  <h1 className="issue-page-title">
                    Issue Report{issue?.issueId ? ` #${issue.issueId}` : ''}
                  </h1>

                  <div className="issue-header-actions">
                    <button
                      type="button"
                      className="issue-action-button issue-action-button-secondary"
                      onClick={handleExportRawData}
                    >
                      Export Raw Data
                    </button>

                    <button
                      type="button"
                      className="issue-action-button issue-action-button-primary"
                      onClick={handleExportIssueReport}
                    >
                      Export Issue Report
                    </button>
                  </div>
                </div>
              </div>

              <div className="issue-report-panel">
                <div className="issue-section">
                  <h2 className="issue-section-title">Issue Content</h2>
                  <div className="issue-content-box">
                    {issue?.issueContent || 'No issue content available.'}
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
                      <span className="share-link-empty">
                        No share link available.
                      </span>
                    )}
                  </div>
                </div>

                <div className="issue-section">
                  <h2 className="issue-section-title">Issue Analysis</h2>

                  <div className="issue-analysis-section">
                    <div className="report-summary-row">
                      <div className="analysis-inner-card metric-card">
                        <h3 className="report-card-title">
                          Total Participants
                        </h3>
                        <div className="metric-value">--</div>
                      </div>

                      <div className="analysis-inner-card metric-card">
                        <h3 className="report-card-title">
                          Average Response Time
                        </h3>
                        <div className="metric-value">--</div>
                      </div>
                    </div>

                    <div className="analysis-inner-card">
                      <h3 className="report-card-title">Participation Trend</h3>
                      <div className="report-large-placeholder">
                        Participation trend chart placeholder
                      </div>
                    </div>

                    <div className="analysis-inner-card">
                      <div className="wordcloud-stack">
                        <div className="wordcloud-block">
                          <h4 className="report-card-title">
                            Profile Word Cloud
                          </h4>
                          <div className="report-medium-placeholder">
                            Profile word cloud placeholder
                          </div>
                        </div>

                        <div className="wordcloud-block">
                          <h4 className="report-card-title">Why Word Cloud</h4>
                          <div className="report-medium-placeholder">
                            Why word cloud placeholder
                          </div>
                        </div>

                        <div className="wordcloud-block">
                          <h4 className="report-card-title">How Word Cloud</h4>
                          <div className="report-medium-placeholder">
                            How word cloud placeholder
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="analysis-inner-card">
                      <h3 className="report-card-title">Sentiment Analysis</h3>
                      <div className="report-large-placeholder">
                        Sentiment analysis placeholder
                      </div>
                    </div>

                    <div className="analysis-inner-card">
                      <h3 className="report-card-title">Insights</h3>
                      <div className="report-large-placeholder">
                        Insight summary placeholder
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  )
}

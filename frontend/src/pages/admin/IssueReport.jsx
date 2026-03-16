import React, { useEffect, useMemo, useState } from 'react'
import IssueHeader from '../../components/AdminIssue/IssueHeader'
import IssueCard from '../../components/AdminIssue/IssueCard'
import '../../components/AdminIssue/IssueReport.css'

export default function IssueReport() {
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

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

  const reports = useMemo(
    () => [
      {
        title: 'Profile Report',
        content: 'Open the profile report page for this issue.',
        href: shareId
          ? `/admin/profile-report?shareId=${encodeURIComponent(shareId)}`
          : '',
      },
      {
        title: 'Why Report',
        content: 'Open the why report page for this issue.',
        href: shareId
          ? `/admin/why-report?shareId=${encodeURIComponent(shareId)}`
          : '',
      },
      {
        title: 'How Report',
        content: 'Open the how report page for this issue.',
        href: shareId
          ? `/admin/how-report?shareId=${encodeURIComponent(shareId)}`
          : '',
      },
      {
        title: 'Engagement & Response Quality Analysis',
        content: 'Open the engagement report page for this issue.',
        href: shareId
          ? `/admin/engagement-report?shareId=${encodeURIComponent(shareId)}`
          : '',
      },
    ],
    [shareId],
  )

  const hasAvailableReports = reports.some((report) => report.href)

  return (
    <div className="issue-container">
      <main className="main-content">
        <section className="issue-page-shell">
          {loading && (
            <div className="issue-state-card">
              <h2 className="issue-state-title">Loading issue report</h2>
              <p className="issue-state-text">
                Please wait while the issue details and linked reports are being
                prepared.
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
            <>
              <IssueHeader
                issueTitle={`Issue Report${issue?.issueId ? ` #${issue.issueId}` : ''}`}
                issueContent={
                  issue?.issueContent || 'No issue content available.'
                }
                shareLink={shareLink}
              />

              <section className="report-section">
                <div className="report-section-header">
                  <h2 className="report-section-title">Related Reports</h2>
                  <p className="report-section-text">
                    Open one of the report views below to review the issue from
                    different analytical perspectives.
                  </p>
                </div>

                {hasAvailableReports ? (
                  <div className="report-list">
                    {reports.map((report) => (
                      <IssueCard
                        key={report.title}
                        title={report.title}
                        content={report.content}
                        href={report.href}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="issue-state-card issue-inline-empty-state">
                    <h3 className="issue-state-title">
                      No reports available yet
                    </h3>
                    <p className="issue-state-text">
                      Report links will appear here once a valid share link is
                      available for this issue.
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

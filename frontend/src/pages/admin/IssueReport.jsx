import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useParams } from 'react-router-dom'
import '../../components/AdminIssue/IssueReport.css'

export default function IssueReport() {
  const [issue, setIssue] = useState(null)
  const [participantCount, setParticipantCount] = useState(null)
  const [avgResponseSeconds, setAvgResponseSeconds] = useState(null)
  const [trendGranularity, setTrendGranularity] = useState('month')
  const [trendSeriesData, setTrendSeriesData] = useState([])
  const [trendCategories, setTrendCategories] = useState([])
  const [trendLoading, setTrendLoading] = useState(false)
  const [trendError, setTrendError] = useState('')
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [exportingRawType, setExportingRawType] = useState('')

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'
  const { issueId: routeIssueId } = useParams()
  const params = new URLSearchParams(window.location.search)
  const queryIssueId = params.get('issueId')
  const issueId = routeIssueId || queryIssueId

  const exportRawCsv = (type) => {
    if (!issueId || exportingRawType) return
    setExportingRawType(type)

    try {
      const encodedIssueId = encodeURIComponent(issueId)
      const link = document.createElement('a')
      link.href = `${API_BASE}/api/submissions/raw-data/${type}?issueId=${encodedIssueId}`
      link.download = ''
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error(err)
      window.alert(`Failed to export ${type} raw data.`)
    } finally {
      setTimeout(() => setExportingRawType(''), 300)
    }
  }

  const handleExportIssueReport = () => {
    window.print()
  }

  const formatAverageResponseTime = (secondsValue) => {
    if (secondsValue === null || !Number.isFinite(secondsValue)) return '--'

    const totalSeconds = Math.max(0, Math.round(secondsValue))
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  const trendOptions = {
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'line',
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: ['#465fff'],
    xaxis: {
      categories: trendCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: -45,
        hideOverlappingLabels: true,
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      title: { text: 'Submissions' },
    },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    markers: {
      size: 4,
      hover: { size: 6 },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
  }

  const trendSeries = [
    {
      name: 'Submissions',
      data: trendSeriesData,
    },
  ]

  useEffect(() => {
    if (!issueId) {
      setPageError('No issueId was provided in the URL.')
      setLoading(false)
      return
    }

    const fetchIssue = async () => {
      setLoading(true)
      setPageError('')

      try {
        const [issueRes, countRes, avgRes] = await Promise.all([
          fetch(`${API_BASE}/api/issues/${issueId}`),
          fetch(`${API_BASE}/api/submissions/count?issueId=${issueId}`),
          fetch(`${API_BASE}/api/submissions/avg-response-time?issueId=${issueId}`),
        ])

        const issueText = await issueRes.text()
        const countText = await countRes.text()
        const avgText = await avgRes.text()

        if (!issueRes.ok) {
          throw new Error(issueText || 'Failed to load issue.')
        }
        if (!countRes.ok) {
          throw new Error(countText || 'Failed to load participant count.')
        }
        if (!avgRes.ok) {
          throw new Error(avgText || 'Failed to load average response time.')
        }

        const issueData = issueText ? JSON.parse(issueText) : {}
        const countData = countText ? JSON.parse(countText) : {}
        const avgData = avgText ? JSON.parse(avgText) : {}

        setIssue(issueData)
        setParticipantCount(Number(countData?.count ?? 0))
        setAvgResponseSeconds(Number(avgData?.avgResponseSeconds ?? 0))
      } catch (err) {
        console.error(err)
        setPageError('Failed to load issue report.')
        setParticipantCount(null)
        setAvgResponseSeconds(null)
      } finally {
        setLoading(false)
      }
    }

    fetchIssue()
  }, [API_BASE, issueId])

  useEffect(() => {
    if (!issueId) return

    const fetchTrend = async () => {
      setTrendLoading(true)
      setTrendError('')

      try {
        const points = trendGranularity === 'day' ? 30 : 12
        const res = await fetch(
          `${API_BASE}/api/submissions/trend?issueId=${issueId}&granularity=${trendGranularity}&points=${points}`,
        )
        const text = await res.text()
        if (!res.ok) {
          throw new Error(text || 'Failed to load engagement trend.')
        }

        const data = text ? JSON.parse(text) : []
        const rows = Array.isArray(data) ? data : []

        const categories = rows.map((row) => {
          const period = String(row?.period || '')
          if (trendGranularity === 'month') {
            const [year, month] = period.split('-')
            const date = new Date(Number(year), Number(month) - 1, 1)
            return date.toLocaleString('en-US', { month: 'short' })
          }
          const [year, month, day] = period.split('-')
          const date = new Date(Number(year), Number(month) - 1, Number(day))
          return date.toLocaleString('en-US', { month: 'short', day: 'numeric' })
        })

        const series = rows.map((row) => Number(row?.count ?? 0))

        setTrendCategories(categories)
        setTrendSeriesData(series)
      } catch (err) {
        console.error(err)
        setTrendError('Failed to load engagement trend.')
        setTrendCategories([])
        setTrendSeriesData([])
      } finally {
        setTrendLoading(false)
      }
    }

    fetchTrend()
  }, [API_BASE, issueId, trendGranularity])

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
                      onClick={() => exportRawCsv('profile')}
                      disabled={Boolean(exportingRawType)}
                    >
                      {exportingRawType === 'profile'
                        ? 'Exporting...'
                        : 'Export Profile Raw Data'}
                    </button>

                    <button
                      type="button"
                      className="issue-action-button issue-action-button-secondary"
                      onClick={() => exportRawCsv('why')}
                      disabled={Boolean(exportingRawType)}
                    >
                      {exportingRawType === 'why'
                        ? 'Exporting...'
                        : 'Export Why Raw Data'}
                    </button>

                    <button
                      type="button"
                      className="issue-action-button issue-action-button-secondary"
                      onClick={() => exportRawCsv('how')}
                      disabled={Boolean(exportingRawType)}
                    >
                      {exportingRawType === 'how'
                        ? 'Exporting...'
                        : 'Export How Raw Data'}
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

                <div className="issue-section issue-share-section">
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
                        <div className="metric-value">
                          {participantCount === null
                            ? '--'
                            : participantCount.toLocaleString()}
                        </div>
                      </div>

                      <div className="analysis-inner-card metric-card">
                        <h3 className="report-card-title">
                          Average Response Time
                        </h3>
                        <div className="metric-value">
                          {formatAverageResponseTime(avgResponseSeconds)}
                        </div>
                      </div>
                    </div>

                    <div className="analysis-inner-card">
                      <div className="trend-header-row">
                        <h3 className="report-card-title">Participation Trend</h3>
                        <div className="trend-toggle-group">
                          <button
                            type="button"
                            onClick={() => setTrendGranularity('month')}
                            className={`trend-toggle-button ${trendGranularity === 'month' ? 'is-active' : ''}`}
                          >
                            Month
                          </button>
                          <button
                            type="button"
                            onClick={() => setTrendGranularity('day')}
                            className={`trend-toggle-button ${trendGranularity === 'day' ? 'is-active' : ''}`}
                          >
                            Day
                          </button>
                        </div>
                      </div>
                      <div className="trend-chart-wrap">
                        <Chart
                          options={trendOptions}
                          series={trendSeries}
                          type="line"
                          height={320}
                        />
                      </div>
                      <div className="trend-note">
                        {trendError
                          ? trendError
                          : trendLoading
                            ? 'Loading engagement trend...'
                            : trendGranularity === 'month'
                              ? 'Showing month-to-month submission changes.'
                              : 'Showing day-to-day submission changes (last 30 days).'}
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

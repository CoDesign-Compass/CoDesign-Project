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
  const [whyWordCloudTerms, setWhyWordCloudTerms] = useState([])
  const [howWordCloudTerms, setHowWordCloudTerms] = useState([])
  const [profileWordCloudTerms, setProfileWordCloudTerms] = useState([])
  const [profileWordCloudStatus, setProfileWordCloudStatus] = useState('idle')
  const [whyWordCloudStatus, setWhyWordCloudStatus] = useState('idle')
  const [howWordCloudStatus, setHowWordCloudStatus] = useState('idle')
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [exportingRawType, setExportingRawType] = useState('')
  const [generatingAiReport, setGeneratingAiReport] = useState(false)
  const [aiReport, setAiReport] = useState(null)

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'
  const { issueId: routeIssueId } = useParams()
  const params = new URLSearchParams(window.location.search)
  const queryIssueId = params.get('issueId')
  const issueId = routeIssueId || queryIssueId

  const MEANINGLESS_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'because', 'been', 'being', 'but', 'by',
    'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'done', 'for', 'from', 'get',
    'gets', 'getting', 'got', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers',
    'herself', 'him', 'himself', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is',
    'it', 'its', 'itself', 'just', 'me', 'might', 'more', 'most', 'my', 'myself', 'no',
    'nor', 'not', 'now', 'of', 'on', 'once', 'only', 'or', 'other', 'our', 'ours',
    'ourselves', 'out', 'over', 'own', 'really', 'same', 'she', 'should', 'so', 'some',
    'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
    'therefore', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until',
    'up', 'us', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
    'who', 'whom', 'whose', 'why', 'will', 'with', 'within', 'without', 'would', 'yes',
    'yet', 'you', 'your', 'yours', 'yourself', 'yourselves', 'also', 'maybe', 'perhaps',
    'etc', 'ok', 'okay', 'like', 'still', 'already', 'much', 'many', 'any', 'every', 'each',
    'another', 'else', 'even', 'ever', 'always', 'never', 'often', 'sometimes', 'usually',
    'mostly', 'mainly'
  ])

  const tokenizeLabel = (label) =>
    String(label ?? '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)

  const isMeaningfulLabel = (label) => {
    const tokens = tokenizeLabel(label)
    if (!tokens.length) return false

    return tokens.some(
      (token) => token.length > 1 && !MEANINGLESS_WORDS.has(token) && !/^\d+$/.test(token),
    )
  }

  const normalizeWordCloudTerms = (data) => {
    if (!Array.isArray(data)) return []

    const merged = new Map()

    data.forEach((item) => {
      const rawLabel = String(item?.label ?? '').trim()
      const value = Number(item?.value ?? 0)

      if (!rawLabel || !Number.isFinite(value) || value <= 0) return
      if (!isMeaningfulLabel(rawLabel)) return

      const key = rawLabel.toLowerCase().replace(/\s+/g, ' ').trim()
      const existing = merged.get(key)

      if (existing) {
        existing.value += value
      } else {
        merged.set(key, { label: rawLabel, value })
      }
    })

    return Array.from(merged.values()).sort(
      (a, b) => b.value - a.value || a.label.localeCompare(b.label),
    )
  }

  const handleGenerateAiReport = async () => {
    const storedShareId = localStorage.getItem('shareId')
    if (!storedShareId) {
      window.alert('No shareId found in localStorage.')
      return
    }

    setGeneratingAiReport(true)
    try {
      const response = await fetch(`${API_BASE}/api/ai-report/generate-by-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shareId: storedShareId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate AI report.')
      }

      const result = await response.json()
      console.log('AI Report Result:', result)
      setAiReport(result)
      window.alert('AI Report generated successfully!')
    } catch (err) {
      console.error(err)
      window.alert(`Error generating AI report: ${err.message}`)
    } finally {
      setGeneratingAiReport(false)
    }
  }

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

  useEffect(() => {
    if (!issueId) {
      setProfileWordCloudStatus('error')
      setWhyWordCloudStatus('error')
      setHowWordCloudStatus('error')
      setProfileWordCloudTerms([])
      setWhyWordCloudTerms([])
      setHowWordCloudTerms([])
      return
    }

    const fetchWordCloudByType = async (type, setStatus, setTerms) => {
      setStatus('loading')

      try {
        const res = await fetch(
          `${API_BASE}/api/submissions/word-cloud/${type}?issueId=${encodeURIComponent(issueId)}`,
        )
        const text = await res.text()

        if (!res.ok) {
          throw new Error(text || `Failed to load ${type} word cloud.`)
        }

        const data = text ? JSON.parse(text) : []
        const normalized = normalizeWordCloudTerms(data)

        setTerms(normalized)
        setStatus(normalized.length ? 'success' : 'empty')
      } catch (err) {
        console.error(err)
        setTerms([])
        setStatus('error')
      }
    }

    fetchWordCloudByType('profile', setProfileWordCloudStatus, setProfileWordCloudTerms)
    fetchWordCloudByType('why', setWhyWordCloudStatus, setWhyWordCloudTerms)
    fetchWordCloudByType('how', setHowWordCloudStatus, setHowWordCloudTerms)
  }, [API_BASE, issueId])

  const renderWordCloud = (status, terms, typeLabel) => {
    if (status === 'loading') {
      return <div className="report-medium-placeholder">Loading {typeLabel} word cloud...</div>
    }

    if (status === 'error') {
      return (
        <div className="report-medium-placeholder">
          Failed to load {typeLabel} word cloud data for this issue.
        </div>
      )
    }

    if (!terms.length) {
      return <div className="report-medium-placeholder">No {typeLabel} keywords found for this issue.</div>
    }

    const values = terms.map((item) => item.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const sortedTerms = [...terms].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    const maxRadiusX = 360
    const maxRadiusY = 140
    const palette = [
      '#e11d48',
      '#f97316',
      '#eab308',
      '#22c55e',
      '#06b6d4',
      '#3b82f6',
      '#6366f1',
      '#a855f7',
      '#ec4899',
      '#14b8a6',
    ]

    const placedWords = []
    const separationPadding = 18

    const intersects = (a, b) =>
      !(
        a.right + separationPadding < b.left ||
        a.left > b.right + separationPadding ||
        a.bottom + separationPadding < b.top ||
        a.top > b.bottom + separationPadding
      )

    const cloudItems = sortedTerms.map((item, index) => {
      const ratio =
        maxValue === minValue ? 1 : (item.value - minValue) / (maxValue - minValue)
      const weight = Math.round(500 + ratio * 300)
      const fontSize = 17 + ratio * 42
      const rotate = index % 4 === 0 ? -6 : index % 6 === 0 ? 6 : 0

      const estimatedWidth = Math.max(24, item.label.length * fontSize * 0.58)
      const estimatedHeight = Math.max(18, fontSize * 1.35)

      const progress = sortedTerms.length <= 1 ? 0 : index / (sortedTerms.length - 1)
      const preferredRadiusX = Math.pow(progress, 0.72) * maxRadiusX
      const preferredRadiusY = Math.pow(progress, 0.72) * maxRadiusY
      const baseAngle = index * 137.5 * (Math.PI / 180)

      let chosenX = 0
      let chosenY = 0
      let found = false

      for (let attempt = 0; attempt < 260; attempt += 1) {
        const ringOffset = Math.floor(attempt / 11) * 12
        const radiusX = preferredRadiusX + ringOffset
        const radiusY = preferredRadiusY + ringOffset * 0.62
        const angle = baseAngle + attempt * 0.42
        const x = Math.cos(angle) * radiusX
        const y = Math.sin(angle) * radiusY

        const candidate = {
          left: x - estimatedWidth / 2,
          right: x + estimatedWidth / 2,
          top: y - estimatedHeight / 2,
          bottom: y + estimatedHeight / 2,
        }

        if (!placedWords.some((w) => intersects(candidate, w))) {
          chosenX = x
          chosenY = y
          placedWords.push(candidate)
          found = true
          break
        }
      }

      if (!found) {
        const fallbackRadiusX = preferredRadiusX + maxRadiusX * 0.28
        const fallbackRadiusY = preferredRadiusY + maxRadiusY * 0.28
        chosenX = Math.cos(baseAngle) * fallbackRadiusX
        chosenY = Math.sin(baseAngle) * fallbackRadiusY
        placedWords.push({
          left: chosenX - estimatedWidth / 2,
          right: chosenX + estimatedWidth / 2,
          top: chosenY - estimatedHeight / 2,
          bottom: chosenY + estimatedHeight / 2,
        })
      }

      return {
        item,
        index,
        weight,
        fontSize,
        rotate,
        x: chosenX,
        y: chosenY,
      }
    })

    return (
      <div
        className="report-medium-placeholder"
        style={{
          position: 'relative',
          minHeight: '380px',
          textAlign: 'center',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, rgba(250, 245, 255, 0.95) 0%, rgba(240, 249, 255, 0.95) 45%, rgba(255, 251, 235, 0.95) 100%)',
          borderStyle: 'solid',
        }}
      >
        {cloudItems.map(({ item, index, weight, fontSize, rotate, x, y }) => {
          return (
            <span
              key={`${typeLabel}-${item.label}-${index}`}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                fontSize: `${fontSize}px`,
                fontWeight: weight,
                color: palette[index % palette.length],
                lineHeight: 1.3,
                transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
                display: 'inline-block',
                textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)',
                whiteSpace: 'nowrap',
              }}
              title={`${item.label}: ${item.value}`}
            >
              {item.label}
            </span>
          )
        })}
      </div>
    )
  }

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
                      onClick={handleGenerateAiReport}
                      disabled={generatingAiReport}
                    >
                      {generatingAiReport ? 'Generating...' : 'Generate AI Report'}
                    </button>

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
                          {renderWordCloud(
                            profileWordCloudStatus,
                            profileWordCloudTerms,
                            'profile',
                          )}
                        </div>

                        <div className="wordcloud-block">
                          <h4 className="report-card-title">Why Word Cloud</h4>
                          {renderWordCloud(
                            whyWordCloudStatus,
                            whyWordCloudTerms,
                            'why',
                          )}
                        </div>

                        <div className="wordcloud-block">
                          <h4 className="report-card-title">How Word Cloud</h4>
                          {renderWordCloud(
                            howWordCloudStatus,
                            howWordCloudTerms,
                            'how',
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="analysis-inner-card">
                      <h3 className="report-card-title">Sentiment Analysis</h3>
                      {aiReport && aiReport.sentimentAnalysis ? (
                        <div className="sentiment-analysis-content">
                          <div className="sentiment-chart-wrap">
                            <Chart
                              type="bar"
                              height={150}
                              series={(() => {
                                const counts = {}
                                aiReport.sentimentAnalysis.participantSentiments?.forEach((p) => {
                                  const s = p.sentiment || 'Neutral'
                                  counts[s] = (counts[s] || 0) + 1
                                })
                                return Object.entries(counts).map(([name, count]) => ({
                                  name,
                                  data: [count],
                                }))
                              })()}
                              options={{
                                chart: {
                                  stacked: true,
                                  stackType: '100%',
                                  toolbar: { show: false },
                                  sparkline: { enabled: false },
                                },
                                plotOptions: {
                                  bar: {
                                    horizontal: true,
                                    barHeight: '50%',
                                  },
                                },
                                dataLabels: {
                                  enabled: true,
                                  formatter: (val, opts) => {
                                    return `${opts.w.config.series[opts.seriesIndex].name}: ${opts.w.config.series[opts.seriesIndex].data[0]}`
                                  },
                                },
                                xaxis: {
                                  categories: ['Participants'],
                                  labels: { show: false },
                                  axisBorder: { show: false },
                                  axisTicks: { show: false },
                                },
                                yaxis: {
                                  labels: { show: false },
                                },
                                grid: { show: false },
                                fill: { opacity: 1 },
                                legend: {
                                  position: 'top',
                                  horizontalAlign: 'left',
                                },
                                tooltip: {
                                  y: {
                                    formatter: (val) => `${val} participants`,
                                  },
                                },
                              }}
                            />
                          </div>
                          <p style={{ marginTop: '1rem', fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                            {aiReport.sentimentAnalysis.summary}
                          </p>
                        </div>
                      ) : (
                        <div className="report-large-placeholder">
                          Generate AI report to see sentiment analysis.
                        </div>
                      )}
                    </div>

                    <div className="analysis-inner-card">
                      <h3 className="report-card-title">Insights & Themes</h3>
                      {aiReport ? (
                        <div className="ai-insights-content" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                          <p style={{ marginBottom: '1.5rem', fontWeight: 500 }}>{aiReport.summary}</p>
                          
                          <h4 style={{ fontSize: '16px', marginBottom: '0.8rem', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Key Insights</h4>
                          <ul style={{ paddingLeft: '1.2rem', marginBottom: '2rem' }}>
                            {aiReport.keyInsights?.map((item, idx) => (
                              <li key={idx} style={{ marginBottom: '0.8rem' }}>
                                <strong>{item.insight}</strong>
                                <span style={{ marginLeft: '10px', color: '#888', fontSize: '12px' }}>
                                  ({Math.round(item.confidence * 100)}% confidence)
                                </span>
                              </li>
                            ))}
                          </ul>

                          {aiReport.themes && aiReport.themes.length > 0 && (
                            <>
                              <h4 style={{ fontSize: '16px', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Identified Themes</h4>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                                {aiReport.themes.map((t, idx) => (
                                  <div key={idx} style={{ padding: '12px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #465fff' }}>
                                    <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px', color: '#333' }}>{t.theme}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      {t.painPoints && t.painPoints.length > 0 && (
                                        <div>
                                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#d32f2f', textTransform: 'uppercase' }}>Pain Points: </span>
                                          <span style={{ color: '#555' }}>{t.painPoints.join(', ')}</span>
                                        </div>
                                      )}
                                      {t.opportunities && t.opportunities.length > 0 && (
                                        <div>
                                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#2e7d32', textTransform: 'uppercase' }}>Opportunities: </span>
                                          <span style={{ color: '#555' }}>{t.opportunities.join(', ')}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="report-large-placeholder">
                          Generate AI report to see insights and themes.
                        </div>
                      )}
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

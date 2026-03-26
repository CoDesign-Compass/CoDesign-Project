import { ChatIcon, ArrowDownIcon, ArrowUpIcon } from '../icons'
import Badge from '../ui/badge/Badge'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

export default function Issues({ sortBy = 'updated-desc' }) {
  const navigate = useNavigate()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

  useEffect(() => {
    const fetchIssues = async () => {const res = await fetch('https://codesign-project.onrender.com/api/issues')
      try {
        const res = await fetch(`${API_BASE}/api/issues`)
        const data = await res.json()
        setIssues(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch issues', err)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [API_BASE])

  const getTime = (value) => {
    const time = value ? new Date(value).getTime() : 0
    return Number.isNaN(time) ? 0 : time
  }

  const sortedIssues = useMemo(() => {
    const items = [...issues]

    items.sort((a, b) => {
      switch (sortBy) {
        case 'updated-desc':
          return getTime(b.updatedAt) - getTime(a.updatedAt)

        case 'updated-asc':
          return getTime(a.updatedAt) - getTime(b.updatedAt)

        case 'created-desc':
          return getTime(b.createdAt) - getTime(a.createdAt)

        case 'created-asc':
          return getTime(a.createdAt) - getTime(b.createdAt)

        case 'id-asc':
          return (a.issueId ?? 0) - (b.issueId ?? 0)

        case 'title-asc':
          return (a.issueContent ?? '').localeCompare(b.issueContent ?? '')

        default:
          return getTime(b.updatedAt) - getTime(a.updatedAt)
      }
    })

    return items
  }, [issues, sortBy])

  if (loading) {
    return <div>Loading issues...</div>
  }

  if (!sortedIssues.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
        No issues available.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
      {sortedIssues.map((issue, index) => (
        <button
          key={issue.issueId}
          type="button"
          className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          onClick={() =>
            navigate(`/admin/issue-report?issueId=${issue.issueId}`)
          }
        >
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            ISSUE {index + 1}
          </h4>

          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <ChatIcon className="size-6 text-gray-800 dark:text-white/90" />
            </div>

            <span className="line-clamp-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {issue.issueContent}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                Issue ID {issue.issueId}
              </h4>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {issue.updatedAt
                  ? `Last modified: ${new Date(issue.updatedAt).toLocaleString()}`
                  : issue.createdAt
                    ? `Created: ${new Date(issue.createdAt).toLocaleString()}`
                    : 'Date unavailable'}
              </p>
            </div>

            <Badge color={issue.state === 'ACTIVE' ? 'success' : 'error'}>
              {issue.state === 'ACTIVE' ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {issue.state}
            </Badge>
          </div>
        </button>
      ))}
    </div>
  )
}
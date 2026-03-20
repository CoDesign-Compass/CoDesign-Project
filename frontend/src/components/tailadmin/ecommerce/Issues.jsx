import { ChatIcon, ArrowDownIcon, ArrowUpIcon } from '../icons'
import Badge from '../ui/badge/Badge'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Issues() {
  const navigate = useNavigate()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/issues`)
        const data = await res.json()
        setIssues(data)
      } catch (err) {
        console.error('Failed to fetch issues', err)
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [API_BASE])

  if (loading) {
    return <div>Loading issues...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {issues.map((issue, index) => (
        <div
          key={issue.issueId}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          onClick={() =>
            navigate(`/admin/issue-report?issueId=${issue.issueId}`)
          }
        >
          <h4>ISSUE {index + 1}</h4>

          <div className="flex items-center flex-start mt-5 gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800">
              <ChatIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {issue.issueContent}
            </span>
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                Issue ID {issue.issueId}
              </h4>
            </div>

            <Badge color={issue.state === 'ACTIVE' ? 'success' : 'error'}>
              {issue.state === 'ACTIVE' ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {issue.state}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

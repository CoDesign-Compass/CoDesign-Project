import { useEffect, useMemo, useState } from 'react'
import { BoxIconLine, GroupIcon } from '../icons'
import Badge from '../ui/badge/Badge'

export default function EcommerceMetrics() {
  const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'
  const [submissionCount, setSubmissionCount] = useState(null)
  const [issueCount, setIssueCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchMetrics = async () => {
      setLoading(true)
      setError('')

      try {
        const [submissionRes, issuesRes] = await Promise.all([
          fetch(`${API_BASE}/api/submissions/count`),
          fetch(`${API_BASE}/api/issues`),
        ])

        if (!submissionRes.ok) {
          throw new Error(
            `Failed to load submission count: ${submissionRes.status}`,
          )
        }
        if (!issuesRes.ok) {
          throw new Error(`Failed to load issues: ${issuesRes.status}`)
        }

        const submissionData = await submissionRes.json()
        const issuesData = await issuesRes.json()

        if (!cancelled) {
          setSubmissionCount(Number(submissionData?.count ?? 0))
          setIssueCount(Array.isArray(issuesData) ? issuesData.length : 0)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setError('Failed to load metrics')
          setSubmissionCount(null)
          setIssueCount(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMetrics()

    return () => {
      cancelled = true
    }
  }, [API_BASE])

  const formattedSubmissions = useMemo(() => {
    if (submissionCount === null) return '--'
    return submissionCount.toLocaleString()
  }, [submissionCount])

  const formattedIssues = useMemo(() => {
    if (issueCount === null) return '--'
    return issueCount.toLocaleString()
  }, [issueCount])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Submissions
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formattedSubmissions}
            </h4>
          </div>
          <Badge color="success">{loading ? 'Loading' : 'All issues'}</Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Issues
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formattedIssues}
            </h4>
          </div>

          <Badge color={error ? 'error' : 'success'}>
            {error ? 'Unavailable' : loading ? 'Loading' : 'Live'}
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  )
}

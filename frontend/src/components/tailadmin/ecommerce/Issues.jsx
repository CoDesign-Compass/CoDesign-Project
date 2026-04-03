import { ChatIcon, ArrowDownIcon, ArrowUpIcon } from '../icons'
import Badge from '../ui/badge/Badge'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

export default function Issues({ sortBy = 'updated-desc' }) {
  const navigate = useNavigate()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingIssue, setEditingIssue] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const fetchIssues = async () => {
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

  useEffect(() => {
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
          return (
            getTime(b.updatedAt || b.publishedAt) -
            getTime(a.updatedAt || a.publishedAt)
          )

        case 'updated-asc':
          return (
            getTime(a.updatedAt || a.publishedAt) -
            getTime(b.updatedAt || b.publishedAt)
          )

        case 'created-desc':
          return (
            getTime(b.createdAt || b.publishedAt) -
            getTime(a.createdAt || a.publishedAt)
          )

        case 'created-asc':
          return (
            getTime(a.createdAt || a.publishedAt) -
            getTime(b.createdAt || b.publishedAt)
          )

        case 'id-asc':
          return (a.issueId ?? 0) - (b.issueId ?? 0)

        case 'title-asc':
          return (a.issueContent ?? '').localeCompare(b.issueContent ?? '')

        default:
          return (
            getTime(b.updatedAt || b.publishedAt) -
            getTime(a.updatedAt || a.publishedAt)
          )
      }
    })

    return items
  }, [issues, sortBy])

  const openEditModal = (issue) => {
    setEditingIssue(issue)
    setEditContent(issue.issueContent || '')
  }

  const closeEditModal = () => {
    setEditingIssue(null)
    setEditContent('')
  }

  const handleSaveEdit = async () => {
    const trimmed = editContent.trim()

    if (!trimmed) {
      window.alert('Issue content cannot be empty.')
      return
    }

    if (!editingIssue) return

    setSaving(true)

    try {
      const res = await fetch(`${API_BASE}/api/issues/${editingIssue.issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueContent: trimmed,
        }),
      })

      const text = await res.text()

      if (!res.ok) {
        throw new Error(text || 'Failed to update issue.')
      }

      await fetchIssues()
      closeEditModal()
      window.alert('Issue updated successfully.')
    } catch (err) {
      console.error(err)
      window.alert(`Failed to update issue: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteIssue = async (issue) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this issue? This will also remove related submissions, why responses, and how responses.'
    )

    if (!confirmed) return

    setDeletingId(issue.issueId)

    try {
      const res = await fetch(`${API_BASE}/api/issues/${issue.issueId}`, {
        method: 'DELETE',
      })

      const text = await res.text()

      if (!res.ok) {
        throw new Error(text || 'Failed to delete issue.')
      }

      await fetchIssues()
      window.alert('Issue deleted successfully.')
    } catch (err) {
      console.error(err)
      window.alert(`Failed to delete issue: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

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
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
        {sortedIssues.map((issue, index) => (
          <div
            key={issue.issueId}
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              onClick={() =>
                navigate(`/admin/issue-report?issueId=${issue.issueId}`)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/admin/issue-report?issueId=${issue.issueId}`)
                }
              }}
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
                        : issue.publishedAt
                          ? `Published: ${new Date(issue.publishedAt).toLocaleString()}`
                          : 'Date unavailable'}
                  </p>
                </div>

                <Badge color={issue.state === 'ACTIVE' ? 'success' : 'error'}>
                  {issue.state === 'ACTIVE' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  {issue.state}
                </Badge>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <button
                type="button"
                className="rounded-xl border border-blue-300 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                onClick={() => openEditModal(issue)}
              >
                Edit
              </button>

              <button
                type="button"
                className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={() => handleDeleteIssue(issue)}
                disabled={deletingId === issue.issueId}
              >
                {deletingId === issue.issueId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Issue
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Update the issue content below.
            </p>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={8}
              className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Enter updated issue content"
            />

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={closeEditModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSaveEdit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
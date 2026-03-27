import React, { useEffect, useMemo, useState } from 'react'

/* Gift icon */
const GiftIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 12v7a2 2 0 0 1-2 2h-3v-9h5ZM9 21H6a2 2 0 0 1-2-2v-7h5v9ZM21 8h-6a2 2 0 0 1 0-4c2 0 3 2 3 2s1-2 3-2a2 2 0 1 1 0 4H3a2 2 0 0 1 0-4c2 0 3 2 3 2s1-2 3-2a2 2 0 0 1 0 4H3M12 8v13"
    />
  </svg>
)

/* export csv */
function usersToCSV(rows) {
  const header = ['id', 'name', 'email', 'status']
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [header.join(',')]
  for (const u of rows) {
    lines.push(
      [
        esc(u.id),
        esc(u.name),
        esc(u.email),
        esc(u.Sent ? 'Sent' : 'Not Sent'),
      ].join(','),
    )
  }
  return '\uFEFF' + lines.join('\n')
}

function downloadTextAsFile(text, filename) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function UserDataManagement() {
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [q, setQ] = useState('')
  const [nextBulkToSent, setNextBulkToSent] = useState(true)
  const [selected, setSelected] = useState(new Set())
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users?ts=${Date.now()}`, {
          cache: 'no-store',
        })
        const text = await res.text()
        if (!res.ok) {
          throw new Error(text || `HTTP ${res.status}`)
        }

        const data = text ? JSON.parse(text) : []
        const users = Array.isArray(data) ? data : []

        if (!cancelled) {
          setRows(() => {
            return users.map((u) => ({
              id: String(u.id),
              name: u.username || '',
              email: u.email || '',
              Sent: Boolean(u.wantsUpdates),
            }))
          })
          setSelected((prevSelected) => {
            const validIds = new Set(users.map((u) => String(u.id)))
            const next = new Set()
            prevSelected.forEach((id) => {
              if (validIds.has(id)) next.add(id)
            })
            return next
          })
          setLoadError('')
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setLoadError('Failed to load users from database.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchUsers()
    const timer = setInterval(fetchUsers, 3000)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [API_BASE])

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase()
    if (!k) return rows
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(k) ||
        r.email.toLowerCase().includes(k) ||
        r.id.toLowerCase().includes(k),
    )
  }, [q, rows])

  const total = filtered.length
  const totalAll = rows.length
  const selectedCount = selected.size
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const toggleRow = (id) => {
    setSelected((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function persistUserStatus(userId, wantsUpdates) {
    const res = await fetch(`${API_BASE}/api/users/${userId}/wants-updates`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wantsUpdates }),
    })
    const text = await res.text()
    if (!res.ok) {
      throw new Error(text || `HTTP ${res.status}`)
    }
  }

  async function toggleSent(id) {
    if (updatingStatus) return

    const row = rows.find((r) => r.id === id)
    if (!row) return

    setUpdatingStatus(true)
    try {
      const nextValue = !row.Sent
      await persistUserStatus(id, nextValue)
      setRows((list) =>
        list.map((r) => (r.id === id ? { ...r, Sent: nextValue } : r)),
      )
      setLoadError('')
    } catch (err) {
      console.error(err)
      setLoadError('Failed to update user status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleBulkToggleStatus() {
    if (selected.size === 0) return

    setUpdatingStatus(true)
    try {
      const ids = Array.from(selected)
      await Promise.all(ids.map((id) => persistUserStatus(id, nextBulkToSent)))

      setRows((prev) =>
        prev.map((u) =>
          selected.has(u.id) ? { ...u, Sent: nextBulkToSent } : u,
        ),
      )
      setNextBulkToSent((v) => !v)
      setSelected(new Set())
      setLoadError('')
    } catch (err) {
      console.error(err)
      setLoadError('Failed to update selected users.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  function handleExport(scope = 'selected') {
    const data =
      scope === 'selected' ? rows.filter((r) => selected.has(r.id)) : rows

    if (!data.length) {
      alert(scope === 'selected' ? 'No selected users.' : 'No data to export.')
      return
    }

    const csv = usersToCSV(data)
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
    downloadTextAsFile(csv, `users-${scope}-${ts}.csv`)
  }

  const hasSearch = q.trim().length > 0
  const isEmpty = paged.length === 0

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-gray-900">
            User Data Management
          </h1>
          <p className="text-sm leading-6 text-gray-500">
            Review user records, manage sent status, export data, and search
            users in a clearer and more consistent layout.
          </p>
        </div>
      </section>

      {/* Summary + actions */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total users
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {totalAll}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Filtered results
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {total}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Selected users
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {selectedCount}
            </div>
          </div>
        </div>

        {loading && (
          <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Loading users from database...
          </div>
        )}

        {!loading && loadError && (
          <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {loadError}
          </div>
        )}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={handleBulkToggleStatus}
              disabled={!selected.size || updatingStatus}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
              title={
                selected.size
                  ? `Set selected to ${nextBulkToSent ? 'Sent' : 'Not Sent'}`
                  : 'No rows selected'
              }
            >
              {`Set ${nextBulkToSent ? 'Sent' : 'Not Sent'} (Selected)`}
            </button>

            <button
              onClick={() => handleExport('selected')}
              disabled={!selected.size || updatingStatus}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="Export selected rows to CSV"
            >
              Export Selected
            </button>

            <button
              onClick={() => handleExport('all')}
              disabled={updatingStatus}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              title="Export all rows to CSV"
            >
              Export All
            </button>
          </div>

          <div className="relative">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
              placeholder="Search by name / email / id"
              className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200 sm:w-[300px]"
            />
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
              <path d="M20 20L17 17" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* Mobile card view */}
      <div className="grid gap-3 md:hidden">
        {paged.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selected.has(r.id)}
                  onChange={() => toggleRow(r.id)}
                  aria-label={`Select ${r.id}`}
                />
                <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                  {r.name?.[0] ?? 'U'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.id}</div>
                </div>
              </div>

              <span
                className={[
                  'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                  r.Sent
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                    : 'bg-amber-50 text-amber-700 ring-amber-200',
                ].join(' ')}
              >
                {r.Sent ? 'Sent' : 'Not Sent'}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-700">{r.email}</div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => toggleSent(r.id)}
                disabled={updatingStatus}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
              >
                <GiftIcon className="h-4 w-4" />
                Send Gift
              </button>
            </div>
          </div>
        ))}

        {isEmpty && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">
              {hasSearch ? 'No matching users found' : 'No users available'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {hasSearch
                ? 'Try a different keyword or clear the search field to view more results.'
                : 'User records will appear here once data becomes available.'}
            </p>
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <section className="hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:block">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              User Records
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Showing {paged.length} item{paged.length === 1 ? '' : 's'} on this
              page
              {hasSearch ? `, filtered from ${totalAll} total users.` : '.'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500">
                <th className="w-10 px-3 py-3">Select</th>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paged.map((r) => (
                <tr key={r.id} className="text-sm">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selected.has(r.id)}
                      onChange={() => toggleRow(r.id)}
                      aria-label={`Select ${r.id}`}
                    />
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                        {r.name?.[0] ?? 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {r.name}
                        </div>
                        <div className="text-gray-500">{r.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-4 text-gray-700">{r.email}</td>

                  <td className="px-3 py-4">
                    <span
                      className={[
                        'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                        r.Sent
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                          : 'bg-amber-50 text-amber-700 ring-amber-200',
                      ].join(' ')}
                    >
                      {r.Sent ? 'Sent' : 'Not Sent'}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleSent(r.id)}
                        disabled={updatingStatus}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                      >
                        <GiftIcon className="h-4 w-4" />
                        Send Gift
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {isEmpty && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center">
                    <div className="mx-auto max-w-md">
                      <h3 className="text-base font-semibold text-gray-900">
                        {hasSearch
                          ? 'No matching users found'
                          : 'No users available'}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {hasSearch
                          ? 'Try a different keyword or clear the search field to view more results.'
                          : 'User records will appear here once data becomes available.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination */}
      <section className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-500">
          Page {page} of {Math.max(1, pageCount)} · {total} filtered result
          {total === 1 ? '' : 's'}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
            className="h-9 rounded-lg border border-gray-200 bg-white px-2 pr-8 text-sm"
          >
            {[5, 8, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {`${n} / page`}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm hover:bg-gray-50"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-gray-600">
              {page} / {Math.max(1, pageCount)}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

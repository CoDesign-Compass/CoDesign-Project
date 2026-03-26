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
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [voucherCode, setVoucherCode] = useState('')
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [notice, setNotice] = useState('')
  const [emailTemplateDraft, setEmailTemplateDraft] = useState(
    'Dear {{name}},\n\nThank you so much for taking the time to answer our questions. We sincerely appreciate your support and contribution.\n\nAs a small token of our appreciation, we are happy to share your voucher code: {{voucherCode}}.\n\nPlease feel free to contact us if you have any questions.\n\nKind regards,\nCoDesign Team',
  )

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
              Sent: Boolean(u.wantsGift),
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

  async function persistUserStatus(userId, wantsGift) {
    const res = await fetch(`${API_BASE}/api/users/${userId}/wants-gift`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wantsGift }),
    })
    const text = await res.text()
    if (!res.ok) {
      throw new Error(text || `HTTP ${res.status}`)
    }
  }

  async function sendGiftEmailToUser(userId, voucherCode) {
    const res = await fetch(`${API_BASE}/api/users/${userId}/send-gift-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voucherCode,
        template: emailTemplateDraft,
      }),
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

    const defaultCode = voucherCode.trim()
    const enteredCode = window.prompt(
      `Enter voucher code for ${row.name || row.email || row.id}:`,
      defaultCode,
    )
    if (enteredCode == null) return

    const code = enteredCode.trim()
    if (!code) {
      setLoadError('Voucher code is required to send gift email.')
      return
    }

    setUpdatingStatus(true)
    try {
      await sendGiftEmailToUser(id, code)
      setRows((list) =>
        list.map((r) => (r.id === id ? { ...r, Sent: true } : r)),
      )
      setVoucherCode(code)
      setNotice(`Gift email sent to ${row.email}.`)
      setLoadError('')
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : ''
      setLoadError(message || 'Failed to send gift email.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleSendSelected() {
    if (selected.size === 0) return

    const defaultCode = voucherCode.trim()
    const enteredCode = window.prompt(
      'Enter voucher code for selected users:',
      defaultCode,
    )
    if (enteredCode == null) return

    const code = enteredCode.trim()
    if (!code) {
      setLoadError('Voucher code is required to send gift emails.')
      return
    }

    setUpdatingStatus(true)
    try {
      const ids = Array.from(selected)
      const settled = await Promise.allSettled(
        ids.map(async (id) => {
          await sendGiftEmailToUser(id, code)
          await persistUserStatus(id, true)
          return id
        }),
      )

      const successIds = []
      const failedIds = []

      settled.forEach((result, idx) => {
        const id = ids[idx]
        if (result.status === 'fulfilled') successIds.push(id)
        else failedIds.push(id)
      })

      const successSet = new Set(successIds)
      setRows((prev) =>
        prev.map((u) => (successSet.has(u.id) ? { ...u, Sent: true } : u)),
      )
      setSelected(new Set(failedIds))
      setVoucherCode(code)
      setNotice(
        `Send Selected completed. Success: ${successIds.length}, Failed: ${failedIds.length}.`,
      )

      if (failedIds.length > 0) {
        setLoadError(
          `Failed users: ${failedIds.join(', ')}. Please retry for the failed users.`,
        )
      } else {
        setLoadError('')
      }
    } catch (err) {
      console.error(err)
      setLoadError('Failed to send emails to selected users.')
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

  function handleConfirmVoucher() {
    const code = voucherCode.trim()
    if (!selected.size) {
      setLoadError('Please select at least one user before confirming voucher.')
      return
    }
    if (!code) {
      setLoadError('Please enter a vouchor code before confirming.')
      return
    }

    const sampleMessage = emailTemplateDraft
      .replace('{{name}}', 'User')
      .replace('{{voucherCode}}', code)

    setNotice(
      `Voucher confirmed for ${selected.size} selected user${
        selected.size === 1 ? '' : 's'
      }. Sample email prepared:\n${sampleMessage}`,
    )
    setLoadError('')
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
        {!loading && notice && (
          <div className="mb-3 whitespace-pre-line rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={handleSendSelected}
                disabled={!selected.size || updatingStatus}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  selected.size
                    ? 'Send emails to selected users'
                    : 'No rows selected'
                }
              >
                Send Selected
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
                <path
                  d="M20 20L17 17"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 md:p-5">
            <div className="mb-3 text-sm font-semibold text-indigo-900">
              Vouchor Code
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                id="vouchor-code"
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value)
                  if (notice) setNotice('')
                }}
                placeholder="Enter voucher code for selected users"
                className="h-11 w-full rounded-xl border border-indigo-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-300 sm:max-w-md"
              />
              <button
                onClick={handleConfirmVoucher}
                disabled={updatingStatus}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-indigo-300 bg-white px-5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Confirm voucher for selected users"
              >
                Confirm
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 md:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-amber-900">
                  Email Template
                </div>
                <p className="text-xs text-amber-700">
                  Use <code>{'{{name}}'}</code> and{' '}
                  <code>{'{{voucherCode}}'}</code> as placeholders.
                </p>
              </div>
              <button
                onClick={() => setShowTemplateEditor((v) => !v)}
                disabled={updatingStatus}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Edit email template used for voucher emails"
              >
                {showTemplateEditor
                  ? 'Hide Email Template'
                  : 'Edit Email Template'}
              </button>
            </div>

            {showTemplateEditor && (
              <div className="mt-4">
                <textarea
                  value={emailTemplateDraft}
                  onChange={(e) => {
                    setEmailTemplateDraft(e.target.value)
                    if (notice) setNotice('')
                  }}
                  rows={10}
                  className="w-full rounded-xl border border-amber-200 bg-white p-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-300"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setShowTemplateEditor(false)
                      setNotice('Email template updated.')
                      setLoadError('')
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={() => setShowTemplateEditor(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
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

import React, { useEffect, useMemo, useState } from 'react'
import SectionCard from '../../components/admin/SectionCard'
import AdminInfoTooltip from '../../components/admin/AdminInfoTooltip'

const GIFT_TEMPLATE_STORAGE_KEY = 'udm_gift_template'
const UPDATE_TEMPLATE_STORAGE_KEY = 'udm_update_template'
const EMAIL_SENT_IDS_STORAGE_KEY = 'udm_email_sent_ids'

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

const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Z"
    />
    <path
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m5 7 5.55 4.25a2.4 2.4 0 0 0 2.9 0L19 7"
    />
  </svg>
)

const TemplateTitle = ({ children, guidance, label }) => (
  <div className="flex items-center gap-2">
    <h3 className="text-base font-semibold text-gray-900">{children}</h3>
    <AdminInfoTooltip label={label}>{guidance}</AdminInfoTooltip>
  </div>
)

/* export csv */
function usersToCSV(rows) {
  const header = ['id', 'name', 'email', 'wantsUpdates', 'status']
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
        esc(u.wantsUpdates ? 'Yes' : 'No'),
        esc(u.Sent ? 'Sent' : 'Not Sent'),
      ].join(','),
    )
  }
  return '\uFEFF' + lines.join('\n')
}

function emailSubsToCSV(rows) {
  const header = [
    'submissionId',
    'email',
    'issueId',
    'wantsVoucher',
    'wantsUpdates',
    'submittedAt',
    'status',
  ]
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [header.join(',')]
  for (const s of rows) {
    lines.push(
      [
        esc(s.id),
        esc(s.email),
        esc(s.issueId),
        esc(s.wantsVoucher ? 'Yes' : 'No'),
        esc(s.wantsUpdates ? 'Yes' : 'No'),
        esc(s.submittedAt ? new Date(s.submittedAt).toLocaleString() : ''),
        esc(s._sent ? 'Sent' : 'Not Sent'),
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
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL ||
    'https://codesign-project.onrender.com'
  const [activeTab, setActiveTab] = useState('registered')
  const [rows, setRows] = useState([])
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [emailSubs, setEmailSubs] = useState([])
  const [emailSubsLoading, setEmailSubsLoading] = useState(true)
  const [emailSubsError, setEmailSubsError] = useState('')
  const [emailSentIds, setEmailSentIds] = useState(new Set())
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherInput, setVoucherInput] = useState('')
  const [voucherModalError, setVoucherModalError] = useState('')
  const [voucherModal, setVoucherModal] = useState({
    open: false,
    mode: 'single',
    type: 'user',
    userId: '',
    userLabel: '',
  })
  const [updateModal, setUpdateModal] = useState({
    open: false,
    issueId: '',
  })
  const [updateModalError, setUpdateModalError] = useState('')
  const [showGiftTemplateEditor, setShowGiftTemplateEditor] = useState(false)
  const [showUpdateTemplateEditor, setShowUpdateTemplateEditor] =
    useState(false)
  const [notice, setNotice] = useState('')
  const [emailTemplateDraft, setEmailTemplateDraft] = useState(
    'Dear {{name}},\n\nThank you so much for taking the time to answer our questions. We sincerely appreciate your support and contribution.\n\nAs a small token of our appreciation, we are happy to share your voucher code: {{voucherCode}}.\n\nPlease feel free to contact us if you have any questions.\n\nKind regards,\nCoDesign Compass Team',
  )
  const [updateEmailTemplateDraft, setUpdateEmailTemplateDraft] = useState(
    'Dear {{name}},\n\nThank you for staying engaged with CoDesign Compass.\n\nWe would like to share an update with you:\n{{issueContent}}\n\nYou can view and respond using this link:\n{{shareLink}}\n\nThank you again for your continued support.\n\nKind regards,\nCoDesign Compass Team',
  )

  useEffect(() => {
    try {
      const savedGiftTemplate = localStorage.getItem(GIFT_TEMPLATE_STORAGE_KEY)
      const savedUpdateTemplate = localStorage.getItem(
        UPDATE_TEMPLATE_STORAGE_KEY,
      )
      const savedSentIds = localStorage.getItem(EMAIL_SENT_IDS_STORAGE_KEY)

      if (savedGiftTemplate) setEmailTemplateDraft(savedGiftTemplate)
      if (savedUpdateTemplate) setUpdateEmailTemplateDraft(savedUpdateTemplate)
      if (savedSentIds) {
        const ids = JSON.parse(savedSentIds)
        if (Array.isArray(ids)) {
          setEmailSentIds(new Set(ids.map((v) => String(v))))
        }
      }
    } catch (err) {
      console.error('Failed to load saved template/status from localStorage', err)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(GIFT_TEMPLATE_STORAGE_KEY, emailTemplateDraft)
    } catch (err) {
      console.error('Failed to persist gift template', err)
    }
  }, [emailTemplateDraft])

  useEffect(() => {
    try {
      localStorage.setItem(UPDATE_TEMPLATE_STORAGE_KEY, updateEmailTemplateDraft)
    } catch (err) {
      console.error('Failed to persist update template', err)
    }
  }, [updateEmailTemplateDraft])

  useEffect(() => {
    try {
      localStorage.setItem(
        EMAIL_SENT_IDS_STORAGE_KEY,
        JSON.stringify(Array.from(emailSentIds)),
      )
    } catch (err) {
      console.error('Failed to persist email sent ids', err)
    }
  }, [emailSentIds])

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
              wantsUpdates: Boolean(u.wantsUpdates),
            }))
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

  useEffect(() => {
    const validIds =
      activeTab === 'registered'
        ? new Set(rows.map((u) => String(u.id)))
        : new Set(emailSubs.map((s) => String(s.id)))

    setSelected((prevSelected) => {
      const next = new Set()
      prevSelected.forEach((id) => {
        if (validIds.has(String(id))) next.add(String(id))
      })
      return next
    })
  }, [activeTab, rows, emailSubs])

  useEffect(() => {
    let cancelled = false

    const fetchIssues = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/issues`, {
          cache: 'no-store',
        })
        const text = await res.text()
        if (!res.ok) {
          throw new Error(text || `HTTP ${res.status}`)
        }

        const data = text ? JSON.parse(text) : []
        if (!cancelled) {
          setIssues(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchIssues()

    return () => {
      cancelled = true
    }
  }, [API_BASE])

  useEffect(() => {
    let cancelled = false

    const fetchEmailSubs = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/submissions/email-subscribers`,
          {
            cache: 'no-store',
          },
        )
        const text = await res.text()
        if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
        const data = text ? JSON.parse(text) : []
        if (!cancelled) {
          setEmailSubs(Array.isArray(data) ? data : [])
          setEmailSubsError('')
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setEmailSubsError('Failed to load email subscribers.')
      } finally {
        if (!cancelled) setEmailSubsLoading(false)
      }
    }

    fetchEmailSubs()
    const timer = setInterval(fetchEmailSubs, 10000)

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

  const filteredEmailSubs = useMemo(() => {
    const k = q.trim().toLowerCase()
    if (!k) return emailSubs
    return emailSubs.filter(
      (s) =>
        (s.email || '').toLowerCase().includes(k) ||
        String(s.id).includes(k) ||
        String(s.issueId).includes(k),
    )
  }, [q, emailSubs])

  const availableIssues = useMemo(() => {
    return [...issues].sort((a, b) => (b.issueId ?? 0) - (a.issueId ?? 0))
  }, [issues])

  const totalAll = activeTab === 'registered' ? rows.length : emailSubs.length
  const total =
    activeTab === 'registered' ? filtered.length : filteredEmailSubs.length
  const selectedCount = selected.size
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  const paged = useMemo(() => {
    const source = activeTab === 'registered' ? filtered : filteredEmailSubs
    const start = (page - 1) * pageSize
    return source.slice(start, start + pageSize)
  }, [filtered, filteredEmailSubs, activeTab, page, pageSize])

  function switchTab(tab) {
    setActiveTab(tab)
    setSelected(new Set())
    setPage(1)
    setQ('')
  }

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wantsGift }),
    })
    const text = await res.text()
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
  }

  async function sendGiftEmailToUser(userId, voucherCode) {
    const res = await fetch(`${API_BASE}/api/users/${userId}/send-gift-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voucherCode, template: emailTemplateDraft }),
    })
    const text = await res.text()
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
  }

  async function sendUpdateEmailToUser(userId, issueId, template) {
    const res = await fetch(
      `${API_BASE}/api/users/${userId}/send-update-email`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId, template }),
      },
    )
    const text = await res.text()
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
  }

  async function sendGiftEmailToSubmission(submissionId, code) {
    const res = await fetch(
      `${API_BASE}/api/submissions/${submissionId}/send-gift-email`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherCode: code,
          template: emailTemplateDraft,
        }),
      },
    )
    const text = await res.text()
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
  }

  async function sendUpdateEmailToSubmission(submissionId, issueId, template) {
    const res = await fetch(
      `${API_BASE}/api/submissions/${submissionId}/send-update-email`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId, template }),
      },
    )
    const text = await res.text()
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
  }

  function openSingleVoucherModal(id) {
    if (updatingStatus) return
    if (activeTab === 'registered') {
      const row = rows.find((r) => r.id === id)
      if (!row) return
      setVoucherInput(voucherCode.trim())
      setVoucherModalError('')
      setVoucherModal({
        open: true,
        mode: 'single',
        type: 'user',
        userId: id,
        userLabel: row.name || row.email || id,
      })
    } else {
      const sub = emailSubs.find((s) => String(s.id) === String(id))
      if (!sub) return
      setVoucherInput(voucherCode.trim())
      setVoucherModalError('')
      setVoucherModal({
        open: true,
        mode: 'single',
        type: 'submission',
        userId: String(id),
        userLabel: sub.email || String(id),
      })
    }
  }

  function openSelectedVoucherModal() {
    if (!selected.size || updatingStatus) return
    setVoucherInput(voucherCode.trim())
    setVoucherModalError('')
    setVoucherModal({
      open: true,
      mode: 'selected',
      type: activeTab === 'registered' ? 'user' : 'submission',
      userId: '',
      userLabel: '',
    })
  }

  function closeVoucherModal() {
    if (updatingStatus) return
    setVoucherModal((prev) => ({ ...prev, open: false }))
    setVoucherModalError('')
  }

  function openUpdateModal() {
    if (!selected.size || updatingStatus) return
    setUpdateModal({
      open: true,
      issueId:
        availableIssues.length > 0 ? String(availableIssues[0].issueId) : '',
    })
    setUpdateModalError('')
  }

  function closeUpdateModal() {
    if (updatingStatus) return
    setUpdateModal((prev) => ({ ...prev, open: false }))
    setUpdateModalError('')
  }

  async function handleVoucherConfirm() {
    const code = voucherInput.trim()
    if (!code) {
      setVoucherModalError('Please enter a voucher code.')
      return
    }

    setUpdatingStatus(true)
    try {
      if (voucherModal.type === 'user') {
        if (voucherModal.mode === 'single') {
          const id = voucherModal.userId
          const row = rows.find((r) => r.id === id)
          if (!row) {
            setVoucherModalError('Selected user not found.')
            return
          }
          await sendGiftEmailToUser(id, code)
          await persistUserStatus(id, true)
          setRows((list) =>
            list.map((r) => (r.id === id ? { ...r, Sent: true } : r)),
          )
          setNotice(`Gift email sent to ${row.email}.`)
          setLoadError('')
        } else {
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
          setNotice(
            `Send Gifts completed. Success: ${successIds.length}, Failed: ${failedIds.length}.`,
          )
          if (failedIds.length > 0) {
            setLoadError(
              `Failed users: ${failedIds.join(', ')}. Please retry for the failed users.`,
            )
          } else {
            setLoadError('')
          }
        }
      } else {
        if (voucherModal.mode === 'single') {
          const id = voucherModal.userId
          const sub = emailSubs.find((s) => String(s.id) === id)
          await sendGiftEmailToSubmission(id, code)
          setEmailSentIds((prev) => new Set([...prev, id]))
          setNotice(`Gift email sent to ${sub?.email}.`)
          setLoadError('')
        } else {
          const ids = Array.from(selected)
          const settled = await Promise.allSettled(
            ids.map(async (id) => {
              await sendGiftEmailToSubmission(id, code)
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
          setEmailSentIds((prev) => new Set([...prev, ...successIds]))
          setSelected(new Set(failedIds))
          setNotice(
            `Send Selected completed. Success: ${successIds.length}, Failed: ${failedIds.length}.`,
          )
          if (failedIds.length > 0) {
            setLoadError(
              `Failed submissions: ${failedIds.join(', ')}. Please retry.`,
            )
          } else {
            setLoadError('')
          }
        }
      }

      setVoucherCode(code)
      setVoucherModal((prev) => ({ ...prev, open: false }))
      setVoucherModalError('')
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : ''
      setVoucherModalError(message || 'Failed to send gift email.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleUpdateConfirm() {
    const issueId = Number(updateModal.issueId)
    const template = updateEmailTemplateDraft.trim()

    if (!Number.isFinite(issueId) || issueId <= 0) {
      setUpdateModalError('Please choose an issue.')
      return
    }
    if (!template) {
      setUpdateModalError('Please enter an email template.')
      return
    }

    setUpdatingStatus(true)
    try {
      const ids = Array.from(selected)
      const sendFn =
        activeTab === 'registered'
          ? (id) => sendUpdateEmailToUser(id, issueId, template)
          : (id) => sendUpdateEmailToSubmission(id, issueId, template)

      const settled = await Promise.allSettled(ids.map(sendFn))

      const successIds = []
      const failedIds = []
      settled.forEach((result, idx) => {
        const id = ids[idx]
        if (result.status === 'fulfilled') successIds.push(id)
        else failedIds.push(id)
      })

      if (activeTab === 'emailOnly' && successIds.length > 0) {
        setEmailSentIds((prev) => new Set([...prev, ...successIds]))
      }

      setSelected(new Set(failedIds))
      setNotice(
        `Send Updates completed for issue #${issueId}. Success: ${successIds.length}, Failed: ${failedIds.length}.`,
      )
      if (failedIds.length > 0) {
        setLoadError(`Failed: ${failedIds.join(', ')}. Please retry.`)
      } else {
        setLoadError('')
      }

      setUpdateModal((prev) => ({ ...prev, open: false }))
      setUpdateModalError('')
    } catch (err) {
      console.error(err)
      const message = err instanceof Error ? err.message : ''
      setUpdateModalError(message || 'Failed to send update email.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  function handleExport(scope = 'selected') {
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')

    if (activeTab === 'emailOnly') {
      const data =
        scope === 'selected'
          ? emailSubs
              .filter((s) => selected.has(String(s.id)))
              .map((s) => ({ ...s, _sent: emailSentIds.has(String(s.id)) }))
          : emailSubs.map((s) => ({
              ...s,
              _sent: emailSentIds.has(String(s.id)),
            }))
      if (!data.length) {
        alert(
          scope === 'selected'
            ? 'No selected subscribers.'
            : 'No data to export.',
        )
        return
      }
      downloadTextAsFile(
        emailSubsToCSV(data),
        `email-subscribers-${scope}-${ts}.csv`,
      )
      return
    }

    const data =
      scope === 'selected' ? rows.filter((r) => selected.has(r.id)) : rows
    if (!data.length) {
      alert(scope === 'selected' ? 'No selected users.' : 'No data to export.')
      return
    }
    downloadTextAsFile(usersToCSV(data), `users-${scope}-${ts}.csv`)
  }

  const hasSearch = q.trim().length > 0
  const isEmpty = paged.length === 0

  /* ---- Tab bar (shared across mobile and desktop) ---- */
  const TabBar = () => (
    <div className="flex gap-1 rounded-xl border border-gray-100 bg-gray-100 p-1">
      <button
        onClick={() => switchTab('registered')}
        className={[
          'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          activeTab === 'registered'
            ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-500'
            : 'text-gray-500 hover:text-gray-700',
        ].join(' ')}
      >
        Registered Users
        <span
          className={[
            'ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold',
            activeTab === 'registered'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-200 text-gray-500',
          ].join(' ')}
        >
          {rows.length}
        </span>
      </button>
      <button
        onClick={() => switchTab('emailOnly')}
        className={[
          'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          activeTab === 'emailOnly'
            ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-500'
            : 'text-gray-500 hover:text-gray-700',
        ].join(' ')}
      >
        Email Subscribers
        <span
          className={[
            'ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold',
            activeTab === 'emailOnly'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-200 text-gray-500',
          ].join(' ')}
        >
          {emailSubs.length}
        </span>
      </button>
    </div>
  )

  const PaginationControls = () => (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 md:flex-row md:items-center md:justify-between">
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
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Summary + actions */}
      <SectionCard title="User Data Management">
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total {activeTab === 'registered' ? 'users' : 'subscribers'}
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
              Selected
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {selectedCount}
            </div>
          </div>
        </div>

        {(loading || emailSubsLoading) && (
          <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Loading...
          </div>
        )}

        {!loading && loadError && (
          <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {loadError}
          </div>
        )}
        {!emailSubsLoading && emailSubsError && (
          <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {emailSubsError}
          </div>
        )}
        {notice && (
          <div className="mb-3 whitespace-pre-line rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={openSelectedVoucherModal}
                disabled={!selected.size || updatingStatus}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-base font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  selected.size ? 'Send emails to selected' : 'No rows selected'
                }
              >
                Send Gifts
              </button>

              <button
                onClick={openUpdateModal}
                disabled={!selected.size || updatingStatus}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-base font-medium text-sky-700 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  selected.size
                    ? 'Send issue updates to selected'
                    : 'No rows selected'
                }
              >
                Send Updates
              </button>

              <button
                onClick={() => handleExport('selected')}
                disabled={!selected.size || updatingStatus}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Export selected rows to CSV"
              >
                Export Selected
              </button>

              <button
                onClick={() => handleExport('all')}
                disabled={updatingStatus}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
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
                placeholder={
                  activeTab === 'registered'
                    ? 'Search by name / email / id'
                    : 'Search by email / id / issue'
                }
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

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MailIcon className="h-5 w-5" />
                </div>
                <div>
                  <TemplateTitle
                    label="Show gift email template guidance"
                    guidance="Write the message once. When the email is sent, the system will replace the labels below with each recipient's real details, such as their name and voucher code."
                  >
                    Gift Email Template
                  </TemplateTitle>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Recipient name: <code>{'{{name}}'}</code>
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Voucher code: <code>{'{{voucherCode}}'}</code>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGiftTemplateEditor((v) => !v)}
                disabled={updatingStatus}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Edit email template used for voucher emails"
              >
                {showGiftTemplateEditor ? 'Hide Editor' : 'Edit Template'}
              </button>
            </div>

            {showGiftTemplateEditor && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <label
                  htmlFor="gift-email-template"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email message
                </label>
                <textarea
                  id="gift-email-template"
                  value={emailTemplateDraft}
                  onChange={(e) => {
                    setEmailTemplateDraft(e.target.value)
                    if (notice) setNotice('')
                  }}
                  rows={10}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Keep the labels in double curly brackets wherever you want the
                  personalised details to appear in the email.
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  If <code>{'{{name}}'}</code> is unavailable, the system will use
                  <strong> client </strong> automatically.
                </p>
                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => setShowGiftTemplateEditor(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowGiftTemplateEditor(false)
                      setNotice('Email template updated.')
                      setLoadError('')
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Save Template
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <MailIcon className="h-5 w-5" />
                </div>
                <div>
                  <TemplateTitle
                    label="Show update email template guidance"
                    guidance="Write the update once. When the email is sent, the system will automatically add the recipient's name, the issue summary, and the response link in the places you choose."
                  >
                    Update Email Template
                  </TemplateTitle>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Recipient name: <code>{'{{name}}'}</code>
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Response link: <code>{'{{shareLink}}'}</code>
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Issue summary: <code>{'{{issueContent}}'}</code>
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowUpdateTemplateEditor((v) => !v)}
                disabled={updatingStatus}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="Edit email template used for issue updates"
              >
                {showUpdateTemplateEditor ? 'Hide Editor' : 'Edit Template'}
              </button>
            </div>

            {showUpdateTemplateEditor && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <label
                  htmlFor="update-email-template"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email message
                </label>
                <textarea
                  id="update-email-template"
                  value={updateEmailTemplateDraft}
                  onChange={(e) => {
                    setUpdateEmailTemplateDraft(e.target.value)
                    if (notice) setNotice('')
                  }}
                  rows={10}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Keep the labels in double curly brackets wherever you want the
                  personalised details to appear in the email.
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  If <code>{'{{name}}'}</code> is unavailable, the system will use
                  <strong> client </strong> automatically.
                </p>
                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => setShowUpdateTemplateEditor(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowUpdateTemplateEditor(false)
                      setNotice('Update email template updated.')
                      setLoadError('')
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Save Template
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Mobile card view */}
      <SectionCard
        title="Users Records"
        className="md:hidden"
        bodyClassName="p-0"
        titleClassName="text-base"
      >
        <div className="space-y-3 p-5 md:p-6">
          <TabBar />

          {paged.map((r) => {
            const id = String(r.id)
            const isSent =
              activeTab === 'registered' ? r.Sent : emailSentIds.has(id)
            const name = activeTab === 'registered' ? r.name : r.email
            const subText =
              activeTab === 'registered'
                ? `Issue #${id}`
                : `Issue #${r.issueId}`

            return (
              <div
                key={id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selected.has(id)}
                      onChange={() => toggleRow(id)}
                      aria-label={`Select ${id}`}
                    />
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                      {name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{name}</div>
                      <div className="text-xs text-gray-500">{subText}</div>
                    </div>
                  </div>

                  <span
                    className={[
                      'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                      isSent
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-amber-50 text-amber-700 ring-amber-200',
                    ].join(' ')}
                  >
                    {isSent ? 'Sent' : 'Not Sent'}
                  </span>
                </div>

                {activeTab === 'registered' && (
                  <div className="mt-2 text-sm text-gray-700">{r.email}</div>
                )}
                {activeTab === 'emailOnly' && (
                  <div className="mt-2 flex gap-2 text-xs">
                    {r.wantsUpdates && (
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-700 ring-1 ring-sky-200">
                        Wants Updates
                      </span>
                    )}
                    {r.wantsVoucher && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-200">
                        Wants Voucher
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => openSingleVoucherModal(id)}
                    disabled={updatingStatus}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    <GiftIcon className="h-4 w-4" />
                    Send Gift
                  </button>
                </div>
              </div>
            )
          })}

          {isEmpty && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-base font-semibold text-gray-900">
                {hasSearch
                  ? 'No matching records found'
                  : 'No records available'}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {hasSearch
                  ? 'Try a different keyword or clear the search field.'
                  : 'Records will appear here once data becomes available.'}
              </p>
            </div>
          )}
        </div>
        <PaginationControls />
      </SectionCard>

      {/* Desktop table view */}
      <SectionCard
        title="User Records"
        className="hidden md:block"
        bodyClassName="p-0"
        titleClassName="text-base"
        headerRight={<TabBar />}
      >
        <div className="overflow-x-auto p-4">
          {activeTab === 'registered' ? (
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="w-10 px-3 py-3">Select</th>
                  <th className="px-3 py-3">User</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Wants Updates</th>
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
                          <div className="text-gray-500">Issue #{r.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-gray-700">{r.email}</td>

                    <td className="px-3 py-4">
                      <span
                        className={[
                          'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                          r.wantsUpdates
                            ? 'bg-sky-50 text-sky-700 ring-sky-200'
                            : 'bg-gray-50 text-gray-500 ring-gray-200',
                        ].join(' ')}
                      >
                        {r.wantsUpdates ? 'Yes' : 'No'}
                      </span>
                    </td>

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
                          onClick={() => openSingleVoucherModal(r.id)}
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
                    <td colSpan={6} className="px-3 py-10 text-center">
                      <div className="mx-auto max-w-md">
                        <h3 className="text-base font-semibold text-gray-900">
                          {hasSearch
                            ? 'No matching users found'
                            : 'No users available'}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {hasSearch
                            ? 'Try a different keyword or clear the search field.'
                            : 'User records will appear here once data becomes available.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="w-10 px-3 py-3">Select</th>
                  <th className="px-3 py-3">Subscriber</th>
                  <th className="px-3 py-3">Wants Updates</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paged.map((s) => {
                  const id = String(s.id)
                  const isSent = emailSentIds.has(id)
                  return (
                    <tr key={id} className="text-sm">
                      <td className="px-3 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selected.has(id)}
                          onChange={() => toggleRow(id)}
                          aria-label={`Select ${id}`}
                        />
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-50 font-semibold text-violet-600">
                            {s.email?.[0]?.toUpperCase() ?? 'E'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {s.email}
                            </div>
                            <div className="text-gray-500">
                              Issue #{s.issueId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={[
                            'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                            s.wantsUpdates
                              ? 'bg-sky-50 text-sky-700 ring-sky-200'
                              : 'bg-gray-50 text-gray-500 ring-gray-200',
                          ].join(' ')}
                        >
                          {s.wantsUpdates ? 'Yes' : 'No'}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={[
                            'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
                            isSent
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                              : 'bg-amber-50 text-amber-700 ring-amber-200',
                          ].join(' ')}
                        >
                          {isSent ? 'Sent' : 'Not Sent'}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openSingleVoucherModal(id)}
                            disabled={updatingStatus}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                          >
                            <GiftIcon className="h-4 w-4" />
                            Send Gift
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {isEmpty && (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center">
                      <div className="mx-auto max-w-md">
                        <h3 className="text-base font-semibold text-gray-900">
                          {hasSearch
                            ? 'No matching subscribers found'
                            : 'No email subscribers yet'}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {hasSearch
                            ? 'Try a different keyword or clear the search field.'
                            : 'Email submissions will appear here once users complete the thank-you page.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <PaginationControls />
      </SectionCard>

      {voucherModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 md:px-6">
              <div className="text-lg font-semibold text-slate-900">
                {voucherModal.mode === 'selected'
                  ? 'Send Gift Emails to Selected'
                  : 'Send Gift Email'}
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {voucherModal.mode === 'selected'
                  ? `Enter one voucher code to send to ${selected.size} selected record${selected.size === 1 ? '' : 's'}.`
                  : `Enter a voucher code for ${voucherModal.userLabel}.`}
              </p>
            </div>

            <div className="space-y-5 px-5 py-5 md:px-6 md:py-6">
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
                <label
                  htmlFor="voucher-code-modal"
                  className="block text-base font-semibold tracking-wide text-indigo-900 md:text-lg"
                >
                  Voucher Code
                </label>
                <p className="mt-1 text-sm text-indigo-800/80">
                  This code will be inserted into the email template.
                </p>
                <input
                  id="voucher-code-modal"
                  value={voucherInput}
                  onChange={(e) => {
                    setVoucherInput(e.target.value)
                    if (voucherModalError) setVoucherModalError('')
                  }}
                  placeholder="e.g. GIFT-2026-ABC123"
                  className="mt-3 h-14 w-full rounded-xl border border-indigo-300 bg-white px-4 text-lg font-semibold text-slate-900 shadow-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 md:text-xl"
                  autoFocus
                />
                {voucherModalError && (
                  <p className="mt-2 text-sm text-red-600">
                    {voucherModalError}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={closeVoucherModal}
                  disabled={updatingStatus}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVoucherConfirm}
                  disabled={updatingStatus}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingStatus ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {updateModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 md:px-6">
              <div className="text-lg font-semibold text-slate-900">
                Send Updates to Selected
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Choose an issue for the {selected.size} selected record
                {selected.size === 1 ? '' : 's'} and review the update email
                content before sending.
              </p>
            </div>

            <div className="space-y-5 px-5 py-5 md:px-6 md:py-6">
              <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
                <label
                  htmlFor="issue-id-modal"
                  className="block text-base font-semibold tracking-wide text-sky-900 md:text-lg"
                >
                  Issue
                </label>
                <p className="mt-1 text-sm text-sky-800/80">
                  Select the issue to reference in the update email.
                </p>
                <select
                  id="issue-id-modal"
                  value={updateModal.issueId}
                  onChange={(e) => {
                    setUpdateModal((prev) => ({
                      ...prev,
                      issueId: e.target.value,
                    }))
                    if (updateModalError) setUpdateModalError('')
                  }}
                  className="mt-3 h-12 w-full rounded-xl border border-sky-300 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                >
                  <option value="">Select an issue</option>
                  {availableIssues.map((issue) => (
                    <option key={issue.issueId} value={issue.issueId}>
                      {`#${issue.issueId} - ${issue.issueContent || 'Untitled issue'}`}
                    </option>
                  ))}
                </select>
              </div>

              {updateModalError && (
                <p className="text-sm text-red-600">{updateModalError}</p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={closeUpdateModal}
                  disabled={updatingStatus}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateConfirm}
                  disabled={updatingStatus || availableIssues.length === 0}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingStatus ? 'Sending...' : 'Send Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

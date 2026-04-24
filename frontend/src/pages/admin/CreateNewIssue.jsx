import React, { useState } from 'react'
import {
  ArrowLeft,
  Copy,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import SectionCard from '../../components/admin/SectionCard'
import AdminInfoTooltip from '../../components/admin/AdminInfoTooltip'

export default function CreateNewIssue() {
  const [issueContent, setIssueContent] = useState('')
  const [consentText, setConsentText] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [publishSuccess, setPublishSuccess] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [isCopying, setIsCopying] = useState(false)

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL ||
    'http://localhost:8080'

  const handleSubmit = async () => {
    const content = issueContent.trim()
    const consent = consentText.trim()

    setPublishError('')
    setPublishSuccess('')
    setCopyStatus('')

    if (!content) {
      setPublishError('Issue content cannot be empty.')
      return
    }

    if (!consent) {
      setPublishError('Consent text cannot be empty.')
      return
    }

    if (consent.length > 5000) {
      setPublishError('Consent text must not exceed 5000 characters.')
      return
    }

    setIsPublishing(true)

    try {
      const response = await fetch(`${API_BASE}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueContent: content,
          consentText: consent,
        }),
      })

      let data = null
      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create issue')
      }

      const url = `${window.location.origin}/share/${data.shareId}`

      setShareLink(url)
      setPublishSuccess('Issue published successfully. Share link generated.')
      console.log('Created issue:', data)
    } catch (err) {
      console.error(err)
      setPublishError(
        err.message || 'Failed to publish issue. Please try again.',
      )
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCopy = async () => {
    if (!shareLink || isCopying) return

    setCopyStatus('')
    setIsCopying(true)

    try {
      await navigator.clipboard.writeText(shareLink)
      setCopyStatus('Link copied to clipboard.')
    } catch (e) {
      console.error(e)
      setCopyStatus('Copy failed. Please copy the link manually.')
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Create New Issue"
        headerRight={
          <button
            onClick={() => window.history.back()}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        }
      >
        <div className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <label
              htmlFor="issue-content"
              className="mb-2 block font-medium text-gray-700"
            >
              Issue Content
            </label>
          </div>

          <textarea
            id="issue-content"
            rows={6}
            className={`w-full rounded-xl bg-white p-3 text-gray-800 outline-none transition focus:ring-2 ${
              publishError
                ? 'border border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
            value={issueContent}
            onChange={(e) => setIssueContent(e.target.value)}
            placeholder="Enter issue content..."
            aria-invalid={publishError ? 'true' : 'false'}
          />
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <label htmlFor="consent-text" className="block font-medium text-gray-700">
              Consent Text
            </label>
            <AdminInfoTooltip label="Show consent text guidance">
              Enter the consent text that users must read and agree to before starting.
            </AdminInfoTooltip>
          </div>

          <textarea
            id="consent-text"
            rows={10}
            maxLength={5000}
            className={`w-full rounded-xl p-3 text-gray-800 focus:outline-none focus:ring ${
              publishError
                ? 'border border-red-300 focus:ring-red-100'
                : 'border border-gray-300 focus:ring-blue-200'
            }`}
            value={consentText}
            onChange={(e) => setConsentText(e.target.value)}
            placeholder="Enter consent text..."
            aria-invalid={publishError ? 'true' : 'false'}
          />

          <div className="mt-2 text-right text-xs text-gray-400">
            {consentText.length}/5000
          </div>
        </div>

        {(publishError || publishSuccess) && (
          <div
            role={publishError ? 'alert' : 'status'}
            aria-live={publishError ? 'assertive' : 'polite'}
            className={`mb-5 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
              publishError
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            {publishError ? (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{publishError || publishSuccess}</span>
          </div>
        )}

        <div className="flex justify-center md:justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPublishing}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:opacity-70"
          >
            {isPublishing ? 'Publishing...' : 'Publish Issue'}
          </button>
        </div>
      </SectionCard>

      {shareLink && (
        <SectionCard
          title="Share Link"
          subtitle="Anyone with this link can access the issue page."
          headerRight={<LinkIcon className="h-4 w-4 text-gray-700" />}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              className="flex-1 rounded-xl border border-gray-300 bg-white p-2.5 text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={shareLink}
              readOnly
              aria-label="Share link"
            />
            <button
              type="button"
              onClick={handleCopy}
              disabled={isCopying}
              className={`inline-flex items-center justify-center rounded-xl border p-2.5 transition-colors ${
                isCopying
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 opacity-70'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              title="Copy link"
              aria-label="Copy link"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {copyStatus && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-3 text-sm ${
                copyStatus.toLowerCase().includes('failed')
                  ? 'text-red-700'
                  : 'text-green-700'
              }`}
            >
              {copyStatus}
            </div>
          )}
        </SectionCard>
      )}
    </div>
  )
}

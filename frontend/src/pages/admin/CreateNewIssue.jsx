import React, { useState } from 'react'
import Button from '../../components/tailadmin/ui/button/Button'
import {
  ArrowLeft,
  Copy,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function CreateNewIssue() {
  const [issueContent, setIssueContent] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [publishSuccess, setPublishSuccess] = useState('')
  const [copyStatus, setCopyStatus] = useState('')
  const [isCopying, setIsCopying] = useState(false)

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const handleSubmit = async () => {
    const content = issueContent.trim()

    setPublishError('')
    setPublishSuccess('')
    setCopyStatus('')

    if (!content) {
      setPublishError('Issue content cannot be empty.')
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
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create issue')
      }

      const data = await response.json()
      const url = `${window.location.origin}/share/${data.shareId}`

      setShareLink(url)
      setPublishSuccess('Issue published successfully. Share link generated.')
      console.log('Created issue:', data)
    } catch (err) {
      console.error(err)
      setPublishError('Failed to publish issue. Please try again.')
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
    <div className="mx-auto max-w-3xl p-6">
      {/* Back */}
      <div className="mb-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900"
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Create New Issue
        </h1>
        <p className="text-sm leading-6 text-gray-600">
          Publish an issue and generate a shareable public link for user access.
        </p>
      </div>

      {/* Main form card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4">
          <label
            htmlFor="issue-content"
            className="mb-2 block font-medium text-gray-700"
          >
            Issue Content
          </label>
          <p className="mb-3 text-sm leading-6 text-gray-500">
            Enter the issue content clearly so it can be published and shared.
          </p>

          <textarea
            id="issue-content"
            rows={6}
            className={`w-full rounded-xl p-3 text-gray-800 focus:outline-none focus:ring ${
              publishError
                ? 'border border-red-300 focus:ring-red-100'
                : 'border border-gray-300 focus:ring-blue-200'
            }`}
            value={issueContent}
            onChange={(e) => setIssueContent(e.target.value)}
            placeholder="Enter issue content..."
            aria-invalid={publishError ? 'true' : 'false'}
          />
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
          <Button onClick={handleSubmit} disabled={isPublishing}>
            {isPublishing ? 'Publishing...' : 'Publish Issue'}
          </Button>
        </div>
      </section>

      {/* Share link result */}
      {shareLink && (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-gray-700" />
            <h2 className="font-semibold text-gray-800">Share Link</h2>
          </div>

          <p className="mb-4 text-sm leading-6 text-gray-600">
            Anyone with this link can access the issue page.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              className="flex-1 rounded-xl border border-gray-300 bg-white p-2.5 text-gray-800"
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
                  : 'border-gray-300 hover:bg-gray-100'
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
        </section>
      )}
    </div>
  )
}

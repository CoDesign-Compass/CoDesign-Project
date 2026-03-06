import React, { useState } from 'react'
import Button from '../../components/tailadmin/ui/button/Button'
import { ArrowLeft, Copy, Link as LinkIcon } from 'lucide-react'

export default function CreateNewIssue() {
  const [issueContent, setIssueContent] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

  const handleSubmit = async () => {
    const content = issueContent.trim()
    // Basic validation: issue content must not be empty
    if (!content) {
      alert('Issue Content cannot be empty.')
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch('http://localhost:8080/api/issues', {
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

      // Generate the public share link
      const url = `${window.location.origin}/share/${data.shareId}`
      setShareLink(url)
      console.log('Created issue:', data)
    } catch (err) {
      console.error(err)
      alert('Failed to publish issue')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCopy = async () => {
    if (!shareLink) return
    try {
      await navigator.clipboard.writeText(shareLink)
      alert('Link copied!')
    } catch (e) {
      console.error(e)
      alert('Copy failed. Please copy the link manually.')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* back */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
          type="button"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>

      {/* Issue content */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Issue Content</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
          value={issueContent}
          onChange={(e) => setIssueContent(e.target.value)}
          placeholder="Enter issue content..."
        />
      </div>

      {/* publish button */}
      <div className="text-center">
        <Button onClick={handleSubmit} disabled={isPublishing}>
          {isPublishing ? 'Publishing...' : 'Publish Issue'}
        </Button>
      </div>

      {/* Share link panel：show after pulish successfully */}
      {shareLink && (
        <div className="mt-8 border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="w-4 h-4 text-gray-700" />
            <h2 className="font-semibold text-gray-800">Share link</h2>
          </div>

          <div className="flex items-center gap-2">
            <input
              className="flex-1 border rounded-lg p-2 bg-white"
              value={shareLink}
              readOnly
            />
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 border rounded-lg hover:bg-gray-100"
              title="Copy link"
              aria-label="Copy link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-2">
            Anyone with this link can access the issue page.
          </p>
        </div>
      )}
    </div>
  )
}

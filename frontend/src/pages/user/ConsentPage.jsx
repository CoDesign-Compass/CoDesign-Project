import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useIssue } from '../../context/IssueContext'

export default function ConsentPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const navigate = useNavigate()
  const { setIssueId, setShareId, setIssueContent } = useIssue()

  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [consentText, setConsentText] = useState('')
  const [checked, setChecked] = useState(false)

  const API_BASE =
 process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  useEffect(() => {
    if (!routeShareId) return

    const fetchIssueContext = async () => {
      setLoading(true)
      setPageError('')

      try {
        const res = await fetch(`${API_BASE}/api/share/${routeShareId}`)
        const text = await res.text()

        if (!res.ok) {
          throw new Error(text || 'Failed to fetch consent details')
        }

        const data = text ? JSON.parse(text) : {}

        const fetchedIssueId = Number(data?.issueId)
        if (!Number.isFinite(fetchedIssueId) || fetchedIssueId <= 0) {
          throw new Error('Invalid issueId from /api/share/{shareId}')
        }

        setIssueId(fetchedIssueId)
        setShareId(data?.shareId ?? routeShareId)
        setIssueContent(data?.issueContent || '')
        setConsentText(
          (data?.consentText || '').trim() ||
            'By continuing, you confirm that you understand the purpose of this feedback activity and agree to proceed.'
        )

        localStorage.setItem('issueId', String(fetchedIssueId))
        localStorage.setItem('shareId', String(data?.shareId ?? routeShareId))
      } catch (error) {
        console.error('Failed to load consent page:', error)
        setPageError('This consent page could not be loaded. Please try the share link again.')
      } finally {
        setLoading(false)
      }
    }

    fetchIssueContext()
  }, [API_BASE, routeShareId, setIssueContent, setIssueId, setShareId])

  const handleContinue = () => {
    if (!checked) return
    navigate(`/share/${routeShareId}/profile`)
  }

  const pageTextColor = theme === 'light' ? '#303030' : '#f5f5f5'
  const secondaryTextColor = theme === 'light' ? '#555555' : '#d6d6d6'
  const cardBackground = theme === 'light' ? '#ffffff' : '#1f1f1f'
  const cardBorder = theme === 'light' ? '#e9ecef' : 'rgba(255,255,255,0.10)'
  const pageBackground = theme === 'light' ? '#f8f9fa' : 'transparent'
  const buttonBackground = '#7F7FBC'
  const buttonTextColor = '#ffffff'

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        padding: '24px 20px 40px',
        boxSizing: 'border-box',
        fontFamily: 'Poppins, sans-serif',
        color: pageTextColor,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(28px, 4vw, 40px)',
            lineHeight: 1.2,
            color: pageTextColor,
          }}
        >
          Consent
        </h1>

        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 15,
            lineHeight: 1.7,
            color: secondaryTextColor,
          }}
        >
          Please read the information below before continuing.
        </p>
      </div>

      {loading && (
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 12,
            background: cardBackground,
            border: `1px solid ${cardBorder}`,
            color: secondaryTextColor,
          }}
        >
          Loading consent information...
        </div>
      )}

      {!loading && pageError && (
        <div
          role="alert"
          style={{
            padding: '18px 20px',
            borderRadius: 12,
            background: cardBackground,
            border: `1px solid ${cardBorder}`,
            color: '#9b1c1c',
            lineHeight: 1.6,
          }}
        >
          {pageError}
        </div>
      )}

      {!loading && !pageError && (
        <>
          <div
            style={{
              background: cardBackground,
              border: `1px solid ${cardBorder}`,
              borderRadius: 16,
              padding: '24px 22px',
              boxShadow:
                theme === 'light'
                  ? '0 6px 18px rgba(0,0,0,0.06)'
                  : '0 8px 20px rgba(0,0,0,0.20)',
            }}
          >
            <div
              style={{
                fontSize: 15,
                lineHeight: 1.85,
                whiteSpace: 'pre-wrap',
                color: pageTextColor,
              }}
            >
              {consentText}
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              padding: '18px 20px',
              borderRadius: 14,
              background: pageBackground,
              border: `1px solid ${cardBorder}`,
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                cursor: 'pointer',
                lineHeight: 1.6,
                color: pageTextColor,
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                style={{
                  marginTop: 3,
                  width: 16,
                  height: 16,
                  accentColor: '#7F7FBC',
                  cursor: 'pointer',
                }}
              />
              <span>I understand and agree to continue.</span>
            </label>
          </div>

          <div
            style={{
              marginTop: 28,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={handleContinue}
              disabled={!checked}
              style={{
                fontSize: 16,
                borderRadius: 10,
                padding: '12px 22px',
                border: 'none',
                background: buttonBackground,
                color: buttonTextColor,
                fontFamily: 'Poppins, sans-serif',
                cursor: checked ? 'pointer' : 'not-allowed',
                opacity: checked ? 1 : 0.6,
                transition: 'opacity 0.2s ease',
              }}
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  )
}
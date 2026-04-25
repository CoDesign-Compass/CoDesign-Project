import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useIssue } from '../../context/IssueContext'
import { Button } from '../../components/ui/button'
import { Checkbox } from '../../components/ui/checkbox'
import { Alert } from '../../components/ui/alert'

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
        if (!res.ok) throw new Error(text || 'Failed to fetch consent details')

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
            'By continuing, you confirm that you understand the purpose of this feedback activity and agree to proceed.',
        )

        localStorage.setItem('issueId', String(fetchedIssueId))
        localStorage.setItem('shareId', String(data?.shareId ?? routeShareId))
      } catch (error) {
        console.error('Failed to load consent page:', error)
        setPageError(
          'This consent page could not be loaded. Please try the share link again.',
        )
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

  const isDark = theme === 'dark'

  const pageBg = isDark ? '#1e1e1e' : '#f5f5f5'
  const cardBg = isDark ? '#272727' : '#ffffff'
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const cardShadow = isDark
    ? '0 1px 6px rgba(0,0,0,0.35)'
    : '0 1px 6px rgba(0,0,0,0.07)'
  const textColor = isDark ? '#f0f0f0' : '#1a1a1a'
  const subText = isDark ? '#888' : '#777'
  const divider = isDark ? 'rgba(255,255,255,0.07)' : '#f0f0f0'
  const contentBg = isDark ? '#1e1e1e' : '#ffffff'
  const contentBorder = isDark ? 'rgba(255,255,255,0.12)' : '#ddd'

  const cardStyle = {
    background: cardBg,
    borderRadius: 16,
    padding: 24,
    boxShadow: cardShadow,
    border: `1px solid ${cardBorder}`,
    marginBottom: 20,
  }

  if (loading) {
    return (
      <div
        style={{
          background: pageBg,
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <p style={{ color: subText, fontSize: 14 }}>Loading…</p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: pageBg,
        minHeight: '100%',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '28px 20px 40px',
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: textColor,
              margin: '0 0 6px',
            }}
          >
            Consent
          </h1>
          <p
            style={{
              fontSize: 14,
              color: subText,
              margin: 0,
            }}
          >
            Please read the information below before continuing.
          </p>
        </div>

        {pageError && (
          <div style={{ marginBottom: 20 }}>
            <Alert variant="error">{pageError}</Alert>
          </div>
        )}

        {!pageError && (
          <>
            <div style={cardStyle}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#c49a00',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                Step 0
              </div>

              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: textColor,
                  margin: '0 0 4px',
                }}
              >
                Consent Information
              </h2>

              <p
                style={{
                  fontSize: 13,
                  color: subText,
                  margin: '0 0 20px',
                }}
              >
                Please make sure you are comfortable before continuing.
              </p>

              <div
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: 12,
                  border: `1.5px solid ${contentBorder}`,
                  background: contentBg,
                  color: textColor,
                  fontSize: 14,
                  lineHeight: 1.8,
                  boxSizing: 'border-box',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {consentText}
              </div>
            </div>

            <div style={cardStyle}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setChecked((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setChecked((prev) => !prev)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  cursor: 'pointer',
                  borderRadius: 12,
                  outline: 'none',
                }}
              >
                <div
                  style={{
                    marginTop: 2,
                    flexShrink: 0,
                    pointerEvents: 'none',
                  }}
                >
                  <Checkbox checked={checked} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: textColor,
                      marginBottom: 4,
                    }}
                  >
                    I understand and agree to continue.
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: subText,
                      lineHeight: 1.6,
                    }}
                  >
                    You need to confirm this before moving to the next step.
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: `1px solid ${divider}`,
                marginTop: 8,
                paddingTop: 20,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="yellow"
                onClick={handleContinue}
                disabled={!checked}
              >
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

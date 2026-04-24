import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useIssue } from '../../context/IssueContext'
import { Button } from '../../components/ui/button'
import { Alert } from '../../components/ui/alert'

const STEPS = [
  { num: '01', label: 'Profile', desc: 'Your background' },
  { num: '02', label: 'Why', desc: 'Your perspective' },
  { num: '03', label: 'How', desc: 'Your suggestions' },
]

export default function WelcomePage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { shareId, setIssueId, setShareId, setIssueContent } = useIssue()

  const [starting, setStarting] = useState(false)
  const [loadingIssueContext, setLoadingIssueContext] = useState(false)
  const [pageError, setPageError] = useState('')

  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  useEffect(() => {
    if (!routeShareId) return

    const fetchIssueContext = async () => {
      setLoadingIssueContext(true)
      setPageError('')

      try {
        const res = await fetch(`${API_BASE}/api/share/${routeShareId}`)
        const text = await res.text()
        if (!res.ok) throw new Error(text || 'Failed to fetch issue context')

        const data = text ? JSON.parse(text) : {}
        const fetchedIssueId = Number(data?.issueId)

        if (!Number.isFinite(fetchedIssueId) || fetchedIssueId <= 0) {
          throw new Error('Invalid issueId from /api/share/{shareId}')
        }

        setIssueId(fetchedIssueId)
        setShareId(data?.shareId ?? routeShareId)
        setIssueContent(data?.issueContent || '')

        localStorage.setItem('issueId', String(fetchedIssueId))
        localStorage.setItem('shareId', String(data?.shareId ?? routeShareId))
      } catch (error) {
        console.error('Failed to initialise issue context:', error)
        setPageError('This share link is invalid or could not be loaded.')
      } finally {
        setLoadingIssueContext(false)
      }
    }

    fetchIssueContext()
  }, [routeShareId, API_BASE, setIssueId, setShareId, setIssueContent])

  const onStart = async () => {
    if (starting) return
    setStarting(true)
    setPageError('')

    try {
      const issueId = Number(localStorage.getItem('issueId'))

      if (!Number.isFinite(issueId) || issueId <= 0) {
        setPageError(
          'No issue is available yet. Please open this page from a valid share link.',
        )
        return
      }

      const res = await fetch(`${API_BASE}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId }),
      })

      const text = await res.text()
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`)

      const data = text ? JSON.parse(text) : null
      const submissionId = data?.id

      if (!submissionId) throw new Error('No submissionId returned from backend.')

      localStorage.setItem('submissionId', String(submissionId))
      localStorage.setItem('issueId', String(data?.issueId ?? issueId))

      const currentShareId = routeShareId || shareId
      if (currentShareId) navigate(`/share/${currentShareId}/consent`)
      else navigate('/consent')
    } catch (err) {
      console.error(err)
      setPageError('We could not start your session. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  const onLogin = () => {
    const currentShareId = routeShareId || shareId
    if (currentShareId) navigate(`/share/${currentShareId}/login`)
    else navigate('/login')
  }

  const borderColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)'
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#fafafa'
  const subtitleColor = isDark ? '#999' : '#666'
  const stepLabelColor = isDark ? '#f5f5f5' : '#1a1a1a'
  const stepDescColor = isDark ? '#777' : '#999'
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Poppins, sans-serif' }}>

      {/* Banner hero */}
      <section
        style={{
          width: '100%',
          height: 'clamp(120px, 22vh, 200px)',
          backgroundImage: 'url(/Banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            lineHeight: 1.15,
            padding: '0 4vw',
            fontSize: 'clamp(32px, 7vw, 80px)',
            color: theme === 'light' ? '#303030' : '#ffe070',
          }}
        >
          Codesign Compass
        </h1>
      </section>

      <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', padding: '18px 16px 12px' }}>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 14,
            color: subtitleColor,
            textAlign: 'center',
            lineHeight: 1.5,
            margin: '0 auto 14px',
            maxWidth: 360,
          }}
        >
          Share your lived experience to help shape better policy outcomes for your community.
        </p>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: `1px solid ${dividerColor}`, margin: '0 0 14px' }} />

        {/* Steps */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {STEPS.map(({ num, label, desc }) => (
            <div
              key={num}
              style={{
                flex: '1 1 0',
                padding: '10px 6px',
                borderRadius: 10,
                border: `1px solid ${borderColor}`,
                background: cardBg,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: '#ffe071', textShadow: '1px 1px #eee', letterSpacing: '0.1em', marginBottom: 3 }}>
                {num}
              </div>
              <div style={{ fontWeight: 600, fontSize: 12, color: stepLabelColor, marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ fontSize: 11, color: stepDescColor }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: `1px solid ${dividerColor}`, margin: '28px 0 60px' }} />

        {/* Loading / Error alerts */}
        {loadingIssueContext && (
          <p role="status" aria-live="polite" style={{ textAlign: 'center', color: subtitleColor, fontSize: 13, marginBottom: 12 }}>
            Loading issue details...
          </p>
        )}
        {!loadingIssueContext && pageError && (
          <Alert variant="error" className="mb-3 font-poppins">{pageError}</Alert>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button
            variant="yellow"
            size="lg"
            onClick={onStart}
            disabled={starting || loadingIssueContext}
            aria-busy={starting}
            style={{ width: '100%' }}
          >
            {starting ? 'Starting…' : 'Get Started →'}
          </Button>
          <Button variant="ghost" onClick={onLogin} style={{ width: '100%' }}>
            Login to existing account
          </Button>
        </div>

      </div>
    </div>
  )
}

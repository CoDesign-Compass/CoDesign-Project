import { useNavigate, useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useIssue } from '../../context/IssueContext'

/**
 * WelcomePage (4 sections)
 * 1) Banner image + Title
 * 2) Start button block (navigate)
 * 3) Login block (navigate)
 * 4) Help "?" button (bottom-right)
 */
export default function WelcomePage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { shareId, setIssueId, setShareId, setIssueContent } = useIssue()

  const [open, setOpen] = useState(false)
  const [starting, setStarting] = useState(false)
  const [loadingIssueContext, setLoadingIssueContext] = useState(false)
  const [pageError, setPageError] = useState('')
  const [pageInfo, setPageInfo] = useState('')
  const [loginHover, setLoginHover] = useState(false)

  const [helpForm, setHelpForm] = useState({ email: '', message: '' })
  const [helpSent, setHelpSent] = useState(false)
  const [helpErr, setHelpErr] = useState('')
  const [helpSubmitting, setHelpSubmitting] = useState(false)

  const popRef = useRef(null)
  const helpEmailRef = useRef(null)
  const navigate = useNavigate()

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (open) {
      helpEmailRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!routeShareId) return

    const fetchIssueContext = async () => {
      setLoadingIssueContext(true)
      setPageError('')
      setPageInfo('')

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

        setPageInfo('Issue details loaded successfully.')
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
    setPageInfo('')

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

      if (!submissionId) {
        throw new Error('No submissionId returned from backend.')
      }

      localStorage.setItem('submissionId', String(submissionId))
      localStorage.setItem('issueId', String(data?.issueId ?? issueId))

      const currentShareId = routeShareId || shareId
      if (currentShareId) {
        navigate(`/share/${currentShareId}/profile`)
      } else {
        navigate('/profile')
      }
    } catch (err) {
      console.error(err)
      setPageError('We could not start your session. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  const onLogin = () => {
    const currentShareId = routeShareId || shareId
    if (currentShareId) {
      navigate(`/share/${currentShareId}/login`)
    } else {
      navigate('/login')
    }
  }

  const handleHelpToggle = () => {
    setOpen((prev) => {
      const next = !prev
      if (next) {
        setHelpErr('')
        setHelpSent(false)
      }
      return next
    })
  }

  const handleHelpSubmit = async (e) => {
    e.preventDefault()
    setHelpErr('')

    const validEmail = /^\S+@\S+\.\S+$/.test(helpForm.email)
    if (!validEmail) {
      setHelpErr('Please enter a valid email address.')
      return
    }

    if (helpForm.message.trim().length < 5) {
      setHelpErr('Please provide a little more detail (at least 5 characters).')
      return
    }

    setHelpSubmitting(true)

    try {
      const payload = {
        email: helpForm.email.trim(),
        message: helpForm.message.trim(),
        shareId: localStorage.getItem('shareId') || null,
        issueId: Number(localStorage.getItem('issueId')) || null,
        submissionId: Number(localStorage.getItem('submissionId')) || null,
        pagePath: window.location.pathname,
      }

      const res = await fetch(`${API_BASE}/api/help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`)

      setHelpSent(true)
      setHelpForm({ email: '', message: '' })
    } catch (err) {
      console.error(err)
      setHelpErr('We could not send your message. Please try again.')
    } finally {
      setHelpSubmitting(false)
    }
  }

  return (
    <div
      className="welcome-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: '0 auto',
        paddingInline: 'clamp(12px, 4vw, 24px)',
        boxSizing: 'border-box',
      }}
    >
      <section
        style={{
          margin: 'clamp(18px, 4vw, 40px)',
          display: 'grid',
          placeItems: 'center',
        }}
      ></section>

      {/* 1) banner + Title */}
      <section
        className="banner"
        style={{
          margin: 0,
          width: '100%',
          height: 'clamp(140px, 30vh, 260px)',
          backgroundImage: 'url(/Banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(36px, 8vw, 96px)',
              color: theme === 'light' ? '#303030' : '#ffe070',
              fontFamily: 'Poppins, sans-serif',
              lineHeight: 1.1,
              paddingInline: '4vw',
            }}
          >
            Codesign Compass
          </h1>
        </div>
      </section>

      {(loadingIssueContext || pageError || pageInfo) && (
        <section
          style={{
            marginTop: 'clamp(20px, 4vw, 28px)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {loadingIssueContext && (
            <div
              role="status"
              aria-live="polite"
              style={{
                maxWidth: 560,
                textAlign: 'center',
                fontFamily: 'Poppins, sans-serif',
                color: theme === 'light' ? '#303030' : '#ffe070',
                lineHeight: 1.5,
              }}
            >
              Loading issue details...
            </div>
          )}

          {!loadingIssueContext && pageError && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                width: 'min(560px, 100%)',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.15)',
                background:
                  theme === 'light'
                    ? 'rgba(127,127,188,0.10)'
                    : 'rgba(255,224,112,0.10)',
                color: theme === 'light' ? '#303030' : '#ffe070',
                fontFamily: 'Poppins, sans-serif',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {pageError}
            </div>
          )}

          {!loadingIssueContext && !pageError && pageInfo && (
            <div
              role="status"
              aria-live="polite"
              style={{
                width: 'min(560px, 100%)',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.12)',
                background:
                  theme === 'light'
                    ? 'rgba(127,127,188,0.08)'
                    : 'rgba(255,224,112,0.08)',
                color: theme === 'light' ? '#303030' : '#ffe070',
                fontFamily: 'Poppins, sans-serif',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {pageInfo}
            </div>
          )}
        </section>
      )}

      {/* 2) Start button block */}
      <section
        className="start-button"
        style={{
          marginTop: 'clamp(32px, 8vw, 80px)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <button
          onClick={onStart}
          disabled={starting || loadingIssueContext}
          aria-busy={starting}
          style={{
            fontSize: 'clamp(20px, 3.2vw, 36px)',
            borderRadius: 8,
            padding: 'clamp(8px, 1.2vw, 12px) clamp(18px, 3vw, 28px)',
            border: 'none',
            background: '#7F7FBC',
            color: '#ffffff',
            fontFamily: 'Poppins, sans-serif',
            transition:
              'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
            opacity: starting || loadingIssueContext ? 0.65 : 1,
            cursor: starting || loadingIssueContext ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          }}
        >
          {starting ? 'Starting...' : 'Start'}
        </button>
      </section>

      {/* 3) Login block */}
      <section
        className="login-link"
        style={{
          display: 'grid',
          margin: 'clamp(24px, 6vw, 50px)',
          placeItems: 'center',
        }}
      >
        <div>
          <button
            onClick={onLogin}
            onMouseEnter={() => setLoginHover(true)}
            onMouseLeave={() => setLoginHover(false)}
            style={{
              fontSize: 'clamp(14px, 2.4vw, 20px)',
              cursor: 'pointer',
              border: 'none',
              color: theme === 'light' ? 'black' : 'white',
              background: loginHover
                ? 'rgba(131, 124, 124, 0.48)'
                : 'transparent',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              padding: 'clamp(4px, 1vw, 10px) clamp(16px, 3vw, 25px)',
              textDecorationThickness: '1.5px',
              fontFamily: 'Poppins, sans-serif',
              transition: 'background 0.2s ease',
              borderRadius: 8,
            }}
          >
            LOGIN
          </button>
        </div>
      </section>

      {/* 4) Help / "?" button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: 'clamp(10px, 3vw, 20px) clamp(16px, 4vw, 30px)',
        }}
      >
        <div ref={popRef} style={{ position: 'relative' }}>
          <button
            aria-label="Help"
            title="Help"
            aria-expanded={open}
            aria-controls="help-dialog"
            onClick={handleHelpToggle}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <img
              src="/Information.png"
              alt="Information"
              style={{ height: 'clamp(20px, 5vw, 32px)', display: 'block' }}
            />
          </button>

          {open && (
            <div
              id="help-dialog"
              role="dialog"
              aria-modal="false"
              aria-labelledby="help-dialog-title"
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                right: 0,
                background: '#ffe070',
                padding: '12px',
                width: 'clamp(220px, 60vw, 360px)',
                borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,.18)',
                zIndex: 1000,
              }}
            >
              <h2
                id="help-dialog-title"
                style={{
                  margin: '0 0 8px',
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                  color: '#303030',
                }}
              >
                Need help?
              </h2>

              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#303030',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Send us your question and we’ll get back to you.
              </p>

              {helpSent ? (
                <div
                  style={{
                    lineHeight: 1.55,
                    fontFamily: 'Poppins, sans-serif',
                    color: '#303030',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600 }}>Thanks! 🎉</p>
                  <p style={{ margin: '6px 0 0' }}>
                    We’ve received your message and will get back to you soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleHelpSubmit}
                  style={{ display: 'grid', gap: 8 }}
                >
                  <label
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins, sans-serif',
                      color: '#303030',
                    }}
                  >
                    Email address
                    <input
                      ref={helpEmailRef}
                      type="email"
                      value={helpForm.email}
                      onChange={(e) =>
                        setHelpForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      aria-describedby={helpErr ? 'help-error' : undefined}
                      style={{
                        width: '100%',
                        height: 38,
                        marginTop: 4,
                        borderRadius: 6,
                        border: '1px solid #d8c25b',
                        background: '#fff9c6',
                        padding: '0 10px',
                        outline: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#303030',
                        boxSizing: 'border-box',
                      }}
                    />
                  </label>

                  <label
                    style={{
                      fontSize: 13,
                      fontFamily: 'Poppins, sans-serif',
                      color: '#303030',
                    }}
                  >
                    Your question
                    <textarea
                      rows={3}
                      value={helpForm.message}
                      onChange={(e) =>
                        setHelpForm((f) => ({ ...f, message: e.target.value }))
                      }
                      placeholder="Tell us what's going on…"
                      aria-describedby={helpErr ? 'help-error' : undefined}
                      style={{
                        width: '100%',
                        marginTop: 4,
                        borderRadius: 6,
                        border: '1px solid #d8c25b',
                        background: '#fffef0',
                        padding: '8px 10px',
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#303030',
                        boxSizing: 'border-box',
                      }}
                    />
                  </label>

                  {helpErr && (
                    <div
                      id="help-error"
                      role="alert"
                      style={{
                        color: '#9b1c1c',
                        fontSize: 12,
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: 1.45,
                      }}
                    >
                      {helpErr}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      justifyContent: 'flex-end',
                      marginTop: 2,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      disabled={helpSubmitting}
                      style={{
                        height: 32,
                        padding: '0 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(0,0,0,.15)',
                        background: '#fff',
                        color: '#303030',
                        cursor: helpSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        opacity: helpSubmitting ? 0.7 : 1,
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={helpSubmitting}
                      aria-busy={helpSubmitting}
                      style={{
                        height: 32,
                        padding: '0 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: '#303030',
                        color: '#ffe070',
                        cursor: helpSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 1px 0 rgba(0,0,0,.2)',
                        fontFamily: 'Poppins, sans-serif',
                        opacity: helpSubmitting ? 0.7 : 1,
                      }}
                    >
                      {helpSubmitting ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
  const popRef = useRef(null)
  const navigate = useNavigate()

  const onStart = () => {
    if (routeShareId || shareId) {
      navigate(`/share/${routeShareId || shareId}/profile`)
    } else {
      /** keep for test */
      navigate('/profile')
    }
  }
  const onLogin = () => {
    navigate('/login')
  }

  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    if (!routeShareId) return

    const fetchIssueContext = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/share/${routeShareId}`,
        )

        if (!res.ok) {
          throw new Error('Failed to fetch issue context')
        }

        const data = await res.json()

        setIssueId(data.issueId)
        setShareId(data.shareId)
        setIssueContent(data.issueContent || '')
      } catch (error) {
        console.error('Failed to initialise issue context:', error)
      }
    }

    fetchIssueContext()
  }, [routeShareId, setIssueId, setShareId])

  const [helpForm, setHelpForm] = useState({ email: '', message: '' })
  const [helpSent, setHelpSent] = useState(false)
  const [helpErr, setHelpErr] = useState('')

  const handleHelpSubmit = (e) => {
    e.preventDefault()
    setHelpErr('')
    const validEmail = /^\S+@\S+\.\S+$/.test(helpForm.email)
    if (!validEmail) return setHelpErr('Please enter a valid email.')
    if (helpForm.message.trim().length < 5) {
      return setHelpErr('Tell us a bit more (≥ 5 characters).')
    }

    // TODO: connect backend
    // e.g.: fetch("/api/help", { method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(helpForm) })
    // .then(() => setHelpSent(true))

    setHelpSent(true)
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
          style={{
            fontSize: 'clamp(20px, 3.2vw, 36px)',
            borderRadius: 8,
            padding: 'clamp(6px, 1vw, 10px) clamp(16px, 3vw, 24px)',
            cursor: 'pointer',
            border: 'none',
            background: '#7F7FBC',
            fontFamily: 'Poppins, sans-serif',
            transition: 'opacity 0.2s ease',
            opacity: 0.85,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
        >
          Start
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
            style={{
              fontSize: 'clamp(14px, 2.4vw, 20px)',
              cursor: 'pointer',
              border: 'none',
              color: theme === 'light' ? 'black' : 'white',
              background: 'transparent',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              padding: 'clamp(4px, 1vw, 10px) clamp(16px, 3vw, 25px)',
              textDecorationThickness: '1.5px',
              fontFamily: 'Poppins, sans-serif',
              transition: 'background 0.2s ease',
              borderRadius: 8,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(131, 124, 124, 0.48)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
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
            onClick={() => setOpen((v) => !v)}
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
              role="tooltip"
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: 'calc(100% - 130px)',
                background: '#ffe070',
                padding: '12px 12px',
                transform: 'translateX(-50%)',
                width: 'clamp(150px, 60vw, 360px)',
                borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,.18)',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  lineHeight: 1.55,
                  fontFamily: 'Poppins, sans-serif',
                  color: '#303030',
                }}
              />
              {helpSent ? (
                <div style={{ lineHeight: 1.55 }}>
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
                  <label style={{ fontSize: 13 }}>
                    Email address
                    <input
                      type="email"
                      value={helpForm.email}
                      onChange={(e) =>
                        setHelpForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        height: 38,
                        marginTop: 4,
                        borderRadius: 6,
                        border: '1px solid #d8c25b',
                        background: '#fff9c6',
                        padding: '0 10px',
                        outline: 'none',
                      }}
                    />
                  </label>

                  <label style={{ fontSize: 13 }}>
                    Your question
                    <textarea
                      rows={3}
                      value={helpForm.message}
                      onChange={(e) =>
                        setHelpForm((f) => ({ ...f, message: e.target.value }))
                      }
                      placeholder="Tell us what's going on…"
                      style={{
                        width: '100%',
                        marginTop: 4,
                        borderRadius: 6,
                        border: '1px solid #d8c25b',
                        background: '#fffef0',
                        padding: '8px 10px',
                        resize: 'vertical',
                        outline: 'none',
                      }}
                    />
                  </label>

                  {helpErr && (
                    <div style={{ color: '#9b1c1c', fontSize: 12 }}>
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
                      style={{
                        height: 32,
                        padding: '0 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(0,0,0,.15)',
                        background: '#fff',
                        color: '#303030',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        height: 32,
                        padding: '0 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: '#303030',
                        color: '#ffe070',
                        cursor: 'pointer',
                        boxShadow: '0 1px 0 rgba(0,0,0,.2)',
                      }}
                    >
                      Send
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

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'

export default function LoginPage({ onSubmit: onSubmitProp }) {
  const { shareId: routeShareId } = useParams()
  const { shareId, setShareId } = useIssue()
  const currentShareId = routeShareId || shareId

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  // DEV admin shortcut (from .env)
  const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || ''
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || ''

  // ---- FORM ----
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [showPw, setShowPw] = useState(false)

  // ---- Login feedback ----
  const [loginErr, setLoginErr] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  // ---- Help bubble ----
  const [open, setOpen] = useState(false)
  const [helpForm, setHelpForm] = useState({ email: '', message: '' })
  const [helpSent, setHelpSent] = useState(false)
  const [helpErr, setHelpErr] = useState('')
  const [helpSubmitting, setHelpSubmitting] = useState(false)

  const popRef = useRef(null)
  const helpEmailRef = useRef(null)
  const navigate = useNavigate()

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
    if (routeShareId) setShareId(routeShareId)
  }, [routeShareId, setShareId])

  const change = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginErr('')

    try {
      setLoginSubmitting(true)

      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        throw new Error(data?.message || text || `HTTP ${res.status}`)
      }

      localStorage.setItem('userId', String(data.userId || data.id || ''))
      localStorage.setItem('userRole', data.role || 'USER')

      const role = (data.role || '').toUpperCase()
      if (role === 'ADMIN') {
        navigate('/admin/dashboard')
        return
      }

      if (currentShareId) navigate(`/share/${currentShareId}/profile`)
      else navigate('/profile')
    } catch (err) {
      console.error(err)
      setLoginErr('Login failed: ' + err.message)
    } finally {
      setLoginSubmitting(false)
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
        shareId: currentShareId || localStorage.getItem('shareId') || null,
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

  const container = { width: 'min(960px, 92vw)', margin: '0 auto' }

  return (
    <div
      className="Login page"
      style={{
        background: 'var(--bg-color)',
        color: 'var(--text-color)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <div
        style={{ background: 'var(--bg-color)', color: 'var(--text-color)' }}
      >
        <section
          style={{
            width: '100vw',
            marginLeft: 'calc(50% - 50vw)',
            marginRight: 'calc(50% - 50vw)',
            height: 120,
            backgroundImage: 'url(/Banner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ position: 'absolute', inset: 0 }} />
          <h1
            className="hero-title"
            style={{
              margin: 0,
              fontSize: 44,
              color: 'var(--heading)',
              letterSpacing: 1,
              textShadow: '0 1px 2px rgba(0.3,0.5,0.7,.5)',
            }}
          >
            Login
          </h1>
        </section>

        <main
          style={{
            width: '100%',
            display: 'grid',
            placeItems: 'center',
            padding: '64px 12px 56px',
          }}
        >
          <style>{`
            .sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,1px,1px);white-space:nowrap;border:0;}
            .input{width:100%;height:44px;border-radius:8px;border:1px solid #d8d8d8;background:#fff;color:#111;padding:0 44px 0 12px;font-size:16px;outline:none;box-sizing:border-box;}
            .input:focus{border-color:#7aa2ff;}
          `}</style>

          <form
            className="form-wrap"
            onSubmit={handleSubmit}
            noValidate
            style={{
              width: 'min(560px, 92vw)',
              display: 'grid',
              gap: 16,
              margin: '0 auto',
            }}
          >
            <Field
              id="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={change('email')}
              onClear={() => setForm((f) => ({ ...f, email: '' }))}
            />

            <div style={{ display: 'grid', gap: 6 }}>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className="input"
                  value={form.password}
                  onChange={change('password')}
                  placeholder="Password"
                  autoComplete="current-password"
                  aria-invalid={loginErr ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#7a7a7a',
                    cursor: 'pointer',
                    fontSize: 15,
                  }}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
                {!!form.password && (
                  <button
                    type="button"
                    aria-label="Clear"
                    onClick={() => setForm((f) => ({ ...f, password: '' }))}
                    style={suffixBtn(56)}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 4,
                fontSize: 14,
                color: 'var(--text-color)',
                opacity: 0.9,
              }}
            >
              <input
                type="checkbox"
                checked={form.remember}
                onChange={change('remember')}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: '#ffe070',
                  cursor: 'pointer',
                }}
              />
              <span>Remember me</span>
            </label>

            {loginErr && (
              <div
                role="alert"
                aria-live="assertive"
                style={{
                  color: '#9b1c1c',
                  fontSize: 14,
                  lineHeight: 1.45,
                  textAlign: 'center',
                  fontFamily: 'inherit',
                }}
              >
                {loginErr}
              </div>
            )}

            <div
              style={{ display: 'grid', justifyItems: 'center', marginTop: 10 }}
            >
              <button
                className="cta-btn"
                type="submit"
                disabled={loginSubmitting}
                aria-busy={loginSubmitting}
                style={{
                  minWidth: 240,
                  padding: '12px 24px',
                  borderRadius: 14,
                  background: '#2f2f2f',
                  border: '3px solid #ffe070',
                  color: '#fff',
                  cursor: loginSubmitting ? 'not-allowed' : 'pointer',
                  opacity: loginSubmitting ? 0.7 : 1,
                  boxShadow:
                    '0 2px 0 rgba(0,0,0,.25), inset 0 0 0 1px rgba(0,0,0,.08)',
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    lineHeight: 1.1,
                    fontWeight: 500,
                    textDecorationColor: '#fff',
                    textDecorationThickness: '1.5px',
                    textUnderlineOffset: '4px',
                  }}
                >
                  {loginSubmitting ? 'Logging in...' : 'Login'}
                </span>
              </button>
            </div>

            <div
              style={{ display: 'grid', justifyItems: 'center', marginTop: 10 }}
            >
              <button
                className="cta-btn"
                type="button"
                onClick={() => {
                  if (currentShareId)
                    navigate(`/share/${currentShareId}/createaccount`)
                  else navigate('/createaccount')
                }}
                style={{
                  minWidth: 240,
                  padding: '12px 24px',
                  borderRadius: 14,
                  background: '#2f2f2f',
                  border: '3px solid #ffe070',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow:
                    '0 2px 0 rgba(0,0,0,.25), inset 0 0 0 1px rgba(0,0,0,.08)',
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    lineHeight: 1.1,
                    fontWeight: 500,
                    textDecorationColor: '#fff',
                    textDecorationThickness: '1.5px',
                    textUnderlineOffset: '4px',
                  }}
                >
                  Sign Up
                </span>
              </button>
            </div>
          </form>
        </main>

        {/* Help bubble */}
        <div
          style={{
            ...container,
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0 0 16px',
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
                style={{ height: 30, display: 'block' }}
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
                  width: 'min(320px, 86vw)',
                  background: '#ffe070',
                  color: '#303030',
                  padding: '12px',
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
                          setHelpForm((f) => ({
                            ...f,
                            message: e.target.value,
                          }))
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
    </div>
  )
}

/* small field helper */
function Field({ id, type = 'text', placeholder, value, onChange, onClear }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <label className="sr-only" htmlFor={id}>
        {placeholder}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={type}
          className="input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={id}
        />
        {!!value && (
          <button
            type="button"
            aria-label="Clear"
            onClick={onClear}
            style={suffixBtn(12)}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

function suffixBtn(rightPx) {
  return {
    position: 'absolute',
    right: rightPx,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 28,
    height: 28,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 18,
    color: 'grey',
    lineHeight: 1,
  }
}

import React, { useEffect, useRef, useState } from 'react'

export default function CreateAccountPage({
  mode = 'create',
  onSubmit: onSubmitProp,
}) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
    subscribe: false,
  })
  const [showPw, setShowPw] = useState(false)

  const [submitErr, setSubmitErr] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ---- AI help bubble ----
  const [open, setOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I’m your AI assistant. I can help you create an account or explain the feedback flow.',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatErr, setChatErr] = useState('')
  const [chatSubmitting, setChatSubmitting] = useState(false)

  const popRef = useRef(null)
  const chatInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

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
      chatInputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatSubmitting])

  const change = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  async function signUp(payload) {
    const res = await fetch(`${API_BASE}/api/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const text = await res.text()
    if (!res.ok) {
      let msg = text
      try {
        const j = JSON.parse(text)
        msg = j.message || j.error || text
      } catch {}
      if (String(msg).toLowerCase().includes('email already exists')) {
        throw new Error(
          'This email is already registered. Try logging in, or use another email.',
        )
      }
      throw new Error(msg || `HTTP ${res.status}`)
    }
    return text ? JSON.parse(text) : {}
  }

  async function linkAccount(submissionId, userId) {
    const res = await fetch(
      `${API_BASE}/api/submissions/${submissionId}/link-account`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      },
    )
    const text = await res.text()
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
    return text ? JSON.parse(text) : {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitErr('')
    setSubmitSuccess('')

    if (mode === 'create' && form.password !== form.confirm) {
      setSubmitErr('Passwords do not match.')
      return
    }

    if (form.password.length < 4) {
      setSubmitErr('Password must be at least 4 characters.')
      return
    }

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      wantsUpdates: form.subscribe,
    }

    const submissionId = localStorage.getItem('submissionId')
    if (!submissionId) {
      setSubmitErr(
        'No submissionId found. Please start from the feedback flow.',
      )
      return
    }

    try {
      setSubmitting(true)

      const user = await signUp(payload)
      console.log('signup ok:', user)

      const userId = user.id || user.userId
      if (!userId) {
        throw new Error('Signup succeeded but no userId returned from backend.')
      }

      if (submissionId) {
        const linked = await linkAccount(submissionId, userId)
        console.log('link ok:', linked)
        setSubmitSuccess('Account created and submission linked!')
      } else {
        setSubmitSuccess('Account created! (No submission to link)')
      }
    } catch (err) {
      console.error(err)
      setSubmitErr('Sign up failed: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleHelpToggle = () => {
    setOpen((prev) => {
      const next = !prev
      if (next) {
        setChatErr('')
      }
      return next
    })
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    setChatErr('')

    const message = chatInput.trim()
    if (!message) return

    const newUserMessage = { role: 'user', content: message }
    setChatMessages((prev) => [...prev, newUserMessage])
    setChatInput('')
    setChatSubmitting(true)

    try {
      const payload = {
        message,
        shareId: localStorage.getItem('shareId') || null,
        issueId: Number(localStorage.getItem('issueId')) || null,
        submissionId: Number(localStorage.getItem('submissionId')) || null,
        pagePath: window.location.pathname,
      }

      const res = await fetch(`${API_BASE}/api/ai-support/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`)

      const data = text ? JSON.parse(text) : {}
      const reply =
        data.reply || 'Sorry, I could not generate a response just now.'

      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply },
      ])
    } catch (err) {
      console.error(err)
      setChatErr('The AI assistant is unavailable right now. Please try again.')
    } finally {
      setChatSubmitting(false)
    }
  }

  const container = { width: 'min(960px, 92vw)', margin: '0 auto' }

  return (
    <div
      className="CreateAccount page"
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
            Create Account
          </h1>
        </section>

        <main
          style={{
            width: '100%',
            display: 'grid',
            placeItems: 'center',
            padding: '32px 12px 40px',
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
            {mode === 'create' && (
              <Field
                id="username"
                placeholder="Username"
                value={form.username}
                onChange={change('username')}
                onClear={() => setForm((f) => ({ ...f, username: '' }))}
              />
            )}

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
                  autoComplete={
                    mode === 'create' ? 'new-password' : 'current-password'
                  }
                  aria-invalid={submitErr ? 'true' : 'false'}
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

            {mode === 'create' && (
              <Field
                id="confirm"
                type="password"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={change('confirm')}
                onClear={() => setForm((f) => ({ ...f, confirm: '' }))}
              />
            )}

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
                checked={form.subscribe}
                onChange={change('subscribe')}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: '#ffe070',
                  cursor: 'pointer',
                }}
              />
              <span>Keep me updated with the latest information</span>
            </label>

            {(submitErr || submitSuccess) && (
              <div
                role={submitErr ? 'alert' : 'status'}
                aria-live={submitErr ? 'assertive' : 'polite'}
                style={{
                  color: submitErr ? '#9b1c1c' : 'var(--text-color)',
                  fontSize: 14,
                  lineHeight: 1.45,
                  textAlign: 'center',
                  fontFamily: 'inherit',
                }}
              >
                {submitErr || submitSuccess}
              </div>
            )}

            <div
              style={{ display: 'grid', justifyItems: 'center', marginTop: 10 }}
            >
              <button
                className="cta-btn"
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                style={{
                  minWidth: 240,
                  padding: '12px 24px',
                  borderRadius: 14,
                  background: '#2f2f2f',
                  border: '3px solid #ffe070',
                  color: '#fff',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
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
                  {submitting ? 'Signing up...' : 'Sign Up'}
                </span>
              </button>
            </div>
          </form>
        </main>

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
                  width: 'min(360px, 88vw)',
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
                  AI Assistant
                </h2>

                <div
                  style={{
                    maxHeight: 240,
                    overflowY: 'auto',
                    display: 'grid',
                    gap: 8,
                    marginBottom: 10,
                    paddingRight: 4,
                  }}
                >
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        justifySelf: msg.role === 'user' ? 'end' : 'start',
                        background: msg.role === 'user' ? '#303030' : '#fff8cc',
                        color: msg.role === 'user' ? '#ffe070' : '#303030',
                        padding: '10px 12px',
                        borderRadius: 10,
                        fontSize: 13,
                        lineHeight: 1.5,
                        fontFamily: 'Poppins, sans-serif',
                        maxWidth: '90%',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.content}
                    </div>
                  ))}

                  {chatSubmitting && (
                    <div
                      style={{
                        justifySelf: 'start',
                        background: '#fff8cc',
                        color: '#303030',
                        padding: '10px 12px',
                        borderRadius: 10,
                        fontSize: 13,
                        lineHeight: 1.5,
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Thinking...
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleChatSubmit}
                  style={{ display: 'grid', gap: 8 }}
                >
                  <textarea
                    ref={chatInputRef}
                    rows={3}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask the AI assistant..."
                    style={{
                      width: '100%',
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

                  {chatErr && (
                    <div
                      role="alert"
                      style={{
                        color: '#9b1c1c',
                        fontSize: 12,
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: 1.45,
                      }}
                    >
                      {chatErr}
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      disabled={chatSubmitting}
                      style={{
                        height: 32,
                        padding: '0 10px',
                        borderRadius: 6,
                        border: '1px solid rgba(0,0,0,.15)',
                        background: '#fff',
                        color: '#303030',
                        cursor: chatSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        opacity: chatSubmitting ? 0.7 : 1,
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={chatSubmitting || !chatInput.trim()}
                      style={{
                        height: 32,
                        padding: '0 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: '#303030',
                        color: '#ffe070',
                        cursor:
                          chatSubmitting || !chatInput.trim()
                            ? 'not-allowed'
                            : 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        opacity:
                          chatSubmitting || !chatInput.trim() ? 0.7 : 1,
                      }}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

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
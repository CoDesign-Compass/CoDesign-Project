import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'

export default function LoginPage({ onSubmit: onSubmitProp }) {
  const { shareId: routeShareId } = useParams()
  const { setShareId } = useIssue()
  const { shareId } = useIssue()
const currentShareId = routeShareId || shareId

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"
  // ---- FORM ----
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [showPw, setShowPw] = useState(false)

  // ---- Help bubble outside-click ----
  const [open, setOpen] = useState(false)
  const popRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    if (routeShareId) {
      setShareId(routeShareId)
    }
  }, [routeShareId, setShareId])

  const change = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmitProp?.(form)
  }

  // help form
  const [helpForm, setHelpForm] = useState({ email: '', message: '' })
  const [helpSent, setHelpSent] = useState(false)
  const [helpErr, setHelpErr] = useState('')

  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    setHelpErr("");
    const validEmail = /^\S+@\S+\.\S+$/.test(helpForm.email);
    if (!validEmail) return setHelpErr("Please enter a valid email.");
    if (helpForm.message.trim().length < 5) {
      return setHelpErr("Tell us a bit more (≥ 5 characters).");
    }

    try {
      const payload = {
        email: helpForm.email.trim(),
        message: helpForm.message.trim(),
        shareId: currentShareId || localStorage.getItem("shareId") || null,
        issueId: Number(localStorage.getItem("issueId")) || null,
        submissionId: Number(localStorage.getItem("submissionId")) || null,
        pagePath: window.location.pathname,
      };

      const res = await fetch(`${API_BASE}/api/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

      setHelpSent(true);
      } catch (err) {
      console.error(err);
      setHelpErr("Send failed: " + err.message);
    }
  };

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
            .input{width:100%;height:44px;border-radius:8px;border:1px solid #d8d8d8;background:#fff;color:#111;padding:0 44px 0 12px;font-size:16px;outline:none;}
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

            {/* Password */}
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

            <div
              style={{ display: 'grid', justifyItems: 'center', marginTop: 10 }}
            >
              <button
                className="cta-btn"
                type="submit"
                onClick={() => navigate('/why')}
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
                  Login
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
                  if (currentShareId) {
                    navigate(`/share/${currentShareId}/createaccount`)
                  } else {
                    navigate('/createaccount')
                  }
                }}
                style={{
                  minWidth: 240,
                  padding: '12px 24px',
                  borderRadius: 14,
                  background: '#2f2f2f',
                  border: '3px solid #ffe070',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 0 rgba(0,0,0,.25), inset 0 0 0 1px rgba(0,0,0,.08)',
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
                style={{ height: 30, display: 'block' }}
              />
            </button>
            {open && (
              <div
                role="tooltip"
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  right: 0,
                  width: 'min(320px, 86vw)',
                  background: '#ffe070',
                  color: '#303030',
                  padding: '12px 14px',
                  borderRadius: 8,
                  boxShadow: '0 8px 24px rgba(0,0,0,.18)',
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    right: 14,
                    width: 12,
                    height: 12,
                    background: '#fff',
                    transform: 'rotate(45deg)',
                    boxShadow: '-1px 1px 2px rgba(0,0,0,.05)',
                  }}
                />
                {helpSent ? (
                  <div style={{ lineHeight: 1.55 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>Thanks! 🎉</p>
                    <p style={{ margin: '6px 0 0' }}>
                      We’ve received your message and will get back to you soon.
                    </p>
                    {/* Admin Login (optional also show after sent) */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false)
                          navigate('/admin/dashboard')
                        }}
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
                        Admin Login
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleHelpSubmit} style={{ display: "grid", gap: 8 }}>
                    <label style={{ fontSize: 13 }}>
                      Email address
                      <input
                        type="email"
                        value={helpForm.email}
                        onChange={(e) => setHelpForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        style={{
                          width: "100%",
                          height: 38,
                          marginTop: 4,
                          borderRadius: 6,
                          border: "1px solid #d8c25b",
                          background: "#fff9c6",
                          padding: "0 10px",
                          outline: "none",
                        }}
                      />
                    </label>

                    <label style={{ fontSize: 13 }}>
                      Your question
                      <textarea
                        rows={3}
                        value={helpForm.message}
                        onChange={(e) => setHelpForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us what's going on…"
                        style={{
                          width: "100%",
                          marginTop: 4,
                          borderRadius: 6,
                          border: "1px solid #d8c25b",
                          background: "#fffef0",
                          padding: "8px 10px",
                          resize: "vertical",
                          outline: "none",
                        }}
                      />
                    </label>

                    {helpErr && <div style={{ color: "#9b1c1c", fontSize: 12 }}>{helpErr}</div>}

                    {/* Admin Login button row */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false)
                          navigate('/admin/dashboard')
                        }}
                        style={{
                          height: 32,
                          padding: '0 12px',
                          borderRadius: 6,
                          border: '1px solid rgba(0,0,0,.15)',
                          background: '#fff',
                          color: '#303030',
                          cursor: 'pointer',
                        }}
                      >
                        Admin Login
                      </button>
                    </div>

                    {/* Cancel / Send row */}        
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        style={{
                          height: 32,
                          padding: "0 10px",
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,.15)",
                          background: "#fff",
                          color: "#303030",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          height: 32,
                          padding: "0 12px",
                          borderRadius: 6,
                          border: "none",
                          background: "#303030",
                          color: "#ffe070",
                          cursor: "pointer",
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

/*clear all button(×) */
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

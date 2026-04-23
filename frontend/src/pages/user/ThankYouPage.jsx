import { useNavigate, useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useIssue } from '../../context/IssueContext'

export default function ThankPage() {
  const { shareId: routeShareId } = useParams()
  const { shareId, setShareId } = useIssue()
  const currentShareId = routeShareId || shareId
  const { theme } = useTheme()

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [wantVoucher, setWantVoucher] = useState(false)
  const [wantUpdates, setWantUpdates] = useState(false)

  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ---- AI help bubble ----
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I’m your AI assistant. I can help with the thank-you page, voucher options, account creation, and the feedback flow.',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatErr, setChatErr] = useState('')
  const [chatSubmitting, setChatSubmitting] = useState(false)

  const popRef = useRef(null)
  const chatInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  async function saveThanksInfo(id, payload) {
    const res = await fetch(`${API_BASE}/api/submissions/${id}/thanks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`)
    return text ? JSON.parse(text) : {}
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')

    const trimmed = email.trim()

    if (!trimmed.length) {
      setSubmitError('Please enter your email address.')
      return
    }

    const validEmail = /^\S+@\S+\.\S+$/.test(trimmed)
    if (!validEmail) {
      setSubmitError('Please enter a valid email address.')
      return
    }

    const submissionId = localStorage.getItem('submissionId')

    if (!submissionId) {
      setSubmitError('No submissionId found.')
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        email: trimmed,
        wantsVoucher: wantVoucher,
        wantsUpdates: wantUpdates,
      }

      const resp = await saveThanksInfo(submissionId, payload)
      console.log('thanks info saved:', resp)
      setSubmitSuccess('Your preferences have been saved.')
    } catch (err) {
      console.error(err)
      setSubmitError('Save failed: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onLogin = (e) => {
    e.preventDefault()
    if (currentShareId) {
      navigate(`/share/${currentShareId}/createaccount`)
    } else {
      navigate('/createaccount')
    }
  }

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

  useEffect(() => {
    if (routeShareId) setShareId(routeShareId)
  }, [routeShareId, setShareId])

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
        shareId: currentShareId || localStorage.getItem('shareId') || null,
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

  const mainTextColor = theme === 'light' ? '#303030' : 'white'
  const subTextColor = theme === 'light' ? '#444444' : 'rgba(255,255,255,0.88)'
  const mutedTextColor =
    theme === 'light' ? '#6a6a6a' : 'rgba(255,255,255,0.70)'
  const inputBg = theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.08)'
  const inputBorder = theme === 'light' ? '#cfcfcf' : 'rgba(255,255,255,0.22)'
  const inputText = theme === 'light' ? '#303030' : '#ffffff'
  const successBg = theme === 'light' ? '#f4fff1' : 'rgba(180,255,180,0.10)'
  const successBorder =
    theme === 'light' ? '#b9dfb4' : 'rgba(180,255,180,0.24)'
  const successText = theme === 'light' ? '#255b2a' : '#d8ffd4'
  const errorBg = theme === 'light' ? '#fff4f4' : 'rgba(255,180,180,0.10)'
  const errorBorder =
    theme === 'light' ? '#efc7c7' : 'rgba(255,180,180,0.24)'
  const errorText = theme === 'light' ? '#9b1c1c' : '#ffd4d4'

  return (
    <div
      className="thankyou-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: '0 auto',
        paddingInline: 'clamp(12px, 4vw, 24px)',
        paddingBottom: 'clamp(20px, 4vw, 36px)',
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
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              theme === 'light'
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.14)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            paddingInline: '4vw',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(30px, 8vw, 96px)',
              color: theme === 'light' ? '#303030' : '#ffe070',
              fontFamily: 'Poppins, sans-serif',
              lineHeight: 1.1,
            }}
          >
            Thanks
          </h1>
          <h2
            style={{
              marginTop: 4,
              marginBottom: 0,
              fontSize: 'clamp(24px, 3.2vw, 40px)',
              color: theme === 'light' ? '#303030' : '#ffe070',
              fontFamily: 'Poppins, sans-serif',
              lineHeight: 1.25,
            }}
          >
            for sharing your experience
          </h2>
        </div>
      </section>

      <section
        style={{
          margin: '36px auto 0',
          textAlign: 'center',
          width: '100%',
          maxWidth: '760px',
        }}
      >
        <div className="GiftInformation">
          <p
            style={{
              margin: 0,
              color: '#ffe070',
              textAlign: 'center',
              fontSize: 'clamp(15px, 2.4vw, 20px)',
              lineHeight: 1.45,
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Give us your email for $10 shopping voucher or more
          </p>

          <p
            style={{
              margin: '10px 0 0',
              color: subTextColor,
              textAlign: 'center',
              fontSize: 'clamp(12px, 1.9vw, 15px)',
              lineHeight: 1.5,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Choose whether you would like a voucher, updates, or both.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: 'clamp(16px, 4vw, 24px) 0 0',
          }}
        >
          <form
            onSubmit={onSubmit}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 12,
              flexWrap: 'wrap',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: '1 1 clamp(220px, 70vw, 420px)',
                minWidth: 0,
                textAlign: 'left',
              }}
            >
              <label
                htmlFor="thank-email"
                style={{
                  display: 'block',
                  marginBottom: 6,
                  fontSize: 'clamp(12px, 1.8vw, 14px)',
                  color: mainTextColor,
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Email address
              </label>

              <input
                id="thank-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: 'clamp(40px, 3.4vw, 46px)',
                  borderRadius: 8,
                  border: `1px solid ${submitError ? '#d99a9a' : inputBorder}`,
                  background: inputBg,
                  color: inputText,
                  fontSize: 'clamp(12px, 2vw, 18px)',
                  outline: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  padding: '0 38px 0 12px',
                  boxSizing: 'border-box',
                }}
                required
              />

              {email && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  aria-label="Clear"
                  style={{
                    position: 'absolute',
                    right: 8,
                    bottom: '11px',
                    width: 24,
                    height: 24,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: mutedTextColor,
                    lineHeight: 1,
                    zIndex: 1,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: '0 0 auto',
                height: 'clamp(40px, 3.4vw, 46px)',
                fontSize: 'clamp(12px, 1.5vw, 16px)',
                borderRadius: 8,
                padding: '0 clamp(14px, 2vw, 18px)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                border: '1.5px solid #ffe070',
                color: theme === 'light' ? '#303030' : 'white',
                background: '#7F7FBC',
                whiteSpace: 'nowrap',
                fontFamily: 'Poppins, sans-serif',
                opacity: isSubmitting ? 0.7 : 0.85,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.currentTarget.style.opacity = 1
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.currentTarget.style.opacity = 0.85
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        {(submitError || submitSuccess) && (
          <div
            aria-live="polite"
            style={{
              marginTop: 14,
              padding: '10px 12px',
              borderRadius: 8,
              border: submitError
                ? `1px solid ${errorBorder}`
                : `1px solid ${successBorder}`,
              background: submitError ? errorBg : successBg,
              color: submitError ? errorText : successText,
              textAlign: 'left',
              fontSize: 'clamp(12px, 1.8vw, 14px)',
              lineHeight: 1.45,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {submitError || submitSuccess}
          </div>
        )}

        <div
          className="checkBox"
          style={{
            marginTop: 'clamp(18px, 3vw, 28px)',
            display: 'grid',
            gap: 12,
            textAlign: 'left',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 12,
            }}
          >
            <input
              type="checkbox"
              checked={wantVoucher}
              onChange={(e) => setWantVoucher(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: '#ffe070',
                cursor: 'pointer',
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <span
              style={{
                fontSize: 'clamp(12px, 2vw, 16px)',
                fontWeight: 600,
                color: mainTextColor,
                fontFamily: 'Poppins, sans-serif',
                lineHeight: 1.45,
              }}
            >
              Send me a $10 shopping voucher
            </span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 12,
              flex: 1,
            }}
          >
            <input
              type="checkbox"
              checked={wantUpdates}
              onChange={(e) => setWantUpdates(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: '#ffe070',
                cursor: 'pointer',
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <span
              style={{
                fontSize: 'clamp(12px, 2vw, 16px)',
                fontWeight: 600,
                color: mainTextColor,
                fontFamily: 'Poppins, sans-serif',
                lineHeight: 1.45,
                flex: 1,
              }}
            >
              Keep me updated with the latest information
            </span>
          </label>
        </div>
      </section>

      <section
        className="join-button"
        style={{
          margin: 'clamp(22px, 3vw, 32px)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <button
          onClick={onLogin}
          style={{
            fontSize: 'clamp(18px, 3.2vw, 30px)',
            borderRadius: 8,
            padding: '8px 22px',
            cursor: 'pointer',
            border: '2px solid #ffe070',
            color: theme === 'light' ? '#303030' : 'white',
            background: '#7F7FBC',
            textDecorationThickness: '1.5px',
            fontFamily: 'Poppins, sans-serif',
            opacity: 0.85,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.85)}
        >
          Join Us
        </button>
      </section>

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
  )
}
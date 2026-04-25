import { useState, useRef, useEffect } from 'react'

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

export default function AiChatBubble({ initialMessage, direction = 'up' }) {
  const [open, setOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: initialMessage },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatErr, setChatErr] = useState('')
  const [chatSubmitting, setChatSubmitting] = useState(false)

  const popRef = useRef(null)
  const chatInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (open) chatInputRef.current?.focus()
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatSubmitting])

  const handleToggle = () => {
    setOpen((prev) => {
      if (!prev) setChatErr('')
      return !prev
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setChatErr('')
    const message = chatInput.trim()
    if (!message) return

    setChatMessages((prev) => [...prev, { role: 'user', content: message }])
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
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Sorry, I could not generate a response just now.' },
      ])
    } catch (err) {
      console.error(err)
      setChatErr('The AI assistant is unavailable right now. Please try again.')
    } finally {
      setChatSubmitting(false)
    }
  }

  return (
    <div ref={popRef} className="relative">
      <button
        aria-label="Help"
        title="Help"
        aria-expanded={open}
        aria-controls="help-dialog"
        onClick={handleToggle}
        className="border-none bg-transparent p-0 cursor-pointer"
      >
        <img
          src="/Information.png"
          alt="Information"
          className="block"
          style={{ height: 'clamp(20px, 5vw, 32px)' }}
        />
      </button>

      {open && (
        <div
          id="help-dialog"
          role="dialog"
          aria-modal="false"
          aria-labelledby="help-dialog-title"
          className="absolute w-[min(360px,88vw)] bg-compass-yellow text-[#303030] p-3 rounded-lg shadow-2xl z-[1000]"
          style={direction === 'down'
            ? { top: 'calc(100% + 8px)', right: 0 }
            : { bottom: 'calc(100% + 8px)', right: 0 }
          }
        >
          <h2
            id="help-dialog-title"
            className="m-0 mb-2 text-base font-semibold font-poppins text-[#303030]"
          >
            AI Assistant
          </h2>

          <div className="max-h-60 overflow-y-auto grid gap-2 mb-2.5 pr-1">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-[10px] px-3 py-2.5 text-[13px] leading-relaxed font-poppins max-w-[90%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'justify-self-end bg-[#303030] text-compass-yellow'
                    : 'justify-self-start bg-[#fff8cc] text-[#303030]'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {chatSubmitting && (
              <div className="justify-self-start bg-[#fff8cc] text-[#303030] rounded-[10px] px-3 py-2.5 text-[13px] leading-relaxed font-poppins">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="grid gap-2">
            <textarea
              ref={chatInputRef}
              rows={3}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask the AI assistant..."
              className="w-full rounded-md border border-[#d8c25b] bg-[#fffef0] px-2.5 py-2 resize-y outline-none font-poppins text-[#303030] box-border text-sm"
            />
            {chatErr && (
              <p role="alert" className="text-red-800 text-xs font-poppins leading-snug m-0">
                {chatErr}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={chatSubmitting}
                className="h-8 px-2.5 rounded-md border border-black/15 bg-white text-[#303030] cursor-pointer font-poppins text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={chatSubmitting || !chatInput.trim()}
                className="h-8 px-3 rounded-md border-none bg-[#303030] text-compass-yellow cursor-pointer font-poppins text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useIssue } from '../../context/IssueContext'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Checkbox } from '../../components/ui/checkbox'
import { Alert } from '../../components/ui/alert'


export default function ThankPage() {
  const { shareId: routeShareId } = useParams()
  const { shareId, setShareId } = useIssue()
  const currentShareId = routeShareId || shareId
  const { theme } = useTheme()

  const [email, setEmail] = useState('')
  const [wantVoucher, setWantVoucher] = useState(false)
  const [wantUpdates, setWantUpdates] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  useEffect(() => {
    if (routeShareId) setShareId(routeShareId)
  }, [routeShareId, setShareId])

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

  const isValidEmail = (value) => {
    const trimmed = value.trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
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

    if (!isValidEmail(trimmed)) {
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
      await saveThanksInfo(submissionId, {
        email: trimmed,
        wantsVoucher: wantVoucher,
        wantsUpdates: wantUpdates,
      })
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
    if (currentShareId) navigate(`/share/${currentShareId}/createaccount`)
    else navigate('/createaccount')
  }

  const isDark = theme === 'dark'

  const pageBg = isDark ? '#1e1e1e' : '#f5f5f5'
  const cardBg = isDark ? '#272727' : '#ffffff'
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const cardShadow = isDark ? '0 1px 6px rgba(0,0,0,0.35)' : '0 1px 6px rgba(0,0,0,0.07)'
  const textColor = isDark ? '#f0f0f0' : '#1a1a1a'
  const subText = isDark ? '#b5b5b5' : '#666'
  const dividerColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)'
  const inputBg = isDark ? '#1f1f1f' : '#ffffff'
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : '#d9d9d9'
  const optionBg = isDark ? '#1f1f1f' : '#fcfcfc'
  const optionBorder = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.06)'

  return (
    <div
      className="flex flex-col font-poppins"
      style={{
        minHeight: '100vh',
        background: pageBg,
        color: textColor,
      }}
    >
      <section className="grid place-items-center" />

      <section
        className="w-full grid place-items-center text-center"
        style={{
          height: 'clamp(120px, 22vh, 200px)',
          backgroundImage: 'url(/Banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontWeight: 400,
            lineHeight: 1.15,
            padding: '0 4vw',
            fontSize: 'clamp(32px, 7vw, 80px)',
            color: isDark ? '#ffe070' : '#303030',
          }}
        >
          Thank You
        </h1>
      </section>

      <main
        style={{
          width: '100%',
          maxWidth: 560,
          margin: '0 auto',
          padding: '24px 16px 40px',
        }}
      >
        <p
          className="m-0 text-compass-yellow text-center font-bold font-poppins leading-snug"
          style={{ fontSize: 'clamp(15px,2.4vw,20px)', textShadow: 'rgba(0, 0, 0, 0.13) 1px 1px 1px' }}
        >
          Thank you for sharing your lived experience. You can leave your email
          below for updates, a voucher, or both.
        </p>

        <hr
          style={{
            border: 'none',
            borderTop: `1px solid ${dividerColor}`,
            margin: '0 0 18px',
          }}
        />

        <section
          style={{
            border: `1px solid ${cardBorder}`,
            background: cardBg,
            borderRadius: 20,
            padding: 20,
            boxShadow: cardShadow,
          }}
        >
          <p
            style={{
              margin: '0 0 6px',
              fontSize: 18,
              fontWeight: 700,
              color: textColor,
              textAlign: 'center',
            }}
          >
            Stay in the loop
          </p>

          <p
            style={{
              margin: '0 0 18px',
              fontSize: 13,
              lineHeight: 1.6,
              color: subText,
              textAlign: 'center',
            }}
          >
            Choose whether you would like a shopping voucher, future updates, or both.
          </p>

          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <Label
                htmlFor="thank-email"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: textColor }}
              >
                Email address
              </Label>

              <div className="relative">
                <Input
                  id="thank-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (submitError) setSubmitError('')
                  }}
                  required
                  className={`pr-10 ${submitError ? 'border-red-300' : ''}`}
                  style={{
                    background: inputBg,
                    color: textColor,
                    borderColor: submitError ? '#fca5a5' : inputBorder,
                  }}
                />
                {email && (
                  <button
                    type="button"
                    onClick={() => setEmail('')}
                    aria-label="Clear"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 border-none bg-transparent cursor-pointer text-lg leading-none"
                    style={{ color: isDark ? '#c7c7c7' : '#888' }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setWantVoucher((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setWantVoucher((prev) => !prev)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  borderRadius: 16,
                  border: `1px solid ${optionBorder}`,
                  background: optionBg,
                  padding: 16,
                  cursor: 'pointer',
                }}
              >
                <Checkbox
                  checked={wantVoucher}
                  onChange={(e) => setWantVoucher(e.target.checked)}
                  className="mt-0.5"
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    color: textColor,
                  }}
                >
                  Send me a $10 shopping voucher
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => setWantUpdates((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setWantUpdates((prev) => !prev)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  borderRadius: 16,
                  border: `1px solid ${optionBorder}`,
                  background: optionBg,
                  padding: 16,
                  cursor: 'pointer',
                }}
              >
                <Checkbox
                  checked={wantUpdates}
                  onChange={(e) => setWantUpdates(e.target.checked)}
                  className="mt-0.5"
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    color: textColor,
                  }}
                >
                  Keep me updated with the latest information
                </span>
              </div>
            </div>

            {(submitError || submitSuccess) && (
              <Alert variant={submitError ? 'error' : 'success'}>
                {submitError || submitSuccess}
              </Alert>
            )}

            <Button
              variant="yellow"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Save preferences'}
            </Button>
          </form>
        </section>

        <div style={{ marginTop: 20 }}>
          <Button variant="outline" onClick={onLogin} className="w-full">
            Join Us
          </Button>
        </div>
      </main>


    </div>
  )
}

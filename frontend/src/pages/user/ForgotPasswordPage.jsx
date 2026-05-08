import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Alert } from '../../components/ui/alert'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { theme } = useTheme()
  const navigate = useNavigate()

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const isDark = theme === 'dark'
  const subtitleColor = isDark ? '#b5b5b5' : '#666'
  const borderColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)'
  const cardBg = isDark ? '#272727' : '#fafafa'
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const inputBg = isDark ? '#1f1f1f' : '#fff'
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : '#d9d9d9'
  const textColor = isDark ? '#f0f0f0' : '#1a1a1a'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `HTTP ${res.status}`)
      }
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="flex flex-col font-poppins"
      style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
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
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            lineHeight: 1.15,
            padding: '0 4vw',
            fontSize: 'clamp(28px, 6vw, 72px)',
            color: theme === 'light' ? '#303030' : '#ffe070',
          }}
        >
          Forgot Password
        </h1>
      </section>

      <main
        style={{ width: '100%', maxWidth: 560, margin: '0 auto', padding: '18px 16px 36px' }}
      >
        <p
          style={{
            fontSize: 14,
            color: subtitleColor,
            textAlign: 'center',
            lineHeight: 1.5,
            margin: '0 auto 14px',
            maxWidth: 420,
          }}
        >
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <hr style={{ border: 'none', borderTop: `1px solid ${dividerColor}`, margin: '0 0 18px' }} />

        <section
          style={{
            border: `1px solid ${borderColor}`,
            background: cardBg,
            borderRadius: 16,
            padding: 16,
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: textColor,
                  margin: '0 0 8px',
                }}
              >
                Check your email
              </p>
              <p style={{ fontSize: 13, color: subtitleColor, lineHeight: 1.6, margin: '0 0 20px' }}>
                If that email address is registered, you'll receive a password reset link shortly.
              </p>
              <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
                Back to Login
              </Button>
            </div>
          ) : (
            <>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: 16,
                  fontWeight: 700,
                  color: textColor,
                  textAlign: 'center',
                }}
              >
                Reset your password
              </p>
              <p
                style={{
                  margin: '0 0 16px',
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: subtitleColor,
                  textAlign: 'center',
                }}
              >
                Enter the email address linked to your account.
              </p>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: textColor }}
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      style={{ background: inputBg, color: textColor, borderColor: inputBorder }}
                    />
                  </div>
                </div>

                {error && <Alert variant="error">{error}</Alert>}

                <div style={{ height: 1, width: '100%', background: dividerColor }} />

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Back to Login
                  </Button>
                  <Button
                    variant="yellow"
                    type="submit"
                    disabled={submitting || !email.trim()}
                    aria-busy={submitting}
                    className="w-full"
                  >
                    {submitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

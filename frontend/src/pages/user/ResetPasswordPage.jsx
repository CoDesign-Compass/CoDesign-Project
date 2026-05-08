import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Alert } from '../../components/ui/alert'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
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

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`)
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
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
          Reset Password
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
          Choose a new password for your account.
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
          {success ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: textColor, margin: '0 0 8px' }}>
                Password updated
              </p>
              <p style={{ fontSize: 13, color: subtitleColor, lineHeight: 1.6, margin: '0 0 20px' }}>
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Button variant="yellow" onClick={() => navigate('/login')} className="w-full">
                Go to Login
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
                Set a new password
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
                Must be at least 6 characters.
              </p>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <Label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: textColor }}
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-11"
                      style={{ background: inputBg, color: textColor, borderColor: inputBorder }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: isDark ? '#c7c7c7' : '#888' }}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="confirm"
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: textColor }}
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="pl-9 pr-11"
                      style={{ background: inputBg, color: textColor, borderColor: inputBorder }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: isDark ? '#c7c7c7' : '#888' }}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <Alert variant="error">{error}</Alert>}

                <div style={{ height: 1, width: '100%', background: dividerColor }} />

                <Button
                  variant="yellow"
                  type="submit"
                  disabled={submitting || !password || !confirm}
                  aria-busy={submitting}
                  className="w-full"
                >
                  {submitting ? 'Saving...' : 'Reset Password'}
                </Button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  )
}

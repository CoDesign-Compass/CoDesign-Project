import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Checkbox } from '../../components/ui/checkbox'
import { Alert } from '../../components/ui/alert'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function CreateAccountPage({ mode = 'create' }) {
  const { theme } = useTheme()

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

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

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

  const isValidEmail = (value) => {
    const trimmed = value.trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitErr('')
    setSubmitSuccess('')

    const emailTrimmed = form.email.trim()

    if (!emailTrimmed) {
      setSubmitErr('Email is required.')
      return
    }

    if (!isValidEmail(emailTrimmed)) {
      setSubmitErr('Please enter a valid email address.')
      return
    }

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
      email: emailTrimmed,
      password: form.password,
      wantsUpdates: form.subscribe,
    }

    const submissionId = localStorage.getItem('submissionId')
    if (!submissionId) {
      setSubmitErr('No submissionId found. Please start from the feedback flow.')
      return
    }

    try {
      setSubmitting(true)
      const user = await signUp(payload)
      const userId = user.id || user.userId

      if (!userId) {
        throw new Error('Signup succeeded but no userId returned from backend.')
      }

      await linkAccount(submissionId, userId)
      setSubmitSuccess('Account created and submission linked!')
    } catch (err) {
      console.error(err)
      setSubmitErr('Sign up failed: ' + err.message)
    } finally {
      setSubmitting(false)
    }
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
          Create Account
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
          style={{
            fontSize: 14,
            color: subText,
            textAlign: 'center',
            lineHeight: 1.5,
            margin: '0 auto 14px',
            maxWidth: 440,
          }}
        >
          Create an account to keep your profile and stay updated about future opportunities.
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
            Account details
          </p>

          <p
            style={{
              margin: '0 0 16px',
              fontSize: 13,
              lineHeight: 1.6,
              color: subText,
              textAlign: 'center',
            }}
          >
            Fill in the information below to create your account.
          </p>

          <form onSubmit={handleSubmit} noValidate className="grid gap-4">
            {mode === 'create' && (
              <div>
                <Label htmlFor="username" className="mb-1.5 block text-sm font-medium" style={{ color: textColor }}>
                  Username
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, username: e.target.value }))
                    }
                    autoComplete="username"
                    className="pl-9"
                    style={{ background: inputBg, color: textColor, borderColor: inputBorder }}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="mb-1.5 block text-sm font-medium" style={{ color: textColor }}>
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="pl-9"
                  style={{ background: inputBg, color: textColor, borderColor: inputBorder }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="mb-1.5 block text-sm font-medium" style={{ color: textColor }}>
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  autoComplete={
                    mode === 'create' ? 'new-password' : 'current-password'
                  }
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

            {mode === 'create' && (
              <div>
                <Label htmlFor="confirm" className="mb-1.5 block text-sm font-medium" style={{ color: textColor }}>
                  Confirm password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirm: e.target.value }))
                  }
                  autoComplete="new-password"
                  style={{ background: inputBg, color: textColor, borderColor: inputBorder }}
                />
              </div>
            )}

            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                setForm((f) => ({ ...f, subscribe: !f.subscribe }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setForm((f) => ({ ...f, subscribe: !f.subscribe }))
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
                checked={form.subscribe}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subscribe: e.target.checked }))
                }
                className="mt-0.5"
              />

              <div>
                <div className="text-sm font-semibold" style={{ color: textColor }}>
                  Keep me updated
                </div>
                <div className="mt-1 text-sm leading-6" style={{ color: subText }}>
                  Receive updates and relevant information in the future.
                </div>
              </div>
            </div>

            {submitErr && <Alert variant="error">{submitErr}</Alert>}
            {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}

            <Button
              variant="yellow"
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="w-full"
            >
              {submitting ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </section>
      </main>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useIssue } from '../../context/IssueContext'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Checkbox } from '../../components/ui/checkbox'
import { Alert } from '../../components/ui/alert'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { shareId: routeShareId } = useParams()
  const { shareId, setShareId } = useIssue()
  const { theme } = useTheme()
  const currentShareId = routeShareId || shareId

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [showPw, setShowPw] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (routeShareId) setShareId(routeShareId)
  }, [routeShareId, setShareId])

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

  const isDark = theme === 'dark'
  const subtitleColor = isDark ? '#b5b5b5' : '#666'
  const borderColor = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)'
  const cardBg = isDark ? '#272727' : '#fafafa'
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const inputBg = isDark ? '#1f1f1f' : '#fff'
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : '#d9d9d9'
  const optionBg = isDark ? '#1f1f1f' : '#fcfcfc'
  const optionBorder = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.06)'
  const textColor = isDark ? '#f0f0f0' : '#1a1a1a'

  return (
    <div
      className="flex flex-col font-poppins"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-color)',
        color: 'var(--text-color)',
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
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            lineHeight: 1.15,
            padding: '0 4vw',
            fontSize: 'clamp(32px, 7vw, 80px)',
            color: theme === 'light' ? '#303030' : '#ffe070',
          }}
        >
          Login
        </h1>
      </section>

      <main
        style={{
          width: '100%',
          maxWidth: 560,
          margin: '0 auto',
          padding: '18px 16px 36px',
        }}
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
          Log in to continue with your account or create a new one if you have not joined yet.
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
            border: `1px solid ${borderColor}`,
            background: cardBg,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <p
            style={{
              margin: '0 0 6px',
              fontSize: 16,
              fontWeight: 700,
              color: textColor,
              textAlign: 'center',
            }}
          >
            Login details
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
            Enter your email and password below.
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
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="pl-9"
                  style={{
                    background: inputBg,
                    color: textColor,
                    borderColor: inputBorder,
                  }}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: textColor }}
              >
                Password
              </Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="pl-9 pr-11"
                  style={{
                    background: inputBg,
                    color: textColor,
                    borderColor: inputBorder,
                  }}
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

            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                setForm((f) => ({ ...f, remember: !f.remember }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setForm((f) => ({ ...f, remember: !f.remember }))
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
                checked={form.remember}
                onChange={(e) =>
                  setForm((f) => ({ ...f, remember: e.target.checked }))
                }
                className="mt-0.5"
              />
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: textColor }}
                >
                  Remember me
                </div>
                <div
                  className="mt-1 text-sm leading-6"
                  style={{ color: subtitleColor }}
                >
                  Stay signed in on this device for a faster return.
                </div>
              </div>
            </div>

            {loginErr && <Alert variant="error">{loginErr}</Alert>}

            <div
              style={{
                height: 1,
                width: '100%',
                background: dividerColor,
              }}
            />

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (currentShareId) navigate(`/share/${currentShareId}/createaccount`)
                  else navigate('/createaccount')
                }}
                className="w-full"
              >
                Sign Up
              </Button>

              <Button
                variant="yellow"
                type="submit"
                disabled={loginSubmitting}
                aria-busy={loginSubmitting}
                className="w-full"
              >
                {loginSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

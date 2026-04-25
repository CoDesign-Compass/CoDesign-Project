import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Checkbox } from '../../components/ui/checkbox'
import { Alert } from '../../components/ui/alert'


export default function LoginPage({ onSubmit: onSubmitProp }) {
  const { shareId: routeShareId } = useParams()
  const { shareId, setShareId } = useIssue()
  const { theme } = useTheme()
  const currentShareId = routeShareId || shareId

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPw, setShowPw] = useState(false)
  const [loginErr, setLoginErr] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)

  const navigate = useNavigate()

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
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) throw new Error(data?.message || text || `HTTP ${res.status}`)

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

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <section
        className="w-screen -ml-[calc(50vw-50%)] grid place-items-center text-center"
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

      <main className="w-full grid place-items-center px-3 py-16">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-[min(560px,92vw)] grid gap-4 mx-auto"
        >
          <div className="grid gap-1.5">
            <Label className="sr-only" htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={change('email')}
                autoComplete="email"
              />
              {form.email && (
                <ClearBtn onClick={() => setForm((f) => ({ ...f, email: '' }))} right={12} />
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="sr-only" htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={change('password')}
                autoComplete="current-password"
                aria-invalid={loginErr ? 'true' : 'false'}
                className="pr-24"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-10 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-500 cursor-pointer text-sm"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
              {form.password && (
                <ClearBtn onClick={() => setForm((f) => ({ ...f, password: '' }))} right={56} />
              )}
            </div>
          </div>

          <label className="flex items-center gap-2.5 mt-1 text-sm text-[var(--text-color)] opacity-90 cursor-pointer">
            <Checkbox checked={form.remember} onChange={change('remember')} />
            <span>Remember me</span>
          </label>

          {loginErr && <Alert variant="error">{loginErr}</Alert>}

          <div className="grid justify-items-center mt-2.5">
            <Button
              variant="dark"
              type="submit"
              disabled={loginSubmitting}
              aria-busy={loginSubmitting}
              className="min-w-[240px] py-3 px-6 text-[22px]"
            >
              {loginSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </div>

          <div className="grid justify-items-center mt-2.5">
            <Button
              variant="dark"
              type="button"
              onClick={() => {
                if (currentShareId) navigate(`/share/${currentShareId}/createaccount`)
                else navigate('/createaccount')
              }}
              className="min-w-[240px] py-3 px-6 text-[22px]"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </main>


    </div>
  )
}

function ClearBtn({ onClick, right }) {
  return (
    <button
      type="button"
      aria-label="Clear"
      onClick={onClick}
      style={{ right }}
      className="absolute top-1/2 -translate-y-1/2 w-7 h-7 border-none bg-transparent cursor-pointer text-lg text-gray-400 leading-none"
    >
      ×
    </button>
  )
}

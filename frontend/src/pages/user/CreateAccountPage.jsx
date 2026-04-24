import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Checkbox } from '../../components/ui/checkbox'
import { Alert } from '../../components/ui/alert'
import AiChatBubble from '../../components/AiChatBubble'

export default function CreateAccountPage({ mode = 'create', onSubmit: onSubmitProp }) {
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
        throw new Error('This email is already registered. Try logging in, or use another email.')
      }
      throw new Error(msg || `HTTP ${res.status}`)
    }
    return text ? JSON.parse(text) : {}
  }

  async function linkAccount(submissionId, userId) {
    const res = await fetch(`${API_BASE}/api/submissions/${submissionId}/link-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
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
      setSubmitErr('No submissionId found. Please start from the feedback flow.')
      return
    }

    try {
      setSubmitting(true)
      const user = await signUp(payload)
      const userId = user.id || user.userId
      if (!userId) throw new Error('Signup succeeded but no userId returned from backend.')

      const linked = await linkAccount(submissionId, userId)
      console.log('link ok:', linked)
      setSubmitSuccess('Account created and submission linked!')
    } catch (err) {
      console.error(err)
      setSubmitErr('Sign up failed: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <section
        className="w-screen -ml-[calc(50vw-50%)] h-[120px] grid place-items-center text-center"
        style={{
          backgroundImage: 'url(/Banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="m-0 text-[44px] text-[var(--heading)] tracking-wide drop-shadow-sm">
          Create Account
        </h1>
      </section>

      <main className="w-full grid place-items-center px-3 py-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-[min(560px,92vw)] grid gap-4 mx-auto"
        >
          {mode === 'create' && (
            <div className="grid gap-1.5">
              <Label className="sr-only" htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={change('username')}
                  autoComplete="username"
                />
                {form.username && (
                  <ClearBtn onClick={() => setForm((f) => ({ ...f, username: '' }))} />
                )}
              </div>
            </div>
          )}

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
                <ClearBtn onClick={() => setForm((f) => ({ ...f, email: '' }))} />
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
                autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
                aria-invalid={submitErr ? 'true' : 'false'}
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

          {mode === 'create' && (
            <div className="grid gap-1.5">
              <Label className="sr-only" htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirm}
                  onChange={change('confirm')}
                  autoComplete="new-password"
                />
                {form.confirm && (
                  <ClearBtn onClick={() => setForm((f) => ({ ...f, confirm: '' }))} />
                )}
              </div>
            </div>
          )}

          <label className="flex items-center gap-2.5 mt-1 text-sm text-[var(--text-color)] opacity-90 cursor-pointer">
            <Checkbox checked={form.subscribe} onChange={change('subscribe')} />
            <span>Keep me updated with the latest information</span>
          </label>

          {submitErr && <Alert variant="error">{submitErr}</Alert>}
          {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}

          <div className="grid justify-items-center mt-2.5">
            <Button
              variant="dark"
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="min-w-[240px] py-3 px-6 text-[22px]"
            >
              {submitting ? 'Signing up...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </main>

      <div className="w-[min(960px,92vw)] mx-auto flex justify-end pb-4">
        <AiChatBubble initialMessage="Hello! I'm your AI assistant. I can help you create an account or explain the feedback flow." />
      </div>
    </div>
  )
}

function ClearBtn({ onClick, right = 12 }) {
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

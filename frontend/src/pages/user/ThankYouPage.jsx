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

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')

    const trimmed = email.trim()
    if (!trimmed.length) { setSubmitError('Please enter your email address.'); return }
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) { setSubmitError('Please enter a valid email address.'); return }

    const submissionId = localStorage.getItem('submissionId')
    if (!submissionId) { setSubmitError('No submissionId found.'); return }

    try {
      setIsSubmitting(true)
      const resp = await saveThanksInfo(submissionId, { email: trimmed, wantsVoucher: wantVoucher, wantsUpdates: wantUpdates })
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
    if (currentShareId) navigate(`/share/${currentShareId}/createaccount`)
    else navigate('/createaccount')
  }

  const isDark = theme === 'dark'

  return (
    <div
      className="flex flex-col w-full mx-auto box-border"
      style={{ paddingInline: 'clamp(12px,4vw,24px)', paddingBottom: 'clamp(20px,4vw,36px)' }}
    >
      <section className="my-[clamp(18px,4vw,40px)] grid place-items-center" />

      <section
        className="m-0 w-full grid place-items-center text-center relative"
        style={{
          height: 'clamp(140px,30vh,260px)',
          backgroundImage: 'url(/Banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: isDark ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.08)' }}
        />
        <div className="relative z-10 px-[4vw]">
          <h1
            className="m-0 font-poppins leading-tight"
            style={{ fontSize: 'clamp(30px,8vw,96px)', color: isDark ? '#ffe070' : '#303030' }}
          >
            Thanks
          </h1>
          <h2
            className="mt-1 mb-0 font-poppins leading-snug"
            style={{ fontSize: 'clamp(24px,3.2vw,40px)', color: isDark ? '#ffe070' : '#303030' }}
          >
            for sharing your experience
          </h2>
        </div>
      </section>

      <section className="mt-9 mx-auto text-center w-full max-w-[760px]">
        <p
          className="m-0 text-compass-yellow text-center font-bold font-poppins leading-snug"
          style={{ fontSize: 'clamp(15px,2.4vw,20px)', textShadow: 'rgba(0, 0, 0, 0.13) 1px 1px 1px' }}
        >
          Give us your email for $10 shopping voucher or more
        </p>
        <p
          className="mt-2.5 mb-0 text-center font-poppins leading-relaxed text-[var(--text-color)] opacity-80"
          style={{ fontSize: 'clamp(12px,1.9vw,15px)' }}
        >
          Choose whether you would like a voucher, updates, or both.
        </p>

        <div className="flex justify-center mt-[clamp(16px,4vw,24px)]">
          <form
            onSubmit={onSubmit}
            className="flex items-end gap-3 flex-wrap w-full justify-center"
          >
            <div className="relative flex-1 min-w-0 text-left" style={{ flex: '1 1 clamp(220px,70vw,420px)' }}>
              <Label
                htmlFor="thank-email"
                className="block mb-1.5 font-semibold text-[var(--text-color)]"
                style={{ fontSize: 'clamp(12px,1.8vw,14px)' }}
              >
                Email address
              </Label>
              <div className="relative">
                <Input
                  id="thank-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`pr-10 ${submitError ? 'border-red-300' : ''}`}
                  style={{
                    height: 'clamp(40px,3.4vw,46px)',
                    fontSize: 'clamp(12px,2vw,18px)',
                    background: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
                    color: isDark ? '#fff' : '#303030',
                    borderColor: isDark ? 'rgba(255,255,255,0.22)' : undefined,
                  }}
                />
                {email && (
                  <button
                    type="button"
                    onClick={() => setEmail('')}
                    aria-label="Clear"
                    className="absolute right-2 bottom-[11px] w-6 h-6 border-none bg-transparent cursor-pointer text-lg text-gray-400 leading-none z-10"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="flex-shrink-0 border border-compass-yellow"
              style={{
                height: 'clamp(40px,3.4vw,46px)',
                fontSize: 'clamp(12px,1.5vw,16px)',
                padding: '0 clamp(14px,2vw,18px)',
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </div>

        {(submitError || submitSuccess) && (
          <div className="mt-3.5">
            <Alert variant={submitError ? 'error' : 'success'}>
              {submitError || submitSuccess}
            </Alert>
          </div>
        )}

        <div className="mt-[clamp(18px,3vw,28px)] grid gap-3 text-left">
          <label className="flex items-start justify-start gap-3 cursor-pointer">
            <Checkbox
              checked={wantVoucher}
              onChange={(e) => setWantVoucher(e.target.checked)}
              className="mt-0.5 w-[18px] h-[18px]"
            />
            <span
              className="font-semibold text-[var(--text-color)] font-poppins leading-snug"
              style={{ fontSize: 'clamp(12px,2vw,16px)' }}
            >
              Send me a $10 shopping voucher
            </span>
          </label>

          <label className="flex items-start justify-start gap-3 cursor-pointer">
            <Checkbox
              checked={wantUpdates}
              onChange={(e) => setWantUpdates(e.target.checked)}
              className="mt-0.5 w-[18px] h-[18px]"
            />
            <span
              className="font-semibold text-[var(--text-color)] font-poppins leading-snug flex-1"
              style={{ fontSize: 'clamp(12px,2vw,16px)' }}
            >
              Keep me updated with the latest information
            </span>
          </label>
        </div>
      </section>

      <section className="grid place-items-center my-[clamp(22px,3vw,32px)]">
        <Button
          variant="primary"
          onClick={onLogin}
          className="border-2 border-compass-yellow"
          style={{ fontSize: 'clamp(18px,3.2vw,30px)', padding: '8px 22px' }}
        >
          Join Us
        </Button>
      </section>


    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useIssue } from '../../context/IssueContext'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Checkbox } from '../../components/ui/checkbox'

export default function ConsentPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const navigate = useNavigate()
  const { setIssueId, setShareId, setIssueContent } = useIssue()

  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [consentText, setConsentText] = useState('')
  const [checked, setChecked] = useState(false)

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  useEffect(() => {
    if (!routeShareId) return

    const fetchIssueContext = async () => {
      setLoading(true)
      setPageError('')

      try {
        const res = await fetch(`${API_BASE}/api/share/${routeShareId}`)
        const text = await res.text()
        if (!res.ok) throw new Error(text || 'Failed to fetch consent details')

        const data = text ? JSON.parse(text) : {}
        const fetchedIssueId = Number(data?.issueId)

        if (!Number.isFinite(fetchedIssueId) || fetchedIssueId <= 0) {
          throw new Error('Invalid issueId from /api/share/{shareId}')
        }

        setIssueId(fetchedIssueId)
        setShareId(data?.shareId ?? routeShareId)
        setIssueContent(data?.issueContent || '')
        setConsentText(
          (data?.consentText || '').trim() ||
            'By continuing, you confirm that you understand the purpose of this feedback activity and agree to proceed.',
        )

        localStorage.setItem('issueId', String(fetchedIssueId))
        localStorage.setItem('shareId', String(data?.shareId ?? routeShareId))
      } catch (error) {
        console.error('Failed to load consent page:', error)
        setPageError('This consent page could not be loaded. Please try the share link again.')
      } finally {
        setLoading(false)
      }
    }

    fetchIssueContext()
  }, [API_BASE, routeShareId, setIssueContent, setIssueId, setShareId])

  const handleContinue = () => {
    if (!checked) return
    navigate(`/share/${routeShareId}/profile`)
  }

  const isDark = theme === 'dark'

  return (
    <div className="w-full max-w-[900px] mx-auto px-5 pt-6 pb-10 box-border font-poppins text-[var(--text-color)]">
      <div className="mb-6">
        <h1 className="m-0 text-[clamp(28px,4vw,40px)] leading-tight text-[var(--text-color)]">
          Consent
        </h1>
        <p className="mt-2.5 mb-0 text-[15px] leading-7 text-[var(--text-color)] opacity-70">
          Please read the information below before continuing.
        </p>
      </div>

      {loading && (
        <Card className={isDark ? 'border-white/10 bg-[#1f1f1f]' : ''}>
          <CardContent>
            <p className="text-[var(--text-color)] opacity-70 m-0">Loading consent information...</p>
          </CardContent>
        </Card>
      )}

      {!loading && pageError && (
        <Card className={isDark ? 'border-white/10 bg-[#1f1f1f]' : ''}>
          <CardContent>
            <p className="text-red-700 m-0 leading-relaxed">{pageError}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !pageError && (
        <>
          <Card
            className={`shadow-md ${isDark ? 'border-white/10 bg-[#1f1f1f]' : 'border-gray-200 bg-white shadow-md'}`}
          >
            <CardContent>
              <p className="m-0 text-[15px] leading-[1.85] whitespace-pre-wrap text-[var(--text-color)]">
                {consentText}
              </p>
            </CardContent>
          </Card>

          <div
            className={`mt-5 p-5 rounded-[14px] border ${isDark ? 'border-white/10 bg-transparent' : 'border-gray-200 bg-gray-50'}`}
          >
            <label className="flex items-start gap-3 cursor-pointer leading-relaxed text-[var(--text-color)]">
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-0.5 accent-compass-purple"
              />
              <span>I understand and agree to continue.</span>
            </label>
          </div>

          <div className="mt-7 flex justify-end">
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={!checked}
            >
              Continue
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

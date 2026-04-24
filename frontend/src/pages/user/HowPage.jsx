import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Card, CardContent } from '../../components/ui/card'
import { Alert } from '../../components/ui/alert'

function InfoHint({ title, text, isDark, yellowIcon = false }) {
  return (
    <div
      style={{
        background: isDark ? '#272727' : '#ffffff',
        borderRadius: 16,
        padding: 16,
        boxShadow: isDark
          ? '0 1px 6px rgba(0,0,0,0.35)'
          : '0 1px 6px rgba(0,0,0,0.07)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          marginTop: 2,
          width: 24,
          height: 24,
          minWidth: 24,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          background: yellowIcon
            ? '#ffe071'
            : isDark
              ? 'rgba(255,255,255,0.10)'
              : '#f0f0f0',
          color: '#1a1a1a',
        }}
      >
        i
      </div>

      <div>
        {title && (
          <div
            style={{
              marginBottom: 4,
              fontSize: 14,
              fontWeight: 700,
              color: isDark ? '#f0f0f0' : '#1a1a1a',
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: isDark ? '#888' : '#777',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

export default function HowPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { setShareId } = useIssue()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(Array(5).fill(''))
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const questions = Array(5).fill(
    'Write in your own words. No names or identifiers.',
  )

  const inputRef = useRef(null)
  const endRef = useRef(null)

  const isDark = theme === 'dark'
  const submissionId = Number(localStorage.getItem('submissionId'))
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const submitHow = async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')

    try {
      const body = {
        submissionId,
        shareId: routeShareId,
        answer1: answers[0],
        answer2: answers[1],
        answer3: answers[2],
        answer4: answers[3],
        answer5: answers[4],
      }

      const howResponse = await fetch(`${API_BASE}/api/how`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!howResponse.ok) {
        const errorText = await howResponse.text()
        throw new Error(`Failed to submit how response: ${errorText}`)
      }

      const sid = localStorage.getItem('submissionId')
      if (!sid) throw new Error('No submissionId found')

      const submitResponse = await fetch(
        `${API_BASE}/api/submissions/${sid}/submit`,
        {
          method: 'POST',
        },
      )

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text()
        throw new Error(`Failed to submit feedback session: ${errorText}`)
      }

      navigate(`/share/${routeShareId}/thankyou`)
    } catch (err) {
      console.error(err)
      setSubmitError(err.message || 'Something went wrong while submitting.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [step])

  useEffect(() => {
    if (routeShareId) setShareId(routeShareId)
  }, [routeShareId, setShareId])

  const next = async () => {
    if (step === questions.length - 1) {
      await submitHow()
      return
    }
    setStep((s) => s + 1)
  }

  const finish = async () => {
    await submitHow()
  }

  const pageBg = isDark ? '#1e1e1e' : '#f5f5f5'
  const cardBg = isDark ? '#272727' : '#ffffff'
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const cardShadow = isDark ? '0 1px 6px rgba(0,0,0,0.35)' : '0 1px 6px rgba(0,0,0,0.07)'
  const textColor = isDark ? '#f0f0f0' : '#1a1a1a'
  const subText = isDark ? '#888' : '#777'
  const inputBg = isDark ? '#1e1e1e' : '#ffffff'
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : '#ddd'

  const card = {
    background: cardBg,
    borderRadius: 16,
    padding: 24,
    boxShadow: cardShadow,
    border: `1px solid ${cardBorder}`,
    marginBottom: 20,
  }

  return (
    <div style={{ background: pageBg, minHeight: '100%', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px 40px' }}>
        <div style={{ marginBottom: 28 }}>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: textColor, margin: '0 0 6px' }}>
            How could this be improved?
          </h1>
          <p style={{ fontSize: 14, color: subText, margin: 0, lineHeight: 1.6 }}>
            Share practical ideas, suggestions, or changes that could improve the issue.
          </p>
        </div>

        {submitError && (
          <Alert variant="error" className="mb-4 rounded-2xl">
            {submitError}
          </Alert>
        )}

        <InfoHint
          isDark={isDark}
          title={`Follow-up question ${step + 1} of ${questions.length}`}
          text="Write in your own words. No names or identifiers."
          yellowIcon
        />

        {questions.slice(0, step).map((_, i) => (
          <Card
            key={i}
            className={`${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white'} mb-3 rounded-2xl shadow-sm`}
          >
            <CardContent className="p-4">
              {i > 0 && (
                <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: textColor }}>
                  How could that be improved?
                </p>
              )}
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.6, color: textColor }}>
                {answers[i]}
              </p>
            </CardContent>
          </Card>
        ))}

        <AnimatePresence mode="popLayout">
          {step > 0 && (
            <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: textColor }}>
              How could that be improved?
            </p>
          )}

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div style={card}>
              <Textarea
                ref={inputRef}
                placeholder="Type your answer here..."
                value={answers[step]}
                onChange={(e) => {
                  const nextAnswers = [...answers]
                  nextAnswers[step] = e.target.value
                  setAnswers(nextAnswers)
                }}
                style={{
                  width: '100%',
                  minHeight: 140,
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: `1.5px solid ${inputBorder}`,
                  background: inputBg,
                  color: textColor,
                  fontSize: 14,
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {step > 0 && (
                  <InfoHint
                    isDark={isDark}
                    text='Select “I don’t know” if you are unsure how to continue. This will end the follow-up questions.'
                    yellowIcon
                  />
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: step > 0 ? '1fr 1fr' : '1fr',
                    gap: 12,
                  }}
                >
                  {step > 0 && (
                    <Button
                      variant="outline"
                      onClick={finish}
                      disabled={submitting}
                      className="w-full"
                    >
                      {submitting ? 'Submitting...' : "I don't know"}
                    </Button>
                  )}

                  <Button
                    variant="yellow"
                    onClick={next}
                    disabled={submitting || !answers[step].trim()}
                    className="w-full"
                  >
                    {submitting
                      ? 'Submitting...'
                      : step === questions.length - 1
                        ? 'Finish'
                        : 'Next question'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div ref={endRef} />
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'

function InfoHint({ title, text, isDark }) {
  const bg = isDark ? '#1f1f1f' : '#f8f9fa'
  const border = isDark ? 'rgba(255,255,255,0.12)' : '#e9ecef'
  const titleColor = isDark ? '#f5f5f5' : '#111111'
  const textColor = isDark ? '#cfcfcf' : '#555555'
  const iconBg = isDark ? 'rgba(255,255,255,0.08)' : '#e9ecef'

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '14px 16px',
        borderRadius: 10,
        background: bg,
        border: `1px solid ${border}`,
        marginBottom: 16,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 22,
          height: 22,
          minWidth: 22,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: iconBg,
          color: titleColor,
          fontSize: 13,
          fontWeight: 700,
          lineHeight: 1,
          marginTop: 1,
        }}
      >
        i
      </div>

      <div>
        <div
          style={{
            fontWeight: 600,
            marginBottom: 4,
            color: titleColor,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: textColor,
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

  const questions = Array(5).fill(
    'Write in your own words. No names or identifiers.',
  )

  const inputRef = useRef(null)
  const endRef = useRef(null)

  const isDark = theme === 'dark'

  const pageTextColor = isDark ? '#f5f5f5' : '#111111'
  const secondaryTextColor = isDark ? '#cfcfcf' : '#555555'
  const answeredCardBackground = isDark ? '#1f1f1f' : '#f1f3f5'
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e9ecef'
  const inputBackground = isDark ? '#1a1a1a' : '#ffffff'
  const inputBorderColor = isDark ? 'rgba(255,255,255,0.18)' : '#ced4da'
  const inputTextColor = isDark ? '#f5f5f5' : '#111111'
  const buttonBackground = '#ffe071'
  const buttonTextColor = '#000000'

  const submissionId = Number(localStorage.getItem('submissionId'))

  const API_BASE =
    process.env.REACT_APP_API_BASE_URL ||
    'https://codesign-project.onrender.com'

  const submitHow = async () => {
    if (submitting) return
    setSubmitting(true)

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!howResponse.ok) {
        const errorText = await howResponse.text()
        throw new Error(`Failed to submit how response: ${errorText}`)
      }

      const submissionId = localStorage.getItem('submissionId')
      console.log('API_BASE =', API_BASE)
      console.log('submissionId =', submissionId)

      if (!submissionId) {
        throw new Error('No submissionId found')
      }

      const submitUrl = `${API_BASE}/api/submissions/${submissionId}/submit`
      console.log('submitUrl =', submitUrl)

      const submitResponse = await fetch(submitUrl, {
        method: 'POST',
      })

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text()
        console.error('submit error body =', errorText)
        throw new Error(`Failed to submit feedback session: ${errorText}`)
      }

      navigate(`/share/${routeShareId}/thankyou`)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [step])

  useEffect(() => {
    if (routeShareId) {
      setShareId(routeShareId)
    }
  }, [routeShareId, setShareId])

  const next = async () => {
    const isLastQuestion = step === questions.length - 1

    if (isLastQuestion) {
      await submitHow()
      return
    }

    setStep((s) => s + 1)
  }

  const finish = async () => {
    await submitHow()
  }

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '0 16px',
        color: pageTextColor,
      }}
    >
      <p style={{ marginBottom: 6, color: pageTextColor }}>
        <strong>How could this be improved?</strong>
      </p>

      <InfoHint
        isDark={isDark}
        title={`Follow-up question ${step + 1} of ${questions.length}`}
        text="Write in your own words. No names or identifiers."
      />

      {questions.slice(0, step).map((q, i) => (
        <div
          key={i}
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            background: answeredCardBackground,
            marginBottom: 10,
            border: `1px solid ${borderColor}`,
          }}
        >
          {i > 0 && (
            <div
              style={{
                fontWeight: 600,
                marginBottom: 6,
                color: pageTextColor,
              }}
            >
              How could that be improved?
            </div>
          )}

          <div
            style={{
              whiteSpace: 'pre-wrap',
              color: pageTextColor,
              lineHeight: 1.5,
            }}
          >
            {answers[i]}
          </div>
        </div>
      ))}

      <AnimatePresence mode="popLayout">
        {step > 0 && (
          <div
            style={{
              fontWeight: 600,
              marginBottom: 6,
              color: pageTextColor,
            }}
          >
            How could that be improved?
          </div>
        )}

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 8,
          }}
        >
          <textarea
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
              minHeight: 120,
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${inputBorderColor}`,
              outline: 'none',
              fontSize: 16,
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              background: inputBackground,
              color: inputTextColor,
            }}
          />

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {step > 0 && (
              <motion.div
                key="idk-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: secondaryTextColor,
                    maxWidth: 240,
                  }}
                >
                  Select “I don’t know” if you are unsure how to continue. This
                  will end the follow-up questions.
                </div>

                <button
                  type="button"
                  onClick={finish}
                  disabled={submitting}
                  style={{
                    background: buttonBackground,
                    border: 'none',
                    color: buttonTextColor,
                    borderRadius: 10,
                    padding: '12px 18px',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Submitting...' : 'I don’t know'}
                </button>
              </motion.div>
            )}

            <button
              type="button"
              onClick={next}
              disabled={submitting || !answers[step].trim()}
              style={{
                background: buttonBackground,
                color: buttonTextColor,
                border: 'none',
                borderRadius: 10,
                padding: '12px 18px',
                fontWeight: 600,
                cursor:
                  submitting || !answers[step].trim()
                    ? 'not-allowed'
                    : 'pointer',
                opacity: submitting || !answers[step].trim() ? 0.7 : 1,
                alignSelf: step > 0 ? 'flex-end' : 'flex-start',
              }}
            >
              {submitting
                ? 'Submitting...'
                : step === questions.length - 1
                  ? 'Finish'
                  : 'Next'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div ref={endRef} />
    </div>
  )
}

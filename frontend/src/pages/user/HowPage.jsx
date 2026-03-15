import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'

export default function HowPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { setShareId } = useIssue()

  const [step, setStep] = useState(0)

  const questions = Array(5).fill(
    'Write in your own words. No names or identifiers.',
  )

  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const inputRef = useRef(null)
  const endRef = useRef(null)

  const isDark = theme === 'dark'

  const pageTextColor = isDark ? '#f5f5f5' : '#111111'
  const secondaryTextColor = isDark ? '#cfcfcf' : '#555555'
  const cardBackground = isDark ? '#232323' : '#f5f5f5'
  const answeredCardBackground = isDark ? '#1f1f1f' : '#f1f3f5'
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e9ecef'
  const inputBackground = isDark ? '#1a1a1a' : '#ffffff'
  const inputBorderColor = isDark ? 'rgba(255,255,255,0.18)' : '#ced4da'
  const inputTextColor = isDark ? '#f5f5f5' : '#111111'
  const buttonBackground = '#ffe071'
  const buttonTextColor = '#000000'

  useEffect(() => {
    inputRef.current?.focus()
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [step])

  useEffect(() => {
    if (routeShareId) {
      setShareId(routeShareId)
    }
  }, [routeShareId, setShareId])

  const next = () => setStep((s) => Math.min(s + 1, questions.length))
  const finish = () => setStep(questions.length)

  if (step >= questions.length) {
    return (
      <div
        style={{
          maxWidth: 680,
          margin: '40px auto',
          padding: '0 16px',
          color: pageTextColor,
        }}
      >
        <h2 style={{ marginBottom: 16, color: pageTextColor }}>
          Your responses
        </h2>

        {questions.map((q, i) => (
          <div
            key={i}
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: cardBackground,
              marginBottom: 10,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 6,
                color: pageTextColor,
              }}
            >
              Follow-up response {i + 1}
            </div>

            <div
              style={{
                color: pageTextColor,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}
            >
              {answers[i]?.trim() || 'No response provided.'}
            </div>
          </div>
        ))}
      </div>
    )
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

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: secondaryTextColor,
          marginBottom: 16,
        }}
      >
        Follow-up question {step + 1} of {questions.length}
      </div>

      {/* Answered questions displayed */}
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
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.5,
              color: secondaryTextColor,
            }}
          >
            {questions[step]}
          </div>

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
                  style={{
                    background: buttonBackground,
                    border: 'none',
                    color: buttonTextColor,
                    borderRadius: 10,
                    padding: '12px 18px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  I don’t know
                </button>
              </motion.div>
            )}

            <button
              type="button"
              onClick={next}
              disabled={!answers[step].trim()}
              style={{
                background: buttonBackground,
                color: buttonTextColor,
                border: 'none',
                borderRadius: 10,
                padding: '12px 18px',
                fontWeight: 600,
                cursor: answers[step].trim() ? 'pointer' : 'not-allowed',
                opacity: answers[step].trim() ? 1 : 0.7,
                alignSelf: step > 0 ? 'flex-end' : 'flex-start',
              }}
            >
              Next
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div ref={endRef} />
    </div>
  )
}

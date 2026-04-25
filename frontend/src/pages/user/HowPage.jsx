import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'

const TOTAL_QUESTION_STEPS = 5

const slideVariants = {
  enter:  (dir) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   (dir) => ({ x: dir * -48, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }),
}

export default function HowPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { setShareId } = useIssue()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection]     = useState(1)
  const [answers, setAnswers]         = useState(Array(TOTAL_QUESTION_STEPS).fill(''))
  const [submitting, setSubmitting]   = useState(false)

  const inputRef = useRef(null)
  const topRef   = useRef(null)
  const isDark   = theme === 'dark'

  const submissionId = Number(localStorage.getItem('submissionId'))
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  useEffect(() => { if (routeShareId) setShareId(routeShareId) }, [routeShareId, setShareId])

  useEffect(() => {
    inputRef.current?.focus()
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentStep])

  const submitHow = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const howRes = await fetch(`${API_BASE}/api/how`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          shareId: routeShareId,
          answer1: answers[0], answer2: answers[1], answer3: answers[2],
          answer4: answers[3], answer5: answers[4],
        }),
      })
      if (!howRes.ok) throw new Error('Failed to submit how response')

      const sid = localStorage.getItem('submissionId')
      if (!sid) throw new Error('No submissionId found')

      const submitRes = await fetch(`${API_BASE}/api/submissions/${sid}/submit`, { method: 'POST' })
      if (!submitRes.ok) throw new Error('Failed to submit feedback session')

      navigate(`/share/${routeShareId}/thankyou`)
    } finally {
      setSubmitting(false)
    }
  }

  const goNext = async () => {
    if (currentStep < TOTAL_QUESTION_STEPS) {
      if (!answers[currentStep - 1].trim()) return
      setDirection(1)
      setCurrentStep((s) => s + 1)
    } else {
      await submitHow()
    }
  }

  const goPrev = () => {
    if (currentStep === 1) return
    setDirection(-1)
    setCurrentStep((s) => s - 1)
  }

  const finishEarly = async () => { await submitHow() }

  // ── design tokens ────────────────────────────────────────────────
  const textColor   = isDark ? '#f0f0f0' : '#1a1a1a'
  const subText     = isDark ? '#888' : '#888'
  const inputBg     = isDark ? '#1a1a1a' : '#ffffff'
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : '#ced4da'
  const hintBg      = isDark ? '#1f1f1f' : '#f8f9fa'
  const isLastStep  = currentStep === TOTAL_QUESTION_STEPS
  const questionIdx = currentStep - 1

  return (
    <div
      ref={topRef}
      className="max-w-[640px] mx-auto px-4 font-poppins"
      style={{ color: textColor, paddingBottom: 32 }}
    >
      {/* ── Progress bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: subText, whiteSpace: 'nowrap' }}>
          Question {currentStep} of {TOTAL_QUESTION_STEPS}
        </span>
        <div style={{ flex: 1, display: 'flex', gap: 4 }}>
          {Array.from({ length: TOTAL_QUESTION_STEPS }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: i < currentStep ? '#ffe071' : isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0',
                transition: 'background 0.25s',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Animated step content ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* Question label */}
          <p style={{ fontWeight: 600, fontSize: 20, color: textColor, marginBottom: 60 }}>
            {currentStep === 1
              ? 'How could this be improved?'
              : 'How could that be improved?'}
          </p>

          {/* Info hint */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              padding: '12px 14px',
              borderRadius: 10,
              background: hintBg,
              marginBottom: 16,
              fontSize: 13,
              color: subText,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 20, height: 20, minWidth: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDark ? 'rgba(255,255,255,0.08)' : '#e9ecef',
                fontSize: 11, fontWeight: 700, color: textColor, marginTop: 1,
              }}
            >i</span>
            Write in your own words. No names or identifiers.
          </div>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            placeholder="Type your answer here…"
            value={answers[questionIdx]}
            onChange={(e) => {
              const next = [...answers]
              next[questionIdx] = e.target.value
              setAnswers(next)
            }}
            style={{
              width: '100%',
              minHeight: 130,
              padding: '12px 14px',
              borderRadius: 10,
              border: `1.5px solid ${inputBorder}`,
              background: inputBg,
              color: textColor,
              fontSize: 15,
              fontFamily: 'Poppins, sans-serif',
              lineHeight: 1.55,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#ffe071' }}
            onBlur={(e) => { e.target.style.borderColor = inputBorder }}
          />

          {/* Navigation row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14, gap: 10, flexWrap: 'wrap' }}>

            {/* Back */}
            <button
              onClick={goPrev}
              disabled={currentStep === 1}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#ddd'}`,
                background: 'transparent',
                color: currentStep === 1 ? (isDark ? 'rgba(255,255,255,0.2)' : '#ccc') : textColor,
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'Poppins, sans-serif',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              ← Previous
            </button>

            {/* Right side: I don't know + Next/Finish */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {currentStep >= 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 11, color: subText, maxWidth: 200, textAlign: 'right', lineHeight: 1.4 }}>
                    Unsure how to continue?
                  </span>
                  <button
                    onClick={finishEarly}
                    disabled={submitting}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 10,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#ddd'}`,
                      background: 'transparent',
                      color: subText,
                      fontWeight: 600,
                      fontSize: 14,
                      fontFamily: 'Poppins, sans-serif',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.6 : 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    I don't know
                  </button>
                </div>
              )}

              <button
                onClick={goNext}
                disabled={submitting || !answers[questionIdx].trim()}
                style={{
                  padding: '10px 22px',
                  borderRadius: 10,
                  border: 'none',
                  background: answers[questionIdx].trim() && !submitting ? '#ffe071' : isDark ? 'rgba(255,255,255,0.08)' : '#e0e0e0',
                  color: answers[questionIdx].trim() && !submitting ? '#1a1a1a' : subText,
                  fontWeight: 700,
                  fontSize: 14,
                  fontFamily: 'Poppins, sans-serif',
                  cursor: answers[questionIdx].trim() && !submitting ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                {submitting ? 'Submitting…' : isLastStep ? 'Finish ✓' : 'Next question →'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

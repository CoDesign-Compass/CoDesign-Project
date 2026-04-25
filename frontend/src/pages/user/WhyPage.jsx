import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'


// Step 0 = stance, steps 1–5 = follow-up questions
const TOTAL_QUESTION_STEPS = 5

const STANCE_OPTIONS = [
  { key: 'agree',    base: '#ccf6e2', hover: '#b5ead7', selected: '#7fd3b5', label: 'Agree' },
  { key: 'disagree', base: '#ffd6d6', hover: '#ffc2c2', selected: '#ff8787', label: 'Disagree' },
  { key: 'unknown',  base: '#f8f9fa', hover: '#f1f3f5', selected: '#dee2e6', label: "I don't know" },
]

const slideVariants = {
  enter:  (dir) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   (dir) => ({ x: dir * -48, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }),
}

export default function WhyPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { setShareId, issueContent } = useIssue()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)   // 0=stance, 1–5=questions
  const [direction, setDirection]     = useState(1)
  const [selectedButton, setSelectedButton] = useState(null)
  const [hoveredButton, setHoveredButton]   = useState(null)
  const [answers, setAnswers] = useState(Array(TOTAL_QUESTION_STEPS).fill(''))
  const [submitting, setSubmitting] = useState(false)

  const inputRef = useRef(null)
  const topRef   = useRef(null)
  const isDark   = theme === 'dark'

  const submissionId = Number(localStorage.getItem('submissionId'))
  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  useEffect(() => { if (routeShareId) setShareId(routeShareId) }, [routeShareId, setShareId])

  useEffect(() => {
    if (currentStep > 0) inputRef.current?.focus()
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentStep])

  const submitWhy = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/why`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          shareId: routeShareId,
          stance: selectedButton,
          answer1: answers[0], answer2: answers[1], answer3: answers[2],
          answer4: answers[3], answer5: answers[4],
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      navigate(`/share/${routeShareId}/how`)
    } finally {
      setSubmitting(false)
    }
  }

  const goNext = async () => {
    if (currentStep === 0) {
      if (!selectedButton) return
      setDirection(1)
      setCurrentStep(1)
    } else if (currentStep < TOTAL_QUESTION_STEPS) {
      if (!answers[currentStep - 1].trim()) return
      setDirection(1)
      setCurrentStep((s) => s + 1)
    } else {
      await submitWhy()
    }
  }

  const goPrev = () => {
    if (currentStep === 0) return
    setDirection(-1)
    setCurrentStep((s) => s - 1)
  }

  const finishEarly = async () => { await submitWhy() }

  // ── stance button style ──────────────────────────────────────────
  const stanceStyle = (key, base, hover, selected) => {
    const isSelected    = selectedButton === key
    const isHovered     = hoveredButton === key
    const isOtherDimmed = !!selectedButton && !isSelected

    return {
      flex: 1,
      backgroundColor: isSelected ? selected : isHovered ? hover : base,
      transform: isSelected ? 'translateY(-3px)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: isSelected
        ? '0 8px 24px rgba(0,0,0,0.13)'
        : isHovered ? '0 6px 14px rgba(0,0,0,0.10)' : '0 2px 6px rgba(0,0,0,0.06)',
      opacity: isOtherDimmed ? 0.4 : 1,
      filter: isOtherDimmed ? 'saturate(0.5)' : 'none',
      border: 'none',
      borderRadius: 10,
      padding: '0.85rem',
      fontWeight: 700,
      color: '#000',
      cursor: 'pointer',
      transition: 'all 0.18s ease',
    }
  }

  // ── design tokens ────────────────────────────────────────────────
  const textColor   = isDark ? '#f0f0f0' : '#1a1a1a'
  const subText     = isDark ? '#888' : '#888'
  const inputBg     = isDark ? '#1a1a1a' : '#ffffff'
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : '#ced4da'
  const hintBg      = isDark ? '#1f1f1f' : '#f8f9fa'
  const hintBorder  = isDark ? 'rgba(255,255,255,0.08)' : '#e9ecef'
  const isLastStep  = currentStep === TOTAL_QUESTION_STEPS
  const questionIdx = currentStep - 1   // 0-based index into answers[]

  return (
    <div
      ref={topRef}
      className="max-w-[640px] mx-auto px-4 font-poppins"
      style={{ color: textColor, paddingBottom: 32 }}
    >

      {/* ── Progress bar (question steps only) ── */}
      {currentStep > 0 && (
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
      )}

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

          {/* ── STEP 0: Stance selection ── */}
          {currentStep === 0 && (
            <div>
              <div style={{display: 'flex', marginBottom: 40}}>
                <span
                  style={{
                    display: 'inline-block',
                    height: 'fit-content',
                    background: '#ffe071',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    color: '#000',
                    fontSize: 20,
                    marginBottom: 8,
                    marginRight: 8
                  }}
                >
                Issue
              </span>
                <p style={{ lineHeight: 1.65, marginBottom: 24, color: textColor, fontSize: 20 }}>
                  {issueContent || 'No issue content available.'}
                </p>
              </div>

              <p style={{ fontWeight: 600, marginBottom: 6, color: textColor }}>
                What is your view on this issue?
              </p>
              <p style={{ fontSize: 13, color: subText, marginBottom: 16 }}>
                Select one option to continue to the follow-up questions.
              </p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                {STANCE_OPTIONS.map(({ key, base, hover, selected, label }) => (
                  <button
                    key={key}
                    type="button"
                    onMouseEnter={() => setHoveredButton(key)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => setSelectedButton(key)}
                    style={stanceStyle(key, base, hover, selected)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {selectedButton === key && <span aria-hidden="true" style={{ fontSize: 13, fontWeight: 900 }}>✓</span>}
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={goNext}
                  disabled={!selectedButton}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: selectedButton ? '#ffe071' : isDark ? 'rgba(255,255,255,0.08)' : '#e0e0e0',
                    color: selectedButton ? '#1a1a1a' : subText,
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: 'Poppins, sans-serif',
                    cursor: selectedButton ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEPS 1–5: Follow-up questions ── */}
          {currentStep > 0 && (
            <div>
              {/* Stance badge */}
              <div style={{ marginBottom: 20 }}>
                {(() => {
                  const opt = STANCE_OPTIONS.find((o) => o.key === selectedButton)
                  return opt ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 12px',
                        borderRadius: 20,
                        background: opt.selected,
                        color: '#1a1a1a',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      ✓ {opt.label}
                    </span>
                  ) : null
                })()}
              </div>

              {/* Question label */}
              <p style={{ fontWeight: 600, fontSize: 20, color: textColor, marginBottom: 60 }}>
                {currentStep === 1
                  ? 'Why does this issue matter to you?'
                  : 'Why does that matter to you?'}
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
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#ddd'}`,
                    background: 'transparent',
                    color: textColor,
                    fontWeight: 600,
                    fontSize: 14,
                    fontFamily: 'Poppins, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  ← Previous
                </button>

                {/* Right side: I don't know + Next/Finish */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {currentStep >= 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                      <span style={{ fontSize: 11, color: subText, maxWidth: 150, textAlign: 'right', lineHeight: 1.4 }}>
                        Unsure how to continue? This would end follow-ups.
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
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  )
}

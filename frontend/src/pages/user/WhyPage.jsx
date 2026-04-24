import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'

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

function AnswerCard({ title, answer, isDark }) {
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
        marginBottom: 12,
      }}
    >
      {title && (
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 14,
            fontWeight: 700,
            color: isDark ? '#f0f0f0' : '#1a1a1a',
          }}
        >
          {title}
        </p>
      )}
      <p
        style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          fontSize: 14,
          lineHeight: 1.6,
          color: isDark ? '#f0f0f0' : '#1a1a1a',
        }}
      >
        {answer}
      </p>
    </div>
  )
}

export default function WhyPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { setShareId, issueContent } = useIssue()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(Array(5).fill(''))
  const [selectedButton, setSelectedButton] = useState(null)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const inputRef = useRef(null)
  const endRef = useRef(null)

  const isDark = theme === 'dark'
  const questions = Array(5).fill(
    'Write in your own words. Please do not enter any names or identifiers.',
  )

  const submissionId = Number(localStorage.getItem('submissionId'))
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  useEffect(() => {
    if (routeShareId) setShareId(routeShareId)
  }, [routeShareId, setShareId])

  useEffect(() => {
    if (selectedButton) {
      inputRef.current?.focus()
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [step, selectedButton])

  const submitWhy = async () => {
    if (submitting) return
    setSubmitting(true)

    try {
      const body = {
        submissionId,
        shareId: routeShareId,
        stance: selectedButton,
        answer1: answers[0],
        answer2: answers[1],
        answer3: answers[2],
        answer4: answers[3],
        answer5: answers[4],
      }

      const response = await fetch(`${API_BASE}/api/why`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to submit why response')
      }

      navigate(`/share/${routeShareId}/how`)
    } catch (error) {
      console.error(error)
      alert('Failed to submit your response. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const next = async () => {
    if (step === questions.length - 1) {
      await submitWhy()
      return
    }
    setStep((s) => s + 1)
  }

  const finish = async () => {
    await submitWhy()
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

  const getStanceStyle = (key, base, hover, selected) => {
    const isSelected = selectedButton === key
    const isHovered = hoveredButton === key
    const isOtherDimmed = !!selectedButton && !isSelected

    return {
      backgroundColor: isSelected ? selected : isHovered ? hover : base,
      transform: isSelected || isHovered ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: isSelected
        ? '0 0 0 3px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.12)'
        : isHovered
          ? '0 6px 14px rgba(0,0,0,0.10)'
          : '0 2px 6px rgba(0,0,0,0.06)',
      opacity: isOtherDimmed ? 0.45 : 1,
      filter: isOtherDimmed ? 'saturate(0.7)' : 'none',
      cursor: 'pointer',
      transition: 'all 0.18s ease',
      border: isSelected
        ? '2px solid rgba(0,0,0,0.18)'
        : '1px solid rgba(0,0,0,0.06)',
      borderRadius: 12,
      padding: '12px 16px',
      fontWeight: 700,
      color: '#000000',
      flex: 1,
      minWidth: '160px',
    }
  }

  return (
    <div style={{ background: pageBg, minHeight: '100%', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px 40px' }}>
        <div style={{ marginBottom: 28 }}>

          <div
            style={{
              display: 'inline-flex',
              marginBottom: 10,
              borderRadius: 8,
              background: '#ffe071',
              padding: '6px 12px',
              fontSize: 14,
              fontWeight: 700,
              color: '#1a1a1a',
            }}
          >
            Issue
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: textColor, margin: '0 0 8px' }}>
            {issueContent || 'No issue content available.'}
          </h1>

          <p style={{ fontSize: 15, color: subText, margin: 0, lineHeight: 1.6 }}>
            Tell us why this issue matters to you.
          </p>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: textColor, margin: '0 0 6px' }}>
            What is your view on this issue?
          </h2>
          <p style={{ fontSize: 13, color: subText, margin: '0 0 20px', lineHeight: 1.6 }}>
            Please select one option before continuing to the follow-up questions.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              {
                key: 'agree',
                base: '#d8f5dc',
                hover: '#c7f7cd',
                selected: '#69db7c',
                label: 'Agree',
              },
              {
                key: 'disagree',
                base: '#ffd6d6',
                hover: '#ffc2c2',
                selected: '#ff8787',
                label: 'Disagree',
              },
              {
                key: 'unknown',
                base: '#f8f9fa',
                hover: '#f1f3f5',
                selected: '#dee2e6',
                label: "I don't know",
              },
            ].map(({ key, base, hover, selected, label }) => (
              <button
                key={key}
                type="button"
                onMouseEnter={() => setHoveredButton(key)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => setSelectedButton(key)}
                style={getStanceStyle(key, base, hover, selected)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {selectedButton === key && <span aria-hidden="true">✓</span>}
                  <span>{label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {!selectedButton && (
          <InfoHint
            isDark={isDark}
            title="Select a response to continue"
            text="Choose Agree, Disagree, or I don’t know first. The follow-up question box will appear after you make your selection."
            yellowIcon
          />
        )}

        {selectedButton && (
          <>
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: textColor, margin: 0 }}>
                Why does this issue matter to you?
              </h3>
            </div>

            <InfoHint
              isDark={isDark}
              title={`Follow-up question ${step + 1} of ${questions.length}`}
              text="Write in your own words. Please do not enter any names or identifiers."
              yellowIcon
            />

            {questions.slice(0, step).map((_, i) => (
              <AnswerCard
                key={i}
                isDark={isDark}
                title={i > 0 ? 'Why does that matter to you?' : ''}
                answer={answers[i]}
              />
            ))}

            <AnimatePresence mode="popLayout">
              {step > 0 && (
                <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: textColor }}>
                  Why does that matter to you?
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
          </>
        )}

        <div ref={endRef} />
      </div>
    </div>
  )
}

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

export default function WhyPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { setShareId, issueContent } = useIssue()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const questions = Array(5).fill(
    'Write in your own words. No names or identifiers.',
  )
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const inputRef = useRef(null)
  const endRef = useRef(null)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [selectedButton, setSelectedButton] = useState(null)

  const isDark = theme === 'dark'

  const pageTextColor = isDark ? '#f5f5f5' : '#111111'
  const secondaryTextColor = isDark ? '#cfcfcf' : '#555555'
  const answeredCardBackground = isDark ? '#1f1f1f' : '#f1f3f5'
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e9ecef'
  const inputBackground = isDark ? '#1a1a1a' : '#ffffff'
  const inputBorderColor = isDark ? 'rgba(255,255,255,0.18)' : '#ced4da'
  const inputTextColor = isDark ? '#f5f5f5' : '#111111'
  const issueChipBackground = '#ffe071'
  const issueChipTextColor = '#000000'
  const actionButtonBackground = '#ffe071'
  const actionButtonTextColor = '#000000'
  const hintCardBackground = isDark ? '#1f1f1f' : '#f8f9fa'

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const submitWhy = async () => {
    const body = {
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to submit why response')
    }

    navigate(`/share/${routeShareId}/how`)
  }

  useEffect(() => {
    if (selectedButton) {
      inputRef.current?.focus()
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [step, selectedButton])

  useEffect(() => {
    if (routeShareId) {
      setShareId(routeShareId)
    }
  }, [routeShareId, setShareId])

  const getTopChoiceStyle = (key, baseColor, hoverColor, selectedColor) => {
    const hasSelection = !!selectedButton
    const isSelected = selectedButton === key
    const isHovered = hoveredButton === key
    const isOtherDimmed = hasSelection && !isSelected

    return {
      flex: 1,
      backgroundColor: isSelected
        ? selectedColor
        : isHovered
          ? hoverColor
          : baseColor,
      transform: isSelected
        ? 'translateY(-2px)'
        : isHovered
          ? 'translateY(-2px)'
          : 'translateY(0)',
      boxShadow: isSelected
        ? '0 0 0 3px rgba(0,0,0,0.18), 0 10px 20px rgba(0,0,0,0.18)'
        : isHovered
          ? '0 6px 14px rgba(0,0,0,0.14)'
          : '0 2px 6px rgba(0,0,0,0.08)',
      opacity: isOtherDimmed ? 0.45 : 1,
      filter: isOtherDimmed ? 'saturate(0.65)' : 'none',
      cursor: 'pointer',
      transition: 'all 0.18s ease',
      border: isSelected ? '2px solid rgba(0,0,0,0.28)' : '1px solid rgba(0,0,0,0.06)',
      borderRadius: '8px',
      padding: '0.85rem',
      fontWeight: 700,
      color: '#000000',
    }
  }

  const next = async () => {
    const isLastQuestion = step === questions.length - 1

    if (isLastQuestion) {
      await submitWhy()
      return
    }

    setStep((s) => s + 1)
  }

  const finish = async () => {
    await submitWhy()
  }

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '0 16px',
        fontFamily: 'Poppins, sans-serif',
        color: pageTextColor,
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <span
          style={{
            backgroundColor: issueChipBackground,
            fontWeight: 'bold',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            color: issueChipTextColor,
          }}
        >
          Issue:
        </span>

        <p
          style={{
            marginTop: '0.5rem',
            lineHeight: 1.6,
            color: pageTextColor,
          }}
        >
          {issueContent || 'No issue content available.'}
        </p>

        <div
          style={{
            fontWeight: 600,
            marginTop: '1.25rem',
            marginBottom: '0.5rem',
            color: pageTextColor,
          }}
        >
          What is your view on this issue?
        </div>

        <div
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            color: secondaryTextColor,
            marginBottom: '1rem',
          }}
        >
          Please select one option before continuing to the follow-up questions.
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onMouseEnter={() => setHoveredButton('agree')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setSelectedButton('agree')}
            style={getTopChoiceStyle('agree', '#d8f5dc', '#c7f7cd', '#69db7c')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {selectedButton === 'agree' && (
                <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 900 }}>
                  ✓
                </span>
              )}
              <span>Agree</span>
            </span>
          </button>

          <button
            type="button"
            onMouseEnter={() => setHoveredButton('disagree')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setSelectedButton('disagree')}
            style={getTopChoiceStyle(
              'disagree',
              '#ffd6d6',
              '#ffc2c2',
              '#ff8787',
            )}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {selectedButton === 'disagree' && (
                <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 900 }}>
                  ✓
                </span>
              )}
              <span>Disagree</span>
            </span>
          </button>

          <button
            type="button"
            onMouseEnter={() => setHoveredButton('unknown')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => setSelectedButton('unknown')}
            style={getTopChoiceStyle(
              'unknown',
              '#f8f9fa',
              '#f1f3f5',
              '#dee2e6',
            )}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {selectedButton === 'unknown' && (
                <span aria-hidden="true" style={{ fontSize: 14, fontWeight: 900 }}>
                  ✓
                </span>
              )}
              <span>I don't know</span>
            </span>
          </button>
        </div>
      </div>

      {!selectedButton && (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: hintCardBackground,
            marginBottom: 16,
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
            Select a response to continue
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: secondaryTextColor,
            }}
          >
            Choose Agree, Disagree, or I don’t know first. The follow-up
            question box will appear after you make your selection.
          </div>
        </div>
      )}

      {selectedButton && (
        <>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 6,
              color: pageTextColor,
            }}
          >
            Why does this issue matter to you?
          </div>

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
                  Why does that matter to you?
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
                Why does that matter to you?
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
                  const nextAns = [...answers]
                  nextAns[step] = e.target.value
                  setAnswers(nextAns)
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
                    transition={{ duration: 0.25 }}
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
                      Select “I don’t know” if you are unsure how to continue.
                      This will end the follow-up questions.
                    </div>

                    <button
                      type="button"
                      onClick={finish}
                      style={{
                        background: actionButtonBackground,
                        border: 'none',
                        borderRadius: 10,
                        padding: '12px 18px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        color: actionButtonTextColor,
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
                    background: actionButtonBackground,
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 18px',
                    fontWeight: 600,
                    cursor: answers[step].trim() ? 'pointer' : 'not-allowed',
                    opacity: answers[step].trim() ? 1 : 0.7,
                    whiteSpace: 'nowrap',
                    color: actionButtonTextColor,
                    alignSelf: step > 0 ? 'flex-end' : 'flex-start',
                  }}
                >
                  Next
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <div ref={endRef} />
    </div>
  )
}
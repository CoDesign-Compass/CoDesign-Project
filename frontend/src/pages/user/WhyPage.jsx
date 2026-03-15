import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

export default function WhyPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { setShareId, issueContent } = useIssue()

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
  const cardBackground = isDark ? '#232323' : '#f5f5f5'
  const answeredCardBackground = isDark ? '#1f1f1f' : '#f1f3f5'
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e9ecef'
  const inputBackground = isDark ? '#1a1a1a' : '#ffffff'
  const inputBorderColor = isDark ? 'rgba(255,255,255,0.18)' : '#ced4da'
  const inputTextColor = isDark ? '#f5f5f5' : '#111111'
  const issueChipBackground = '#ffe071'
  const issueChipTextColor = '#000000'
  const actionButtonBackground = '#ffe071'
  const actionButtonTextColor = '#000000'
  const navigate = useNavigate()

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

    const response = await fetch('http://localhost:8080/api/why', {
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
    inputRef.current?.focus()
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [step])

  useEffect(() => {
    if (routeShareId) {
      setShareId(routeShareId)
    }
  }, [routeShareId, setShareId])

  const getTopChoiceStyle = (key, baseColor, hoverColor, selectedColor) => ({
    flex: 1,
    backgroundColor:
      selectedButton === key
        ? selectedColor
        : hoveredButton === key
          ? hoverColor
          : baseColor,
    transform:
      hoveredButton === key && !selectedButton
        ? 'translateY(-2px)'
        : 'translateY(0)',
    boxShadow:
      selectedButton === key
        ? '0 0 0 2px rgba(0,0,0,0.08), 0 6px 14px rgba(0,0,0,0.18)'
        : hoveredButton === key
          ? '0 6px 14px rgba(0,0,0,0.18)'
          : '0 2px 6px rgba(0,0,0,0.08)',
    opacity: selectedButton && selectedButton !== key ? 0.55 : 1,
    cursor:
      selectedButton && selectedButton !== key ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    border: 'none',
    borderRadius: '6px',
    padding: '0.75rem',
    fontWeight: 'bold',
    color: '#000000',
  })

  if (step >= questions.length) {
    return (
      <div
        style={{
          maxWidth: 680,
          margin: '40px auto',
          padding: '0 16px',
          fontFamily: 'Poppins, sans-serif',
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

  //const next = () => setStep((s) => Math.min(s + 1, questions.length))
  const next = async () => {
    const isLastQuestion = step === questions.length - 1

    if (isLastQuestion) {
      await submitWhy()
      return
    }

    setStep((s) => s + 1)
  }
  //const finish = () => setStep(questions.length)
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
      {/* Issue Section */}
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
            onClick={() => {
              if (!selectedButton) setSelectedButton('agree')
            }}
            disabled={selectedButton !== null && selectedButton !== 'agree'}
            style={getTopChoiceStyle('agree', '#d8f5dc', '#c7f7cd', '#b2f2bb')}
          >
            Agree
          </button>

          <button
            type="button"
            onMouseEnter={() => setHoveredButton('disagree')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              if (!selectedButton) setSelectedButton('disagree')
            }}
            disabled={selectedButton !== null && selectedButton !== 'disagree'}
            style={getTopChoiceStyle(
              'disagree',
              '#ffd6d6',
              '#ffc2c2',
              '#ffa8a8',
            )}
          >
            Disagree
          </button>

          <button
            type="button"
            onMouseEnter={() => setHoveredButton('unknown')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              if (!selectedButton) setSelectedButton('unknown')
            }}
            disabled={selectedButton !== null && selectedButton !== 'unknown'}
            style={getTopChoiceStyle(
              'unknown',
              '#f8f9fa',
              '#f1f3f5',
              '#e9ecef',
            )}
          >
            I don’t know
          </button>
        </div>
      </div>

      <div
        style={{
          fontWeight: 600,
          marginBottom: 6,
          color: pageTextColor,
        }}
      >
        Why does this issue matter to you?
      </div>

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

      {/* Previously answered questions */}
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
                  Select “I don’t know” if you are unsure how to continue. This
                  will end the follow-up questions.
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

      <div ref={endRef} />
    </div>
  )
}

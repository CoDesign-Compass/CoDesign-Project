import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useNavigate } from "react-router-dom"

export default function WhyPage() {
  const { shareId: routeShareId } = useParams()
  const { setShareId, issueContent } = useIssue()
  const [step, setStep] = useState(0)
  const questions = Array(5).fill('answer here')
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const inputRef = useRef(null)
  const endRef = useRef(null)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [selectedButton, setSelectedButton] = useState(null)

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

  if (step >= questions.length) {
    return (
      <div
        style={{ maxWidth: 680, margin: '40px auto', fontFamily: 'Poppins' }}
      >
        <h2 style={{ marginBottom: 16 }}>Your Answer :</h2>
        {questions.map((q, i) => (
          <div
            key={i}
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: '#f5f5f5',
              marginBottom: 10,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{q}</div>
            <div style={{ color: 'black' }}>{answers[i] || '(no answer)'}</div>
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Issue Section */}
      <div style={{ marginBottom: '2rem' }}>
        <span
          style={{
            backgroundColor: '#ffe071',
            fontWeight: 'bold',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            color: '#000000',
          }}
        >
          Issue:
        </span>
        <p style={{ marginTop: '0.5rem' }}>
          {issueContent || 'No issue content available.'}
        </p>

        {/* Buttons: Agree / Disagree / I don't know */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          <button
            onMouseEnter={() => setHoveredButton('agree')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              if (!selectedButton) setSelectedButton('agree')
            }}
            disabled={selectedButton !== null && selectedButton !== 'agree'}
            style={{
              flex: 1,
              backgroundColor:
                selectedButton === 'agree'
                  ? '#b2f2bb'
                  : hoveredButton === 'agree'
                    ? '#c7f7cd'
                    : '#d8f5dc',
              transform:
                hoveredButton === 'agree' && !selectedButton
                  ? 'translateY(-2px)'
                  : 'scale(1)',
              boxShadow:
                selectedButton === 'agree'
                  ? '0 0 0 2px rgba(0,0,0,0.08), 0 6px 14px rgba(0,0,0,0.18)'
                  : hoveredButton === 'agree'
                    ? '0 6px 14px rgba(0,0,0,0.18)'
                    : '0 2px 6px rgba(0,0,0,0.08)',
              opacity: selectedButton && selectedButton !== 'agree' ? 0.55 : 1,
              cursor:
                selectedButton && selectedButton !== 'agree'
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.15s ease',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              fontWeight: 'bold',
              color: '#000000',
            }}
          >
            Agree
          </button>

          <button
            onMouseEnter={() => setHoveredButton('disagree')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              if (!selectedButton) setSelectedButton('disagree')
            }}
            disabled={selectedButton !== null && selectedButton !== 'disagree'}
            style={{
              flex: 1,
              backgroundColor:
                selectedButton === 'disagree'
                  ? '#ffa8a8'
                  : hoveredButton === 'disagree'
                    ? '#ffc2c2'
                    : '#ffd6d6',
              transform:
                hoveredButton === 'disagree' && !selectedButton
                  ? 'translateY(-2px)'
                  : 'scale(1)',
              boxShadow:
                selectedButton === 'disagree'
                  ? '0 0 0 2px rgba(0,0,0,0.08), 0 6px 14px rgba(0,0,0,0.18)'
                  : hoveredButton === 'disagree'
                    ? '0 6px 14px rgba(0,0,0,0.18)'
                    : '0 2px 6px rgba(0,0,0,0.08)',
              opacity:
                selectedButton && selectedButton !== 'disagree' ? 0.55 : 1,
              cursor:
                selectedButton && selectedButton !== 'disagree'
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.15s ease',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              fontWeight: 'bold',
              color: '#000000',
            }}
          >
            Disagree
          </button>

          <button
            onMouseEnter={() => setHoveredButton('unknown')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => {
              if (!selectedButton) setSelectedButton('unknown')
            }}
            disabled={selectedButton !== null && selectedButton !== 'unknown'}
            style={{
              flex: 1,
              backgroundColor:
                selectedButton === 'unknown'
                  ? '#e9ecef'
                  : hoveredButton === 'unknown'
                    ? '#f1f3f5'
                    : '#f8f9fa',
              transform:
                hoveredButton === 'unknown' && !selectedButton
                  ? 'translateY(-2px)'
                  : 'scale(1)',
              boxShadow:
                selectedButton === 'unknown'
                  ? '0 0 0 2px rgba(0,0,0,0.08), 0 6px 14px rgba(0,0,0,0.18)'
                  : hoveredButton === 'unknown'
                    ? '0 6px 14px rgba(0,0,0,0.18)'
                    : '0 2px 6px rgba(0,0,0,0.08)',
              opacity:
                selectedButton && selectedButton !== 'unknown' ? 0.55 : 1,
              cursor:
                selectedButton && selectedButton !== 'unknown'
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.15s ease',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              fontWeight: 'bold',
              color: '#000000',
            }}
          >
            I don’t know
          </button>
        </div>
      </div>

      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Why does this issue matter to you?
      </div>

      {/* Question Section */}
      {questions.slice(0, step).map((q, i) => (
        <div
          key={i}
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            background: '#f1f3f5',
            marginBottom: 10,
            border: '1px solid #e9ecef',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{q}</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{answers[i]}</div>
        </div>
      ))}

      {/* Current question (only this field is editable) + animation */}
      <AnimatePresence mode="popLayout">
        {/* Question Section */}
        {step > 0 && (
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Why does that matter to you?
          </div>
        )}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={questions[step]}
            value={answers[step]}
            onChange={(e) => {
              const nextAns = [...answers]
              nextAns[step] = e.target.value
              setAnswers(nextAns)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && answers[step].trim()) next()
            }}
            style={{
              flex: 1,
              minWidth: '60%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid #ced4da',
              outline: 'none',
              fontSize: 16,
            }}
          />

          {/* "I don't know" button appears only from the second question (step > 0) */}
          {step > 0 && (
            <motion.button
              key="idk"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={finish}
              style={{
                background: '#ffe071',
                border: 'none',
                borderRadius: 10,
                padding: '12px 18px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: '#000000',
              }}
            >
              I don’t know
            </motion.button>
          )}

          <button
            onClick={next}
            disabled={!answers[step].trim()}
            style={{
              background: '#ffe071',
              border: 'none',
              borderRadius: 10,
              padding: '12px 18px',
              fontWeight: 600,
              cursor: answers[step].trim() ? 'pointer' : 'not-allowed',
              opacity: answers[step].trim() ? 1 : 0.7,
              whiteSpace: 'nowrap',
              color: '#000000',
            }}
          >
            Next
          </button>
        </motion.div>
      </AnimatePresence>

      <div ref={endRef} />
    </div>
  )
}

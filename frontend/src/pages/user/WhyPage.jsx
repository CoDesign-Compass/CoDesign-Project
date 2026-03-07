import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'

export default function WhyPage() {
  const { shareId: routeShareId } = useParams()
  const { setShareId, issueContent } = useIssue()
  const [step, setStep] = useState(0)
  const questions = Array(5).fill('answer here')
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const inputRef = useRef(null)
  const endRef = useRef(null)

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

  const next = () => setStep((s) => Math.min(s + 1, questions.length))
  const finish = () => setStep(questions.length)

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
            style={{
              flex: 1,
              backgroundColor: '#b2f2bb', // soft green
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#000000',
            }}
          >
            Agree
          </button>
          <button
            style={{
              flex: 1,
              backgroundColor: '#ffa8a8', // soft red
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#000000',
            }}
          >
            Disagree
          </button>
          <button
            style={{
              flex: 1,
              backgroundColor: '#e9ecef', // grey
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#000000',
            }}
          >
            I don’t know
          </button>
        </div>
      </div>

      {/* Question Section */}
      <p>
        <strong>Why does this issue matter to you?</strong>
      </p>

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

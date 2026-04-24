import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { cn } from '../../lib/utils'

function InfoHint({ title, text, isDark }) {
  return (
    <div
      className={cn(
        'flex gap-3 items-start px-4 py-3.5 rounded-[10px] border mb-4',
        isDark ? 'bg-[#1f1f1f] border-white/10' : 'bg-gray-50 border-gray-200',
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'w-[22px] h-[22px] min-w-[22px] rounded-full flex items-center justify-center text-[13px] font-bold leading-none mt-0.5',
          isDark ? 'bg-white/8 text-white' : 'bg-gray-200 text-gray-800',
        )}
      >
        i
      </div>
      <div>
        <div className={cn('font-semibold mb-1', isDark ? 'text-gray-100' : 'text-gray-900')}>
          {title}
        </div>
        <div className={cn('text-sm leading-relaxed', isDark ? 'text-gray-400' : 'text-gray-500')}>
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
  const questions = Array(5).fill('Write in your own words. No names or identifiers.')

  const inputRef = useRef(null)
  const endRef = useRef(null)

  const isDark = theme === 'dark'

  const submissionId = Number(localStorage.getItem('submissionId'))
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!howResponse.ok) {
        const errorText = await howResponse.text()
        throw new Error(`Failed to submit how response: ${errorText}`)
      }

      const sid = localStorage.getItem('submissionId')
      if (!sid) throw new Error('No submissionId found')

      const submitResponse = await fetch(`${API_BASE}/api/submissions/${sid}/submit`, {
        method: 'POST',
      })

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text()
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
    if (routeShareId) setShareId(routeShareId)
  }, [routeShareId, setShareId])

  const next = async () => {
    if (step === questions.length - 1) { await submitHow(); return }
    setStep((s) => s + 1)
  }
  const finish = async () => { await submitHow() }

  return (
    <div className="max-w-[680px] mx-auto px-4 text-[var(--text-color)]">
      <p className="mb-1.5">
        <strong>How could this be improved?</strong>
      </p>

      <InfoHint
        isDark={isDark}
        title={`Follow-up question ${step + 1} of ${questions.length}`}
        text="Write in your own words. No names or identifiers."
      />

      {questions.slice(0, step).map((_, i) => (
        <div
          key={i}
          className={cn(
            'px-4 py-3 rounded-[10px] border mb-2.5',
            isDark ? 'bg-[#1f1f1f] border-white/10' : 'bg-gray-100 border-gray-200',
          )}
        >
          {i > 0 && (
            <p className="font-semibold mb-1.5 text-[var(--text-color)] m-0">
              How could that be improved?
            </p>
          )}
          <p className="whitespace-pre-wrap text-[var(--text-color)] leading-relaxed m-0">
            {answers[i]}
          </p>
        </div>
      ))}

      <AnimatePresence mode="popLayout">
        {step > 0 && (
          <p className="font-semibold mb-1.5 text-[var(--text-color)]">
            How could that be improved?
          </p>
        )}

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-col gap-2.5 mt-2"
        >
          <Textarea
            ref={inputRef}
            placeholder="Type your answer here..."
            value={answers[step]}
            onChange={(e) => {
              const next = [...answers]
              next[step] = e.target.value
              setAnswers(next)
            }}
            className={cn(
              'text-base',
              isDark ? 'bg-[#1a1a1a] border-white/20 text-gray-100' : '',
            )}
          />

          <div className="flex gap-2.5 flex-wrap items-start">
            {step > 0 && (
              <motion.div
                key="idk-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-1.5"
              >
                <p className={cn('text-[13px] leading-relaxed max-w-[240px] m-0', isDark ? 'text-gray-400' : 'text-gray-500')}>
                  Select "I don't know" if you are unsure how to continue. This will end the follow-up questions.
                </p>
                <Button variant="yellow" onClick={finish} disabled={submitting}>
                  {submitting ? 'Submitting...' : "I don't know"}
                </Button>
              </motion.div>
            )}

            <Button
              variant="yellow"
              onClick={next}
              disabled={submitting || !answers[step].trim()}
              className={step > 0 ? 'self-end' : 'self-start'}
            >
              {submitting
                ? 'Submitting...'
                : step === questions.length - 1
                  ? 'Finish'
                  : 'Next'}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div ref={endRef} />
    </div>
  )
}

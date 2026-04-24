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

export default function WhyPage() {
  const { theme } = useTheme()
  const { shareId: routeShareId } = useParams()
  const { setShareId, issueContent } = useIssue()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const questions = Array(5).fill('Write in your own words. No names or identifiers.')
  const [answers, setAnswers] = useState(Array(questions.length).fill(''))
  const inputRef = useRef(null)
  const endRef = useRef(null)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [selectedButton, setSelectedButton] = useState(null)

  const isDark = theme === 'dark'

  const submissionId = Number(localStorage.getItem('submissionId'))
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com'

  const submitWhy = async () => {
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
    if (!response.ok) throw new Error('Failed to submit why response')
    navigate(`/share/${routeShareId}/how`)
  }

  useEffect(() => {
    if (selectedButton) {
      inputRef.current?.focus()
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [step, selectedButton])

  useEffect(() => {
    if (routeShareId) setShareId(routeShareId)
  }, [routeShareId, setShareId])

  const getStanceStyle = (key, base, hover, selected) => {
    const isSelected = selectedButton === key
    const isHovered = hoveredButton === key
    const isOtherDimmed = !!selectedButton && !isSelected
    return {
      backgroundColor: isSelected ? selected : isHovered ? hover : base,
      transform: isSelected || isHovered ? 'translateY(-2px)' : 'translateY(0)',
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
      borderRadius: 8,
      padding: '0.85rem',
      fontWeight: 700,
      color: '#000000',
      flex: 1,
    }
  }

  const next = async () => {
    if (step === questions.length - 1) { await submitWhy(); return }
    setStep((s) => s + 1)
  }
  const finish = async () => { await submitWhy() }

  return (
    <div
      className="max-w-[680px] mx-auto px-4 font-poppins text-[var(--text-color)]"
    >
      <div className="mb-8">
        <span className="bg-compass-yellow font-bold px-2 py-0.5 rounded text-black text-sm">
          Issue:
        </span>
        <p className="mt-2 leading-relaxed text-[var(--text-color)]">
          {issueContent || 'No issue content available.'}
        </p>

        <p className="font-semibold mt-5 mb-2 text-[var(--text-color)]">
          What is your view on this issue?
        </p>
        <p className={cn('text-sm leading-relaxed mb-4', isDark ? 'text-gray-400' : 'text-gray-500')}>
          Please select one option before continuing to the follow-up questions.
        </p>

        <div className="flex gap-2.5 mt-4 flex-wrap">
          {[
            { key: 'agree', base: '#d8f5dc', hover: '#c7f7cd', selected: '#69db7c', label: 'Agree' },
            { key: 'disagree', base: '#ffd6d6', hover: '#ffc2c2', selected: '#ff8787', label: 'Disagree' },
            { key: 'unknown', base: '#f8f9fa', hover: '#f1f3f5', selected: '#dee2e6', label: "I don't know" },
          ].map(({ key, base, hover, selected, label }) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => setHoveredButton(key)}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => setSelectedButton(key)}
              style={getStanceStyle(key, base, hover, selected)}
            >
              <span className="inline-flex items-center gap-2">
                {selectedButton === key && <span aria-hidden="true" className="text-sm font-black">✓</span>}
                <span>{label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {!selectedButton && (
        <div
          className={cn(
            'px-4 py-3.5 rounded-[10px] border mb-4',
            isDark ? 'bg-[#1f1f1f] border-white/10' : 'bg-gray-50 border-gray-200',
          )}
        >
          <p className="font-semibold mb-1.5 text-[var(--text-color)] m-0">
            Select a response to continue
          </p>
          <p className={cn('text-sm leading-relaxed m-0', isDark ? 'text-gray-400' : 'text-gray-500')}>
            Choose Agree, Disagree, or I don't know first. The follow-up question box will appear after you make your selection.
          </p>
        </div>
      )}

      {selectedButton && (
        <>
          <p className="font-semibold mb-1.5 text-[var(--text-color)]">
            Why does this issue matter to you?
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
                  Why does that matter to you?
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
                Why does that matter to you?
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
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-1.5"
                  >
                    <p className={cn('text-[13px] leading-relaxed max-w-[240px] m-0', isDark ? 'text-gray-400' : 'text-gray-500')}>
                      Select "I don't know" if you are unsure how to continue. This will end the follow-up questions.
                    </p>
                    <Button variant="yellow" onClick={finish}>
                      I don't know
                    </Button>
                  </motion.div>
                )}

                <Button
                  variant="yellow"
                  onClick={next}
                  disabled={!answers[step].trim()}
                  className={step > 0 ? 'self-end' : 'self-start'}
                >
                  Next question
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <div ref={endRef} />
    </div>
  )
}

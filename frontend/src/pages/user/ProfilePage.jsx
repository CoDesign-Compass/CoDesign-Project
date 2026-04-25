import React, { useState, useEffect, useCallback } from 'react'
import CategoryTabs from '../../components/ProfilePage/CategoryTabs'
import TagSelection from '../../components/ProfilePage/TagSelection'
import SearchAndCreate from '../../components/ProfilePage/SearchAndCreate'
import { useTheme } from '../../context/ThemeContext'

const API_BASE_URL =
  (process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com') + '/api/profile'

export default function ProfilePage({ setOnNext }) {
  const [userId] = useState(() => localStorage.getItem('submissionId') || '')
  const [tags, setTags] = useState([])
  const [name, setName] = useState('')
  const [activeTab, setActiveTab] = useState('Demographics')
  const [selectedTags, setSelectedTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')

  const isDark = theme === 'dark'

  const openModal = (title, message) => {
    setModalTitle(title)
    setModalMessage(message)
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
    setModalTitle('')
    setModalMessage('')
  }

  const handleSaveAndValidate = useCallback(async () => {
    if (!userId) {
      openModal('Session Error', 'We could not find your active session. Please go back to the start page.')
      return false
    }
    if (selectedTags.length === 0) {
      openModal('Please select your tags', 'Select at least one tag before moving to the next step.')
      return false
    }
    const selectedTagIds = tags.filter((t) => selectedTags.includes(t.label)).map((t) => t.id)
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, tagIds: selectedTagIds }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return true
    } catch (error) {
      console.error('Failed to save profile:', error)
      openModal('Unable to save profile', 'There was a problem saving your profile. Please try again.')
      return false
    }
  }, [name, selectedTags, tags, userId])

  useEffect(() => {
    if (setOnNext) setOnNext(() => handleSaveAndValidate)
    return () => { if (setOnNext) setOnNext(null) }
  }, [setOnNext, handleSaveAndValidate])

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') closeModal() }
    if (showModal) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showModal])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const tagsRes = await fetch(`${API_BASE_URL}/tags`)
        const allTags = await tagsRes.json()
        setTags(allTags)
        if (userId) {
          const profileRes = await fetch(`${API_BASE_URL}/${userId}`)
          if (profileRes.ok) {
            const profile = await profileRes.json()
            setName(profile.name || '')
            setSelectedTags((profile.selectedTags || []).map((t) => t.label))
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  const handleTagClick = (tagLabel) => {
    setSelectedTags((prev) =>
      prev.includes(tagLabel) ? prev.filter((t) => t !== tagLabel) : [...prev, tagLabel],
    )
  }

  const handleCreateTag = async () => {
    if (!inputValue.trim() || !userId) return
    const colors = ['yellow', 'blue', 'red', 'purple', 'green', 'orange', 'pink']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    try {
      const response = await fetch(`${API_BASE_URL}/tags/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: inputValue.trim(), category: activeTab, color: randomColor, userId }),
      })
      if (response.ok) {
        const newTag = await response.json()
        setTags((prev) => [...prev, newTag])
        setInputValue('')
      }
    } catch (error) {
      console.error('Failed to create tag:', error)
    }
  }

  const filteredTags = tags.filter((tag) => tag.category === activeTab)

  // ── design tokens ──────────────────────────────────────────────────
  const pageBg      = isDark ? '#1e1e1e' : '#f5f5f5'
  const cardBg      = isDark ? '#272727' : '#ffffff'
  const cardBorder  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const cardShadow  = isDark ? '0 1px 6px rgba(0,0,0,0.35)' : '0 1px 6px rgba(0,0,0,0.07)'
  const textColor   = isDark ? '#f0f0f0' : '#1a1a1a'
  const subText     = isDark ? '#888' : '#777'
  const divider     = isDark ? 'rgba(255,255,255,0.07)' : '#f0f0f0'
  const inputBg     = isDark ? '#1e1e1e' : '#ffffff'
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : '#ddd'

  const card = {
    background: cardBg,
    borderRadius: 16,
    padding: 24,
    boxShadow: cardShadow,
    border: `1px solid ${cardBorder}`,
    marginBottom: 20,
  }

  if (loading) {
    return (
      <div style={{ background: pageBg, minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, fontFamily: 'Poppins, sans-serif' }}>
        <p style={{ color: subText, fontSize: 14 }}>Loading…</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ background: pageBg, minHeight: '100%', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px 40px' }}>

          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: textColor, margin: '0 0 6px' }}>
              Lived Experience Profile Builder
            </h1>
            <p style={{ fontSize: 14, color: subText, margin: 0 }}>
              Create a quick profile based on behaviours and lived experiences
            </p>
          </div>

          {/* ── Step 1: Basic Info ── */}
          <div style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#c49a00', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Step 1
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: textColor, margin: '0 0 4px' }}>Basic Info</h2>
            <p style={{ fontSize: 13, color: subText, margin: '0 0 20px' }}>Let's start with your name</p>

            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: textColor, marginBottom: 6 }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: `1.5px solid ${inputBorder}`,
                background: inputBg,
                color: textColor,
                fontSize: 14,
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#ffe071' }}
              onBlur={(e) => { e.target.style.borderColor = inputBorder }}
            />
          </div>

          {/* ── Step 2: Select Tags ── */}
          <div style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#c49a00', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Step 2
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: textColor, margin: '0 0 4px' }}>Select Tags</h2>
            <p style={{ fontSize: 13, color: subText, margin: '0 0 20px' }}>
              Choose tags that describe your behaviours and experiences
            </p>

            <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} />

            <div style={{ marginTop: 16 }}>
              <TagSelection tags={filteredTags} selectedTags={selectedTags} onTagClick={handleTagClick} />
            </div>

            {/* Selected pills */}
            {selectedTags.length > 0 && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${divider}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: subText, marginBottom: 10 }}>
                  Selected ({selectedTags.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 10px 4px 12px',
                        borderRadius: 20,
                        background: '#ffe071',
                        color: '#1a1a1a',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => handleTagClick(tag)}
                        aria-label={`Remove ${tag}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: 16,
                          lineHeight: 1,
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Step 3: Add Your Own ── */}
          <div style={card}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#c49a00', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Step 3 — Optional
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: textColor, margin: '0 0 4px' }}>Add Your Own</h2>
            <p style={{ fontSize: 13, color: subText, margin: '0 0 20px' }}>
              Can't find a suitable tag? Add your own
            </p>
            <SearchAndCreate
              inputValue={inputValue}
              onInputChange={setInputValue}
              onCreate={handleCreateTag}
              isDark={isDark}
            />
          </div>
        </div>
      </div>

      {/* Validation modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(420px, 100%)',
              background: cardBg,
              color: textColor,
              borderRadius: 14,
              padding: '22px 20px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
              border: `1px solid ${cardBorder}`,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <h2 id="profile-modal-title" style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700, color: textColor }}>
              {modalTitle}
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: 1.6, color: subText }}>
              {modalMessage}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#ffe071',
                  color: '#1a1a1a',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

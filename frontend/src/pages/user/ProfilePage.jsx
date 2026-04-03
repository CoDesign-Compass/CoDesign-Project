import React, { useState, useEffect, useCallback } from 'react'
import CategoryTabs from '../../components/ProfilePage/CategoryTabs'
import SearchAndCreate from '../../components/ProfilePage/SearchAndCreate'
import TagSelection from '../../components/ProfilePage/TagSelection'
import { useTheme } from '../../context/ThemeContext'
import '../../components/ProfilePage/ProfilePage.css'

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'https://codesign-project.onrender.com') + '/api/profile'

export default function ProfilePage({ setOnNext }) {
  // Retrieve submissionId from localStorage as the temporary userId
  const [userId] = useState(() => localStorage.getItem('submissionId') || '')
  
  const [tags, setTags] = useState([])
  const [name, setName] = useState('')
  const [activeTab, setActiveTab] = useState('Demographics')
  const [selectedTags, setSelectedTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  // new: popup/modal state
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')

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

  // 1. Define validation and save logic
  const handleSaveAndValidate = useCallback(async () => {
    if (!userId) {
      openModal(
        'Session Error',
        'We could not find your active session. Please go back to the start page.',
      )
      return false
    }

    // Validation
    if (selectedTags.length === 0) {
      openModal(
        'Please select your tags',
        'Select at least one tag before moving to the next step.',
      )
      return false // Intercept navigation
    }

    // Save logic
    const selectedTagIds = tags
      .filter((t) => selectedTags.includes(t.label))
      .map((t) => t.id)

    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          tagIds: selectedTagIds,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      console.log('Profile saved successfully via Next button.')
      return true // Allow navigation
    } catch (error) {
      console.error('Failed to save profile:', error)
      openModal(
        'Unable to save profile',
        'There was a problem saving your profile. Please try again.',
      )
      return false // Intercept navigation on error
    }
  }, [name, selectedTags, tags, userId])

  // 2. Register callback to parent Layout
  useEffect(() => {
    if (setOnNext) {
      setOnNext(() => handleSaveAndValidate)
    }
    return () => {
      if (setOnNext) setOnNext(null)
    }
  }, [setOnNext, handleSaveAndValidate])

  // close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showModal])

  // 3. Initial load for tags and user profile
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
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tagLabel)
        ? prevSelected.filter((t) => t !== tagLabel)
        : [...prevSelected, tagLabel],
    )
  }

  const handleCreateTag = async () => {
    if (!inputValue.trim() || !userId) return
    const colors = [
      'yellow',
      'blue',
      'red',
      'purple',
      'green',
      'orange',
      'pink',
    ]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    try {
      const response = await fetch(`${API_BASE_URL}/tags/custom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: inputValue.trim(),
          category: activeTab,
          color: randomColor,
          userId: userId,
        }),
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

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>

  return (
    <>
      <div className="profile-page" style={{ padding: 24 }}>
        <h1 className="main-title">Lived Experience Profile Builder</h1>

        <div className="name-input-wrapper">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="name-input"
          />
          {name && (
            <button
              onClick={() => setName('')}
              className="clear-button"
              type="button"
            >
              ×
            </button>
          )}
        </div>

        <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="content-area">
          <div className="left-panel">
            <SearchAndCreate
              inputValue={inputValue}
              onInputChange={setInputValue}
              onCreate={handleCreateTag}
            />
          </div>

          <div className="right-panel">
            <TagSelection
              tags={filteredTags}
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
            />
          </div>
        </main>
      </div>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background:
              theme === 'light' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.55)',
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
              background: theme === 'light' ? '#fff' : '#1f1f1f',
              color: theme === 'light' ? '#303030' : '#f5f5f5',
              borderRadius: 12,
              padding: '20px 18px',
              boxShadow:
                theme === 'light'
                  ? '0 12px 32px rgba(0,0,0,0.18)'
                  : '0 12px 32px rgba(0,0,0,0.45)',
              border:
                theme === 'light'
                  ? '1px solid rgba(0,0,0,0.08)'
                  : '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <h2
              id="profile-modal-title"
              style={{
                margin: '0 0 10px',
                fontSize: 20,
                lineHeight: 1.3,
                fontFamily: 'Poppins, sans-serif',
                color: theme === 'light' ? '#303030' : '#ffffff',
              }}
            >
              {modalTitle}
            </h2>

            <p
              style={{
                margin: 0,
                lineHeight: 1.6,
                fontFamily: 'Poppins, sans-serif',
                color: theme === 'light' ? '#303030' : '#e8e8e8',
              }}
            >
              {modalMessage}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 18,
              }}
            >
              <button
                type="button"
                onClick={closeModal}
                style={{
                  border:
                    theme === 'light'
                      ? '1px solid rgba(0,0,0,0.15)'
                      : '1px solid rgba(255,255,255,0.22)',
                  background: theme === 'light' ? 'transparent' : '#2a2a2a',
                  color: theme === 'light' ? '#303030' : '#f5f5f5',
                  borderRadius: 8,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
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

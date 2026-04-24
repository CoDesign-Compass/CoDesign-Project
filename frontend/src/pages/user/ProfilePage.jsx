import React, { useState, useEffect, useCallback } from 'react'
import CategoryTabs from '../../components/ProfilePage/CategoryTabs'
import SearchAndCreate from '../../components/ProfilePage/SearchAndCreate'
import TagSelection from '../../components/ProfilePage/TagSelection'
import { useTheme } from '../../context/ThemeContext'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

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

    const selectedTagIds = tags
      .filter((t) => selectedTags.includes(t.label))
      .map((t) => t.id)

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
        body: JSON.stringify({
          label: inputValue.trim(),
          category: activeTab,
          color: randomColor,
          userId,
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

  if (loading) return <div className="p-6 text-[var(--text-color)]">Loading...</div>

  const isDark = theme === 'dark'

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4 text-[var(--text-color)] font-poppins">
          Lived Experience Profile Builder
        </h1>

        <div className="relative inline-flex items-center mb-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="pr-8 w-[min(320px,100%)]"
          />
          {name && (
            <button
              onClick={() => setName('')}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 border-none bg-transparent cursor-pointer text-lg text-gray-400 leading-none"
            >
              ×
            </button>
          )}
        </div>

        <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex gap-4 mt-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <SearchAndCreate
              inputValue={inputValue}
              onInputChange={setInputValue}
              onCreate={handleCreateTag}
            />
          </div>
          <div className="flex-[2] min-w-[200px]">
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
          className="fixed inset-0 flex items-center justify-center p-4 z-[1000]"
          style={{ background: isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.35)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(420px,100%)] rounded-xl p-5 font-poppins"
            style={{
              background: isDark ? '#1f1f1f' : '#fff',
              color: isDark ? '#f5f5f5' : '#303030',
              boxShadow: isDark
                ? '0 12px 32px rgba(0,0,0,0.45)'
                : '0 12px 32px rgba(0,0,0,0.18)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <h2
              id="profile-modal-title"
              className="m-0 mb-2.5 text-xl leading-snug font-poppins"
              style={{ color: isDark ? '#fff' : '#303030' }}
            >
              {modalTitle}
            </h2>
            <p className="m-0 leading-relaxed font-poppins" style={{ color: isDark ? '#e8e8e8' : '#303030' }}>
              {modalMessage}
            </p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={closeModal}
                style={{
                  border: isDark ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(0,0,0,0.15)',
                  background: isDark ? '#2a2a2a' : 'transparent',
                  color: isDark ? '#f5f5f5' : '#303030',
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

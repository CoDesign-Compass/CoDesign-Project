import React, { useState, useEffect, useCallback } from 'react'
import CategoryTabs from '../../components/ProfilePage/CategoryTabs'
import SearchAndCreate from '../../components/ProfilePage/SearchAndCreate'
import TagSelection from '../../components/ProfilePage/TagSelection'

import '../../components/ProfilePage/ProfilePage.css'

const API_BASE_URL = 'http://localhost:8080/api/profile'
const CURRENT_USER_ID = 'dev-user' // Will be integrated with Auth module later

export default function ProfilePage({ setOnNext }) {
  const [tags, setTags] = useState([])
  const [name, setName] = useState('')
  const [activeTab, setActiveTab] = useState('Demographics')
  const [selectedTags, setSelectedTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. Define validation and save logic
  const handleSaveAndValidate = useCallback(async () => {
    // Validation
    if (selectedTags.length === 0) {
      alert("Please select your tags");
      return false; // Intercept navigation
    }

    // Save logic
    const selectedTagIds = tags
      .filter((t) => selectedTags.includes(t.label))
      .map((t) => t.id)

    try {
      await fetch(`${API_BASE_URL}/${CURRENT_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          tagIds: selectedTagIds,
        }),
      })
      console.log('Profile saved successfully via Next button.')
      return true; // Allow navigation
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Error saving profile. Please try again.')
      return false; // Intercept navigation on error
    }
  }, [name, selectedTags, tags]);

  // 2. Register callback to parent Layout
  useEffect(() => {
    if (setOnNext) {
      setOnNext(() => handleSaveAndValidate);
    }
    // Unregister callback on unmount to prevent affecting other pages
    return () => {
      if (setOnNext) setOnNext(null);
    }
  }, [setOnNext, handleSaveAndValidate]);

  // 3. Initial load for tags and user profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const tagsRes = await fetch(`${API_BASE_URL}/tags`)
        const allTags = await tagsRes.json()
        setTags(allTags)

        const profileRes = await fetch(`${API_BASE_URL}/${CURRENT_USER_ID}`)
        if (profileRes.ok) {
          const profile = await profileRes.json()
          setName(profile.name || '')
          setSelectedTags(profile.selectedTags.map((t) => t.label))
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleTagClick = (tagLabel) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tagLabel)
        ? prevSelected.filter((t) => t !== tagLabel)
        : [...prevSelected, tagLabel],
    )
  }

  const handleCreateTag = async () => {
    if (!inputValue.trim()) return
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
          userId: CURRENT_USER_ID,
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
          <button onClick={() => setName('')} className="clear-button">
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
  )
}

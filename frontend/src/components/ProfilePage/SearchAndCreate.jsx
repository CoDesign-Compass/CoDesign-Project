import React from 'react'

const SearchAndCreate = ({ inputValue, onInputChange, onCreate, isDark }) => {
  const inputBg = isDark ? '#1e1e1e' : '#ffffff'
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : '#ddd'
  const textColor = isDark ? '#f0f0f0' : '#1a1a1a'

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && inputValue.trim()) onCreate()
        }}
        placeholder="Type and press Enter…"
        style={{
          flex: 1,
          padding: '10px 14px',
          borderRadius: 10,
          border: `1.5px solid ${inputBorder}`,
          background: inputBg,
          color: textColor,
          fontSize: 14,
          fontFamily: 'Poppins, sans-serif',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => { e.target.style.borderColor = '#ffe071' }}
        onBlur={(e) => { e.target.style.borderColor = inputBorder }}
      />
      <button
        onClick={onCreate}
        disabled={!inputValue.trim()}
        style={{
          padding: '10px 20px',
          borderRadius: 10,
          border: 'none',
          background: inputValue.trim() ? '#ffe071' : '#e0e0e0',
          color: inputValue.trim() ? '#1a1a1a' : '#999',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'Poppins, sans-serif',
          cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        Add Tag
      </button>
    </div>
  )
}

export default SearchAndCreate

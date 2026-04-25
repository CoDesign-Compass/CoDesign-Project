import React from 'react'

const Tag = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '6px 12px',
      borderRadius: 20,
      border: isSelected ? '1.5px solid #d4a900' : '1px solid #ddd',
      background: isSelected ? '#ffe071' : '#f5f5f5',
      color: isSelected ? '#1a1a1a' : '#555',
      fontSize: 13,
      fontWeight: isSelected ? 600 : 400,
      fontFamily: 'Poppins, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.15s',
      boxShadow: isSelected ? '0 1px 4px rgba(255,224,113,0.5)' : 'none',
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ fontSize: 11, fontWeight: 800, lineHeight: 1 }}>
      {isSelected ? '✓' : '+'}
    </span>
    {label}
  </button>
)

export default Tag

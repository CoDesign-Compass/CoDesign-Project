import React, { useState, useEffect } from 'react'

const TABS = ['Demographics', 'Interests', 'Behaviours', 'Passions & Personality']

const CategoryTabs = ({ activeTab, setActiveTab, isDark }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 560)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 560)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const borderColor   = isDark ? 'rgba(255,255,255,0.08)' : '#e8e8e8'
  const inactiveColor = isDark ? '#777' : '#999'
  const activeColor   = isDark ? '#f0f0f0' : '#1a1a1a'
  const selectBg      = isDark ? '#1e1e1e' : 'rgba(255,224,113,0.3)'
  const selectBorder  = isDark ? 'rgba(255,255,255,0.12)' : '#ddd'

  if (isMobile) {
    return (
      <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 40px 10px 14px',
            borderRadius: 10,
            border: `1.5px solid #ffe071`,
            background: selectBg,
            color: activeColor,
            fontSize: 14,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        >
          {TABS.map((tab) => (
            <option key={tab} value={tab}>{tab}</option>
          ))}
        </select>
        <span style={{
          position: 'absolute',
          right: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          fontSize: 11,
          color: '#c49a00',
        }}>▼</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${borderColor}` }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: isActive ? '2px solid #ffe071' : '2px solid transparent',
              background: isActive ? 'rgba(255,224,113,0.3)' : 'transparent',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? activeColor : inactiveColor,
              marginBottom: -1,
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s, background 0.15s',
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryTabs

import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { shareId } = useParams()
  const [onNextHandler, setOnNextHandler] = useState(null)

  // Define page sequence
  const pages = shareId
    ? [
        `/share/${shareId}`,
        `/share/${shareId}/profile`,
        `/share/${shareId}/why`,
        `/share/${shareId}/how`,
        `/share/${shareId}/thankyou`,
      ]
    : ['/', '/profile', '/why', '/how', '/thankyou']

  const currentIndex = pages.indexOf(location.pathname)
  const { theme, toggleTheme } = useTheme()

  const goBack = () => {
    if (currentIndex > 0) {
      navigate(pages[currentIndex - 1])
    }
  }

  const goNext = async () => {
    // If the current page has registered an onNext handler (e.g., ProfilePage validation/save)
    if (onNextHandler) {
      const canNavigate = await onNextHandler();
      if (canNavigate === false) return; // Intercept navigation
    }

    if (currentIndex < pages.length - 1) {
      navigate(pages[currentIndex + 1])
    }
  }

  // Pass setOnNextHandler to child components
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setOnNext: setOnNextHandler });
    }
    return child;
  });

  return (
    <div className="app-layout" style={{ fontFamily: 'sans-serif' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '1rem',
        }}
      >
        <img
          src={theme === 'light' ? '/logo_light.png' : '/logo_dark.png'}
          alt="Purpose Media Logo"
          style={{ height: '60px' }}
        />
        <button
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            right: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #d8d8d8',
            background: 'transparent',
            color: 'var(--text-color)',
            cursor: 'pointer',
          }}
        >
          <img
            src={theme === 'light' ? '/light_mode.png' : '/dark_mode.png'}
            alt="Mode Icon"
            style={{ height: '30px' }}
          />
        </button>
      </header>

      <main style={{ minHeight: '70vh' }}>{childrenWithProps}</main>

      <footer
        style={{
          backgroundColor: theme === 'light' ? 'white' : '#303030',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* Back Button (hidden on first page) */}
        {currentIndex > 0 ? (
          <button
            onClick={goBack}
            style={{
              background: theme === 'light' ? 'black' : 'white',
              color: theme === 'light' ? 'white' : 'black',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        ) : (
          <div></div>
        )}

        {/* Next Button (hidden on last page) */}
        {currentIndex >= 0 && currentIndex < pages.length - 1 ? (
          <button
            onClick={goNext}
            style={{
              background: theme === 'light' ? 'black' : 'white',
              color: theme === 'light' ? 'white' : 'black',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Next →
          </button>
        ) : (
          <div></div>
        )}
      </footer>
    </div>
  )
}

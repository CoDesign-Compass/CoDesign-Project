import { createContext, useContext, useState } from 'react'

const IssueContext = createContext(null)

export function IssueProvider({ children }) {
  const [issueId, setIssueIdState] = useState(() => {
    const saved = localStorage.getItem('issueId')
    return saved ? Number(saved) : null
  })

  const [shareId, setShareIdState] = useState(() => {
    return localStorage.getItem('shareId') || null
  })

  const [issueContent, setIssueContentState] = useState(() => {
    return localStorage.getItem('issueContent') || ''
  })

  const setIssueId = (id) => {
    setIssueIdState(id)
    if (id === null || id === undefined) {
      localStorage.removeItem('issueId')
    } else {
      localStorage.setItem('issueId', String(id))
    }
  }

  const setShareId = (id) => {
    setShareIdState(id)
    if (!id) {
      localStorage.removeItem('shareId')
    } else {
      localStorage.setItem('shareId', id)
    }
  }

  const setIssueContent = (content) => {
    setIssueContentState(content)
    if (!content) {
      localStorage.removeItem('issueContent')
    } else {
      localStorage.setItem('issueContent', content)
    }
  }

  const clearIssueContext = () => {
    setIssueIdState(null)
    setShareIdState(null)
    setIssueContentState('')
    localStorage.removeItem('issueId')
    localStorage.removeItem('shareId')
    localStorage.removeItem('issueContent')
  }

  return (
    <IssueContext.Provider
      value={{
        issueId,
        shareId,
        issueContent,
        setIssueId,
        setShareId,
        setIssueContent,
        clearIssueContext,
      }}
    >
      {children}
    </IssueContext.Provider>
  )
}

export function useIssue() {
  const context = useContext(IssueContext)
  if (!context) {
    throw new Error('useIssue must be used within an IssueProvider')
  }
  return context
}

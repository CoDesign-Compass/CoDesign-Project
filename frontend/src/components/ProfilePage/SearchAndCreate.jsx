// SearchAndCreate.jsx
import React from 'react'

const SearchAndCreate = ({ inputValue, onInputChange, onCreate }) => {
  return (
    <div className="search-create-box">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Press Enter to create new tag"
          className="search-input"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim() !== '') {
              onCreate()
            }
          }}
        />
      </div>
    </div>
  )
}

export default SearchAndCreate

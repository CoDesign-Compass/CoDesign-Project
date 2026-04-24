import React from 'react'
import { Input } from '../ui/input'

const SearchAndCreate = ({ inputValue, onInputChange, onCreate }) => {
  return (
    <div className="rounded-xl bg-[#fdf8ec] border border-[#f0e6b8] p-4">
      <Input
        type="text"
        placeholder="Press Enter to create new tag"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && inputValue.trim() !== '') onCreate()
        }}
        className="bg-white"
      />
    </div>
  )
}

export default SearchAndCreate

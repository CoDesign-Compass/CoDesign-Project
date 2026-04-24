import React from 'react'
import { cn } from '../../lib/utils'

const COLOR_MAP = {
  yellow: 'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200',
  blue: 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200',
  red: 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200',
  purple: 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200',
  green: 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200',
  orange: 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200',
  pink: 'bg-pink-100 border-pink-300 text-pink-900 hover:bg-pink-200',
  default: 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200',
}

const SELECTED_MAP = {
  yellow: 'bg-yellow-300 border-yellow-500 text-yellow-950',
  blue: 'bg-blue-300 border-blue-500 text-blue-950',
  red: 'bg-red-300 border-red-500 text-red-950',
  purple: 'bg-purple-300 border-purple-500 text-purple-950',
  green: 'bg-green-300 border-green-500 text-green-950',
  orange: 'bg-orange-300 border-orange-500 text-orange-950',
  pink: 'bg-pink-300 border-pink-500 text-pink-950',
  default: 'bg-gray-300 border-gray-500 text-gray-950',
}

const Tag = ({ label, color = 'default', isSelected, onClick }) => {
  const baseColor = COLOR_MAP[color] || COLOR_MAP.default
  const selectedColor = SELECTED_MAP[color] || SELECTED_MAP.default

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-all',
        isSelected ? selectedColor : baseColor,
        isSelected && 'shadow-sm scale-[1.02]',
      )}
    >
      {isSelected && <span className="text-xs font-black">✓</span>}
      {label}
    </button>
  )
}

export default Tag

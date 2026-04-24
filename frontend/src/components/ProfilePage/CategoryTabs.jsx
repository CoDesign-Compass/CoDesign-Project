import React from 'react'
import { FaUser, FaHeart, FaChartLine, FaStar } from 'react-icons/fa'
import { cn } from '../../lib/utils'

const TABS_DATA = [
  { label: 'Demographics', icon: <FaUser size={20} /> },
  { label: 'Interests', icon: <FaHeart size={20} /> },
  { label: 'Behaviours', icon: <FaChartLine size={20} /> },
  { label: 'Passions & Personality', icon: <FaStar size={20} /> },
]

const CategoryTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-2 flex-wrap my-4">
      {TABS_DATA.map((tab) => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(tab.label)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border font-poppins text-sm font-medium transition-all cursor-pointer',
            activeTab === tab.label
              ? 'bg-compass-purple text-white border-compass-purple shadow-sm'
              : 'bg-transparent border-gray-300 text-[var(--text-color)] hover:border-compass-purple hover:text-compass-purple',
          )}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs

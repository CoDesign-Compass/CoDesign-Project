import React from 'react';

import { FaUser, FaHeart, FaChartLine, FaStar } from 'react-icons/fa';


const TABS_DATA = [
  { label: 'Demographics', icon: <FaUser size={24} /> },
  { label: 'Interests', icon: <FaHeart size={24} /> },
  { label: 'Behaviours', icon: <FaChartLine size={24} /> },
  { label: 'Passions & Personality', icon: <FaStar size={24} /> },
];

const CategoryTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="category-tabs-container">
      {TABS_DATA.map((tab) => (
        <button
          key={tab.label}

          className={`tab-item ${activeTab === tab.label ? 'active' : ''}`}

          onClick={() => setActiveTab(tab.label)}
        >
          <div className="tab-icon-wrapper">
            {tab.icon}
          </div>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
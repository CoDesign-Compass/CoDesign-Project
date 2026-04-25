import React from 'react'
import Tag from './Tag'

const TagSelection = ({ tags, selectedTags, onTagClick }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 40 }}>
    {tags.length === 0 ? (
      <p style={{ fontSize: 13, color: '#999', fontFamily: 'Poppins, sans-serif', margin: 0 }}>
        No tags in this category yet.
      </p>
    ) : (
      tags.map((tag) => (
        <Tag
          key={tag.id}
          label={tag.label}
          isSelected={selectedTags.includes(tag.label)}
          onClick={() => onTagClick(tag.label)}
        />
      ))
    )}
  </div>
)

export default TagSelection

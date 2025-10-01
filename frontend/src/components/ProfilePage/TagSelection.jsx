import React from "react";
import Tag from "./Tag";

const TagSelection = ({ tags, selectedTags, onTagClick }) => {
  return (
    <div className="tag-grid">
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          label={tag.label}
          color={tag.color}
          isSelected={selectedTags.includes(tag.label)}
          onClick={() => onTagClick(tag.label)}
        />
      ))}
    </div>
  );
};

export default TagSelection;

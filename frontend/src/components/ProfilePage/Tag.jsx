import React from "react";

const Tag = ({ label, color = "default", isSelected, onClick }) => {
  // 根据isSelected状态和颜色prop生成class
  const className = `tag tag-color-${color} ${isSelected ? "selected" : ""}`;

  return (
    <button className={className} onClick={onClick}>
      {isSelected && <span className="checkmark">✓</span>}
      {label}
    </button>
  );
};

export default Tag;

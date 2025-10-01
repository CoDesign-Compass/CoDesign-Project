import React, { useMemo } from "react";

const COLORS = ["yellow", "blue", "red", "purple", "green", "pink", "teal"];

const Tag = ({ label, color, isSelected, onClick }) => {
  // 如果没指定颜色，随机分配
  const assignedColor = useMemo(() => {
    if (color) return color;
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex];
  }, [color]);

  const className = `tag ${
    isSelected ? "selected" : ""
  } tag-color-${assignedColor}`;

  return (
    <button className={className} onClick={onClick}>
      {isSelected && <span className="checkmark">✓</span>}
      {label}
    </button>
  );
};

export default Tag;

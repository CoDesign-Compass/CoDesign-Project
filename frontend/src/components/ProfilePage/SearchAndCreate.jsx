import React from "react";

const SearchAndCreate = () => {
  const menuItems = [
    "mental health",
    "disability rights",
    "aged care",
    "elder support",
  ];
  return (
    <div className="search-create-box">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search & Create"
          className="search-input"
        />
        <span className="search-clear">×</span>
      </div>
      <ul className="search-results">
        {menuItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchAndCreate;

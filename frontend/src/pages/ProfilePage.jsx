import React, { useState } from "react";

import CategoryTabs from "../components/ProfilePage/CategoryTabs";
import SearchAndCreate from "../components/ProfilePage/SearchAndCreate";
import TagSelection from "../components/ProfilePage/TagSelection";

import "../components/ProfilePage/ProfilePage.css";

const initialTags = [
  { id: 1, label: "carer", category: "Demographics" },
  { id: 2, label: "First Nations person", category: "Demographics" },
  { id: 3, label: "LGBTQIA+", category: "Demographics" },
  { id: 4, label: "Label1", category: "Demographics" },
  { id: 5, label: "Label2", category: "Demographics" },
  { id: 6, label: "Label3", category: "Demographics" },
  { id: 7, label: "Label4", category: "Demographics" },
  { id: 8, label: "Label5", category: "Demographics" },
  { id: 9, label: "Label6", category: "Demographics" },
  { id: 10, label: "Label7", category: "Demographics" },
  { id: 11, label: "Label8", category: "Demographics" },
  { id: 12, label: "Label9", category: "Demographics" },
  { id: 13, label: "Label10", category: "Demographics" },
  { id: 14, label: "Label11", category: "Demographics" },
];

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("Demographics");
  const [selectedTags, setSelectedTags] = useState(["carer"]);

  const handleTagClick = (tagLabel) => {
    setSelectedTags((prevSelected) => {
      if (prevSelected.includes(tagLabel)) {
        return prevSelected.filter((t) => t !== tagLabel);
      } else {
        return [...prevSelected, tagLabel];
      }
    });
  };

  const filteredTags = initialTags.filter((tag) => tag.category === activeTab);

  return (
    <div className="profile-page" style={{ padding: 24 }}>
      <h1 className="main-title">Lived Experience Profile Builder</h1>
      <div className="top-bar">
        <div className="name-input-wrapper">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="name-input"
          />
          {name && (
            <button onClick={() => setName("")} className="clear-button">
              ×
            </button>
          )}
        </div>
        <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="search-tags-row">
        <div className="search-box">
          <SearchAndCreate />
        </div>
        <div className="tags-box">
          <TagSelection
            tags={filteredTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
        </div>
      </div>
    </div>
  );
}

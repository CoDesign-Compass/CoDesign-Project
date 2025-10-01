import { Link } from "react-router-dom";
import React, { useState } from "react";

import CategoryTabs from "../components/ProfilePage/CategoryTabs";
import SearchAndCreate from "../components/ProfilePage/SearchAndCreate";
import TagSelection from "../components/ProfilePage/TagSelection";

import "../components/ProfilePage/ProfilePage.css";

const initialTags = [
  { id: 1, label: "carer", category: "Demographics" },
  { id: 2, label: "First Nations person", category: "Demographics" },
  { id: 3, label: "LGBTQIA+", category: "Demographics" },
  { id: 4, label: "Label", category: "Demographics", color: "yellow" },
  { id: 5, label: "Label", category: "Demographics", color: "blue" },
  { id: 6, label: "Label", category: "Demographics", color: "red" },
  { id: 7, label: "Label", category: "Demographics", color: "purple" },
];

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState("Demographics");
  const [selectedTags, setSelectedTags] = useState(["carer"]);
  const handleTagClick = (tagLabel) => {
    setSelectedTags((prevSelected) => {
      if (prevSelected.includes(tagLabel)) {
        return prevSelected.filter((t) => t !== tagLabel); // 如果已选中，则取消选中
      } else {
        return [...prevSelected, tagLabel]; // 如果未选中，则添加
      }
    });
  };

  const filteredTags = initialTags.filter((tag) => tag.category === activeTab);

  return (
    <div className="profile-page" style={{ padding: 24 }}>
      <h1 className="main-title">Lived Experience Profile Builder</h1>

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

      <main className="content-area">
        <div className="left-panel">
          <SearchAndCreate />
        </div>
        <div className="right-panel">
          <TagSelection
            tags={filteredTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
        </div>
      </main>
    </div>
  );
}

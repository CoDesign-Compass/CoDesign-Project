import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useIssue } from '../../context/IssueContext'

import CategoryTabs from '../../components/ProfilePage/CategoryTabs'
import SearchAndCreate from '../../components/ProfilePage/SearchAndCreate'
import TagSelection from '../../components/ProfilePage/TagSelection'

import '../../components/ProfilePage/ProfilePage.css'

const COLORS = ['yellow', 'blue', 'red', 'purple', 'green', 'orange', 'pink']

const baseTags = [
  // Demographics
  { id: 1, label: 'carer', category: 'Demographics' },
  { id: 2, label: 'First Nations person', category: 'Demographics' },
  { id: 3, label: 'LGBTQIA+', category: 'Demographics' },
  { id: 4, label: 'Label', category: 'Demographics' },
  { id: 5, label: 'Label1', category: 'Demographics' },
  { id: 6, label: 'Label2', category: 'Demographics' },
  { id: 7, label: 'Label3', category: 'Demographics' },
  { id: 8, label: 'Label4', category: 'Demographics' },
  { id: 9, label: 'Label5', category: 'Demographics' },
  { id: 10, label: 'Label6', category: 'Demographics' },
  { id: 11, label: 'Label7', category: 'Demographics' },
  { id: 12, label: 'Label8', category: 'Demographics' },
  { id: 13, label: 'Label9', category: 'Demographics' },
  { id: 14, label: 'Label10', category: 'Demographics' },

  // Interests
  { id: 15, label: 'Art & Design', category: 'Interests' },
  { id: 16, label: 'Sports & Fitness', category: 'Interests' },
  { id: 17, label: 'Technology', category: 'Interests' },
  { id: 18, label: 'Travel', category: 'Interests' },

  // Behaviours
  { id: 19, label: 'Early adopter', category: 'Behaviours' },
  { id: 20, label: 'Environmentally conscious', category: 'Behaviours' },
  { id: 21, label: 'Community volunteer', category: 'Behaviours' },

  // Passions & Personality
  { id: 22, label: 'Creative', category: 'Passions & Personality' },
  { id: 23, label: 'Analytical', category: 'Passions & Personality' },
  { id: 24, label: 'Adventurous', category: 'Passions & Personality' },
  { id: 25, label: 'Empathetic', category: 'Passions & Personality' },
]

// const initialTags = baseTags.map((tag) => ({
//   ...tag,
//   color: COLORS[Math.floor(Math.random() * COLORS.length)],
// }));

export default function ProfilePage() {
  const { shareId: routeShareId } = useParams()
  const { setShareId } = useIssue()

  const [tags, setTags] = useState(
    baseTags.map((t) => ({
      ...t,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })),
  )

  useEffect(() => {
    if (routeShareId) {
      setShareId(routeShareId)
    }
  }, [routeShareId, setShareId])

  const [name, setName] = useState('')
  const [activeTab, setActiveTab] = useState('Demographics')
  const [selectedTags, setSelectedTags] = useState(['carer'])

  const [inputValue, setInputValue] = useState('')

  const handleTagClick = (tagLabel) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tagLabel)
        ? prevSelected.filter((t) => t !== tagLabel)
        : [...prevSelected, tagLabel],
    )
  }

  // 创建新 Tag
  const handleCreateTag = () => {
    if (!inputValue.trim()) return
    const newTag = {
      id: tags.length + 1,
      label: inputValue.trim(),
      category: activeTab,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
    setTags([...tags, newTag])
    setInputValue('')
  }
  const filteredTags = tags.filter((tag) => tag.category === activeTab)

  // const filteredTags = initialTags.filter((tag) => tag.category === activeTab);

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
          <button onClick={() => setName('')} className="clear-button">
            ×
          </button>
        )}
      </div>

      <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="content-area">
        <div className="left-panel">
          <SearchAndCreate
            inputValue={inputValue}
            onInputChange={setInputValue}
            onCreate={handleCreateTag}
          />
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
  )
}

// export default function ProfilePage() {
//   const [name, setName] = useState("");
//   const [activeTab, setActiveTab] = useState("Demographics");
//   const [selectedTags, setSelectedTags] = useState(["carer"]);
//   const handleTagClick = (tagLabel) => {
//     setSelectedTags((prevSelected) => {
//       if (prevSelected.includes(tagLabel)) {
//         return prevSelected.filter((t) => t !== tagLabel);
//       } else {
//         return [...prevSelected, tagLabel];
//       }
//     });
//   };

//   const filteredTags = initialTags.filter((tag) => tag.category === activeTab);

//   return (
//     <div className="profile-page" style={{ padding: 24 }}>
//       <h1 className="main-title">Lived Experience Profile Builder</h1>

//       <div className="name-input-wrapper">
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Name"
//           className="name-input"
//         />
//         {name && (
//           <button onClick={() => setName("")} className="clear-button">
//             ×
//           </button>
//         )}
//       </div>

//       <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

//       <main className="content-area">
//         <div className="left-panel">
//           <SearchAndCreate />
//         </div>
//         <div className="right-panel">
//           <TagSelection
//             tags={filteredTags}
//             selectedTags={selectedTags}
//             onTagClick={handleTagClick}
//           />
//         </div>
//       </main>
//     </div>
//   );
// }

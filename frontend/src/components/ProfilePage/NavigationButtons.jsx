import React from "react";

const NavigationButtons = ({ onNext }) => {
  return (
    <div className="navigation-buttons-container" style={{ 
      display: "flex", 
      justifyContent: "center", 
      marginTop: "40px",
      paddingBottom: "40px"
    }}>
      <button
        onClick={onNext}
        className="next-button"
        style={{
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '12px 64px',
          borderRadius: '9999px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        Next →
      </button>
    </div>
  );
};

export default NavigationButtons;

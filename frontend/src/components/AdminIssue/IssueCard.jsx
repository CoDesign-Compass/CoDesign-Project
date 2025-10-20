import React from "react";
import "./IssueCard.css";

export default function IssueCard({ title, keywords, content }) {
  return (
    <div className="issue-card">
      <div className="issue-card-inner">
        <img
          src="https://placehold.co/80x80"
          alt={title}
          className="issue-card-img"
        />
        <div className="issue-card-text">
          <h3 className="issue-card-title">{title}</h3>
          <p className="issue-card-keywords">{keywords}</p>
          <p className="issue-card-content">{content}</p>
        </div>
        <div className="issue-card-icon" />
      </div>
      <div className="divider" />
    </div>
  );
}

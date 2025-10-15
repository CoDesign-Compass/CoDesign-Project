import React from "react";
import "./IssueCard.css";

export default function IssueHeader() {
  return (
    <div className="issue-header">
      <div className="issue-header-image">
        <img
          src="https://placehold.co/768x224"
          alt="Issue cover"
          className="issue-header-bg"
        />
        <div className="issue-header-overlay">
          <div>
            <h1 className="issue-header-title">Issue1</h1>
            <p className="issue-header-sub">Issue Type</p>
          </div>
          <div className="issue-header-buttons">
            <button className="info-btn">Issue close date</button>
            <button className="info-btn">Number of answers</button>
          </div>
        </div>
      </div>

      <div className="view-toggle">
        <button className="view-btn active">List</button>
        <button className="view-btn">Icon</button>
      </div>
    </div>
  );
}

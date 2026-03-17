import React from "react";
import { useParams } from "react-router-dom";
import IssueHeader from "../../components/AdminIssue/IssueHeader";
import IssueCard from "../../components/AdminIssue/IssueCard";
import "../../components/AdminIssue/IssueReport.css";

export default function IssueReport() {
  const { issueId } = useParams();
  const reports = [
    {
      title: "Profile Report",
      keywords: "Key Word • Key Word • Key Word",
      content: "Analysis Content...",
    },
    {
      title: "Why Report",
      keywords: "Key Word • Key Word • Key Word",
      content: "Analysis Content...",
    },
    {
      title: "How Report",
      keywords: "Key Word • Key Word • Key Word",
      content: "Analysis Content...",
    },
    {
      title: "Engagement & Response Quality Analysis",
      keywords: "Key Word • Key Word • Key Word",
      content: "Analysis Content...",
    },
  ];

  return (
    <div className="issue-container">
      <main className="main-content">
        <IssueHeader />
        {issueId && (
          <div style={{ padding: '20px', marginBottom: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
            <h2>Issue Report - ID: {issueId}</h2>
            <p style={{ marginTop: '10px', color: '#666' }}>Report content coming soon...</p>
          </div>
        )}
        {reports.map((r, i) => (
          <IssueCard
            key={i}
            title={r.title}
            keywords={r.keywords}
            content={r.content}
          />
        ))}
      </main>
    </div>
  );
}

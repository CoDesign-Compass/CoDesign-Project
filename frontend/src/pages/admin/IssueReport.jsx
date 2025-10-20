import React from "react";
import IssueHeader from "../../components/AdminIssue/IssueHeader";
import IssueCard from "../../components/AdminIssue/IssueCard";
import "../../components/AdminIssue/IssueReport.css";

export default function IssueReport() {
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

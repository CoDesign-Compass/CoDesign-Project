package com.example.demo.ai;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ai_reports")
public class AiReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long submissionId;
    private Long issueId;

    @Column(length = 100)
    private String shareId;

    @Column(length = 100)
    private String model;

    @Column(length = 50)
    private String promptVersion;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String rawOutput;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String parsedReportJson;

    private Instant createdAt;

    public Long getId() { return id; }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }

    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }

    public String getShareId() { return shareId; }
    public void setShareId(String shareId) { this.shareId = shareId; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getPromptVersion() { return promptVersion; }
    public void setPromptVersion(String promptVersion) { this.promptVersion = promptVersion; }

    public String getRawOutput() { return rawOutput; }
    public void setRawOutput(String rawOutput) { this.rawOutput = rawOutput; }

    public String getParsedReportJson() { return parsedReportJson; }
    public void setParsedReportJson(String parsedReportJson) { this.parsedReportJson = parsedReportJson; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

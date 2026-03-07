package com.example.demo.helper;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "help_requests")
public class HelpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="created_at", nullable=false)
    private OffsetDateTime createdAt;

    @Column(nullable=false)
    private String email;

    @Column(nullable=false, columnDefinition = "TEXT")
    private String message;

    @Column(name="share_id")
    private String shareId;

    @Column(name="issue_id")
    private Long issueId;

    @Column(name="submission_id")
    private Long submissionId;

    @Column(name="user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name="page_path", columnDefinition = "TEXT")
    private String pagePath;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    // ===== getters / setters =====
    public Long getId() { return id; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getShareId() { return shareId; }
    public void setShareId(String shareId) { this.shareId = shareId; }

    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getPagePath() { return pagePath; }
    public void setPagePath(String pagePath) { this.pagePath = pagePath; }
}
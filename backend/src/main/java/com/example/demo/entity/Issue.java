package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "issues")
public class Issue {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long issueId;

  @Column(nullable = false, unique = true, length = 64)
  private String shareId;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String issueContent;

  @Column(columnDefinition = "TEXT")
  private String consentText;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private IssueState state;

  @Column(nullable = false)
  private OffsetDateTime publishedAt;

  public Long getIssueId() {
    return issueId;
  }

  public void setIssueId(Long issueId) {
    this.issueId = issueId;
  }

  public String getShareId() {
    return shareId;
  }

  public void setShareId(String shareId) {
    this.shareId = shareId;
  }

  public String getIssueContent() {
    return issueContent;
  }

  public void setIssueContent(String issueContent) {
    this.issueContent = issueContent;
  }

  public String getConsentText() {
    return consentText;
  }

  public void setConsentText(String consentText) {
    this.consentText = consentText;
  }

  public IssueState getState() {
    return state;
  }

  public void setState(IssueState state) {
    this.state = state;
  }

  public OffsetDateTime getPublishedAt() {
    return publishedAt;
  }

  public void setPublishedAt(OffsetDateTime publishedAt) {
    this.publishedAt = publishedAt;
  }
}
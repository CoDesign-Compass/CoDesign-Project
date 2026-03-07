package com.example.demo.dto;

import com.example.demo.entity.IssueState;
import java.time.OffsetDateTime;

public class IssueResponse {
  private Long issueId;
  private String shareId;
  private String issueContent;
  private IssueState state;
  private OffsetDateTime publishedAt;

  public IssueResponse(Long issueId, String shareId, String issueContent, IssueState state, OffsetDateTime publishedAt) {
      this.issueId = issueId;
      this.shareId = shareId;
      this.issueContent = issueContent;
      this.state = state;
      this.publishedAt = publishedAt;
  }

  public Long getIssueId() {
      return issueId;
  }

  public String getShareId() {
      return shareId;
  }

  public String getIssueContent() {
      return issueContent;
  }

  public IssueState getState() {
      return state;
  }

  public OffsetDateTime getPublishedAt() {
      return publishedAt;
  }
}

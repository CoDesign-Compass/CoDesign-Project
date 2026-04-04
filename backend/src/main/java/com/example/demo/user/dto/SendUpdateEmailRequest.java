package com.example.demo.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SendUpdateEmailRequest {
  @NotNull(message = "issueId is required")
  private Long issueId;

  @NotBlank(message = "template is required")
  private String template;

  public Long getIssueId() {
    return issueId;
  }

  public void setIssueId(Long issueId) {
    this.issueId = issueId;
  }

  public String getTemplate() {
    return template;
  }

  public void setTemplate(String template) {
    this.template = template;
  }
}

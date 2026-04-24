package com.example.demo.dto;

public class CreateIssueRequest {
  private String issueContent;
  private String consentText;


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
}

package com.example.demo.submission.dto;

import jakarta.validation.constraints.NotNull;

public class CreateSubmissionRequest {
    @NotNull
    private Long issueId;

    public Long getIssueId(){ return issueId;}
    public void setIssueId(Long issueid){this.issueId = issueid;}
    
}

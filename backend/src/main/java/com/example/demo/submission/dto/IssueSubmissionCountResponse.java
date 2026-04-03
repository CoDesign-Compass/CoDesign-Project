package com.example.demo.submission.dto;

public class IssueSubmissionCountResponse {
    private Long issueId;
    private String issueContent;
    private long count;

    public IssueSubmissionCountResponse(Long issueId, String issueContent, long count) {
        this.issueId = issueId;
        this.issueContent = issueContent;
        this.count = count;
    }

    public Long getIssueId() {
        return issueId;
    }

    public String getIssueContent() {
        return issueContent;
    }

    public long getCount() {
        return count;
    }
}

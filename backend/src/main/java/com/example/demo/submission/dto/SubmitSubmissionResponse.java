package com.example.demo.submission.dto;

import java.time.LocalDateTime;

public class SubmitSubmissionResponse {
    private Long id;
    private String status;
    private LocalDateTime submittedAt;

    public SubmitSubmissionResponse(Long id, String status, LocalDateTime submittedAt) {
        this.id = id;
        this.status = status;
        this.submittedAt = submittedAt;
    }

    public Long getId() { return id; }
    public String getStatus() { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
}
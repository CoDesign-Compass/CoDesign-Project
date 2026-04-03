package com.example.demo.helper;

public record AiSupportChatRequest(
        String message,
        String shareId,
        Long issueId,
        Long submissionId,
        String pagePath
) {}
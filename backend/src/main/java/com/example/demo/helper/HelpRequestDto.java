package com.example.demo.helper;

public record HelpRequestDto(
        String email,
        String message,
        String shareId,
        Long issueId,
        Long submissionId,
        String pagePath
) {}

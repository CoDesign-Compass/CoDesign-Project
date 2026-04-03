package com.example.demo.helper;

import com.example.demo.ai.ClaudeClient;
import com.example.demo.ai.claude.ClaudeMessageRequest;
import com.example.demo.ai.claude.ClaudeMessageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class AiSupportService {

    private final ClaudeClient claudeClient;

    @Value("${anthropic.model}")
    private String anthropicModel;

    @Value("${anthropic.max-tokens:512}")
    private Integer maxTokens;

    public AiSupportService(ClaudeClient claudeClient) {
        this.claudeClient = claudeClient;
    }

    public String chat(AiSupportChatRequest dto) {
        if (dto.message() == null || dto.message().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "message required");
        }

        String systemPrompt = """
You are an AI support assistant for a feedback and issue-reporting web app.

Your job:
- Answer user questions about how to use the website
- Explain page flow clearly and briefly
- Help with login, account creation, issue sharing, why/how feedback flow, and submission process
- Use the provided page context when relevant
- If you are unsure, say so instead of inventing details
- Keep answers concise, clear, and friendly
""";

        String userPrompt = """
User question:
%s

Context:
- shareId: %s
- issueId: %s
- submissionId: %s
- pagePath: %s
""".formatted(
                dto.message().trim(),
                safe(dto.shareId()),
                dto.issueId() == null ? "" : dto.issueId(),
                dto.submissionId() == null ? "" : dto.submissionId(),
                safe(dto.pagePath())
        );

        ClaudeMessageRequest request = new ClaudeMessageRequest();
        request.setModel(anthropicModel);
        request.setMax_tokens(maxTokens == null ? 512 : maxTokens);
        request.setSystem(systemPrompt);
        request.setMessages(List.of(
                Map.of(
                        "role", "user",
                        "content", userPrompt
                )
        ));

        ClaudeMessageResponse response = claudeClient.chat(request);

        if (response == null || response.getContent() == null || response.getContent().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Claude returned empty response");
        }

        String reply = response.getContent().stream()
                .map(ClaudeMessageResponse.Content::getText)
                .filter(text -> text != null && !text.isBlank())
                .findFirst()
                .orElse("");

        if (reply.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Claude returned no text reply");
        }

        return reply.trim();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
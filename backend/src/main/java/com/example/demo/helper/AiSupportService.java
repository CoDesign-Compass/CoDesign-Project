package com.example.demo.helper;

import com.example.demo.ai.ClaudeClient;
import com.example.demo.ai.claude.ClaudeMessageRequest;
import com.example.demo.ai.claude.ClaudeMessageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class AiSupportService {

    private final ClaudeClient claudeClient;
    private final AiSupportLogRepository aiSupportLogRepository;

    @Value("${anthropic.model}")
    private String anthropicModel;

    @Value("${anthropic.max-tokens:512}")
    private Integer maxTokens;

    public AiSupportService(
            ClaudeClient claudeClient,
            AiSupportLogRepository aiSupportLogRepository
    ) {
        this.claudeClient = claudeClient;
        this.aiSupportLogRepository = aiSupportLogRepository;
    }

    public String chat(AiSupportChatRequest dto) {
        if (dto.message() == null || dto.message().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "message required");
        }

        AiSupportLog log = new AiSupportLog();
        log.setMessage(dto.message().trim());
        log.setShareId(dto.shareId());
        log.setIssueId(dto.issueId());
        log.setSubmissionId(dto.submissionId());
        log.setPagePath(dto.pagePath());
        log.setSuccess(false);

        log = aiSupportLogRepository.save(log);

        try {
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

            log.setResponse(reply.trim());
            log.setSuccess(true);
            log.setErrorMessage(null);
            aiSupportLogRepository.save(log);

            return reply.trim();

        } catch (Exception ex) {
            log.setSuccess(false);
            log.setErrorMessage(ex.getMessage());
            aiSupportLogRepository.save(log);
            throw ex;
        }
    }

    public String exportLogsAsCsv() {
        List<AiSupportLog> logs = aiSupportLogRepository.findAll(
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        StringBuilder sb = new StringBuilder();
        sb.append("id,message,response,shareId,issueId,submissionId,pagePath,success,errorMessage,createdAt,updatedAt\n");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (AiSupportLog log : logs) {
            sb.append(csv(log.getId())).append(",");
            sb.append(csv(log.getMessage())).append(",");
            sb.append(csv(log.getResponse())).append(",");
            sb.append(csv(log.getShareId())).append(",");
            sb.append(csv(log.getIssueId())).append(",");
            sb.append(csv(log.getSubmissionId())).append(",");
            sb.append(csv(log.getPagePath())).append(",");
            sb.append(csv(log.getSuccess())).append(",");
            sb.append(csv(log.getErrorMessage())).append(",");
            sb.append(csv(log.getCreatedAt() == null ? null : log.getCreatedAt().format(formatter))).append(",");
            sb.append(csv(log.getUpdatedAt() == null ? null : log.getUpdatedAt().format(formatter))).append("\n");
        }

        return sb.toString();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String csv(Object value) {
        if (value == null) {
            return "\"\"";
        }

        String text = String.valueOf(value).replace("\"", "\"\"");
        return "\"" + text + "\"";
    }
}
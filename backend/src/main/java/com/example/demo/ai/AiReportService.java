package com.example.demo.ai;

import com.example.demo.ai.dto.AiReportResponse;
import com.example.demo.ai.ollama.OllamaChatRequest;
import com.example.demo.ai.ollama.OllamaChatResponse;
import com.example.demo.entity.Issue;
import com.example.demo.repository.IssueRepository;
import com.example.demo.submission.Submission;
import com.example.demo.submission.SubmissionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class AiReportService {

    private final OllamaClient ollamaClient;
    private final ObjectMapper objectMapper;
    private final AiReportRepository aiReportRepository;
    private final SubmissionRepository submissionRepository;
    private final IssueRepository issueRepository;

    @Value("${ollama.model}")
    private String ollamaModel;

    public AiReportService(
            OllamaClient ollamaClient,
            ObjectMapper objectMapper,
            AiReportRepository aiReportRepository,
            SubmissionRepository submissionRepository,
            IssueRepository issueRepository
    ) {
        this.ollamaClient = ollamaClient;
        this.objectMapper = objectMapper;
        this.aiReportRepository = aiReportRepository;
        this.submissionRepository = submissionRepository;
        this.issueRepository = issueRepository;
    }

    public AiReportResponse generateReport(Long submissionId) {
        if (submissionId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "submissionId is required");
        }

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Submission not found"));

        Long issueId = submission.getIssueId();

        Issue issue = null;
        String shareId = null;
        if (issueId != null) {
            issue = issueRepository.findById(issueId).orElse(null);
            if (issue != null) {
                shareId = issue.getShareId();
            }
        }

        String inputText = buildInputText(submission, issue);

        String schemaInstruction = """
Return only valid JSON matching this schema:
{
  "title": "string",
  "summary": "string",
  "keyInsights": [
    {
      "insight": "string",
      "evidence": ["string"],
      "confidence": 0.0
    }
  ],
  "themes": [
    {
      "theme": "string",
      "why": ["string"],
      "how": ["string"],
      "painPoints": ["string"],
      "opportunities": ["string"]
    }
  ],
  "recommendations": [
    {
      "recommendation": "string",
      "rationale": "string",
      "priority": "HIGH|MEDIUM|LOW"
    }
  ],
  "risksAndLimitations": ["string"],
  "metadata": {
    "model": "string",
    "generatedAt": "string"
  }
}
Do not use markdown.
Do not wrap JSON in code fences.
If information is missing, use empty arrays or empty strings.
Do not invent facts.
""";

        String userPrompt = """
Generate a structured AI report from the following submission content.

Submission content:
%s
""".formatted(inputText);

        OllamaChatRequest request = new OllamaChatRequest();
        request.setModel(ollamaModel);
        request.setStream(false);
        request.setFormat("json");
        request.setMessages(List.of(
                Map.of("role", "system", "content", schemaInstruction),
                Map.of("role", "user", "content", userPrompt)
        ));

        OllamaChatResponse response = ollamaClient.chat(request);
        String rawJson = response.getMessage() == null ? null : response.getMessage().getContent();

        if (rawJson == null || rawJson.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Ollama returned empty content");
        }

        try {
            AiReportResponse report = objectMapper.readValue(rawJson, AiReportResponse.class);

            if (report.getMetadata() == null) {
                AiReportResponse.Metadata metadata = new AiReportResponse.Metadata();
                metadata.setModel(ollamaModel);
                metadata.setGeneratedAt(Instant.now().toString());
                report.setMetadata(metadata);
            } else {
                report.getMetadata().setModel(ollamaModel);
                report.getMetadata().setGeneratedAt(Instant.now().toString());
            }

            String parsedReportJson = objectMapper.writeValueAsString(report);

            AiReport entity = new AiReport();
            entity.setSubmissionId(submissionId);
            entity.setIssueId(issueId);
            entity.setShareId(shareId);
            entity.setModel(ollamaModel);
            entity.setPromptVersion("v1");
            entity.setRawOutput(rawJson);
            entity.setParsedReportJson(parsedReportJson);
            entity.setCreatedAt(Instant.now());

            aiReportRepository.save(entity);

            return report;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to parse/save Ollama structured output: " + e.getMessage()
            );
        }
    }

    public AiReport getLatestBySubmissionId(Long submissionId) {
        return aiReportRepository.findTopBySubmissionIdOrderByCreatedAtDesc(submissionId)
                .orElseThrow(() -> new RuntimeException("AI report not found"));
    }

    private String buildInputText(Submission submission, Issue issue) {
            String issueContent = issue == null ? "" : safe(issue.getIssueContent());
            String shareId = issue == null ? "" : safe(issue.getShareId());
            String issueState = issue == null || issue.getState() == null ? "" : issue.getState().name();
            String publishedAt = issue == null || issue.getPublishedAt() == null ? "" : issue.getPublishedAt().toString();
            
            return """
Submission metadata:
- Submission ID: %d
- Issue ID: %s
- User ID: %s
- Status: %s
- Email provided: %s
- Wants voucher: %s
- Wants updates: %s
- Submitted at: %s
- Created at: %s
- Updated at: %s

Issue context:
- Share ID: %s
- Issue state: %s
- Published at: %s
- Issue content:
%s

Instructions:
Generate a structured AI report based only on the submission metadata and the issue context above.
Do not invent user feedback that is not present in the input.
If evidence is limited, clearly reflect that in the summary, insights, and risks/limitations.
""".formatted(
                submission.getId(),
            submission.getIssueId(),
            submission.getUserId(),
            submission.getStatus(),
            safe(submission.getEmail()),
            submission.isWantsVoucher(),
            submission.isWantsUpdates(),
            submission.getSubmittedAt() == null ? "" : submission.getSubmittedAt().toString(),
            submission.getCreatedAt() == null ? "" : submission.getCreatedAt().toString(),
            submission.getUpdatedAt() == null ? "" : submission.getUpdatedAt().toString(),
            shareId,
            issueState,
            publishedAt,
            issueContent
        );
    }

    private String safe(String value) {
    return value == null ? "" : value;
}
}
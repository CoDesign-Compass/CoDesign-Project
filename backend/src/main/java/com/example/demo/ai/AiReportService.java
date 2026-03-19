package com.example.demo.ai;

import com.example.demo.ai.dto.AiReportResponse;
import com.example.demo.ai.ollama.OllamaChatRequest;
import com.example.demo.ai.ollama.OllamaChatResponse;
import com.example.demo.entity.HowResponse;
import com.example.demo.entity.Issue;
import com.example.demo.model.Tag;
import com.example.demo.model.UserProfile;
import com.example.demo.entity.WhyResponse;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.WhyResponseRepository;
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
import java.util.stream.Collectors;
import java.util.Set;

@Service
public class AiReportService {

    private final OllamaClient ollamaClient;
    private final ObjectMapper objectMapper;
    private final AiReportRepository aiReportRepository;
    private final SubmissionRepository submissionRepository;
    private final IssueRepository issueRepository;
    private final WhyResponseRepository whyResponseRepository;
    private final HowResponseRepository howResponseRepository;
    private final UserProfileRepository userProfileRepository;

    @Value("${ollama.model}")
    private String ollamaModel;

    public AiReportService(
            OllamaClient ollamaClient,
            ObjectMapper objectMapper,
            AiReportRepository aiReportRepository,
            SubmissionRepository submissionRepository,
            IssueRepository issueRepository,
            WhyResponseRepository whyResponseRepository,
            HowResponseRepository howResponseRepository,
            UserProfileRepository userProfileRepository
    ) {
        this.ollamaClient = ollamaClient;
        this.objectMapper = objectMapper;
        this.aiReportRepository = aiReportRepository;
        this.submissionRepository = submissionRepository;
        this.issueRepository = issueRepository;
        this.whyResponseRepository = whyResponseRepository;
        this.howResponseRepository = howResponseRepository;
        this.userProfileRepository = userProfileRepository;
    }

    // ===== submission version =====
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

        UserProfile profile = userProfileRepository.findById(String.valueOf(submissionId)).orElse(null);

        String inputText = buildInputTextForSubmission(submission, issue, profile);

        AiReportResponse report = callOllamaAndParse(inputText);

        saveAiReport(
                submissionId,
                issueId,
                shareId,
                report
        );

        return report;
    }

    // ===== shareId version =====
    public AiReportResponse generateReportByShareId(String shareId) {
        if (shareId == null || shareId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "shareId is required");
        }

        Issue issue = issueRepository.findByShareId(shareId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Issue not found for shareId: " + shareId));

        List<WhyResponse> whyResponses = whyResponseRepository.findByShareId(shareId);
        List<HowResponse> howResponses = howResponseRepository.findByShareId(shareId);

        String inputText = buildInputTextForShare(issue, whyResponses, howResponses);

        AiReportResponse report = callOllamaAndParse(inputText);

        saveAiReport(
                null, 
                issue.getIssueId(),
                shareId,
                report
        );

        return report;
    }

    public AiReport getLatestBySubmissionId(Long submissionId) {
        return aiReportRepository.findTopBySubmissionIdOrderByCreatedAtDesc(submissionId)
                .orElseThrow(() -> new RuntimeException("AI report not found"));
    }

    // ===== use Ollama and analyse =====
    private AiReportResponse callOllamaAndParse(String inputText) {
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
Generate a structured report from the following input.

Input:
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

            return report;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to parse Ollama structured output: " + e.getMessage()
            );
        }
    }

    // ===== save ai_reports =====
    private void saveAiReport(Long submissionId, Long issueId, String shareId, AiReportResponse report) {
        try {
            String parsedReportJson = objectMapper.writeValueAsString(report);
            String rawOutput = parsedReportJson; 

            AiReport entity = new AiReport();
            entity.setSubmissionId(submissionId);
            entity.setIssueId(issueId);
            entity.setShareId(shareId);
            entity.setModel(ollamaModel);
            entity.setPromptVersion("v1");
            entity.setRawOutput(rawOutput);
            entity.setParsedReportJson(parsedReportJson);
            entity.setCreatedAt(Instant.now());

            aiReportRepository.save(entity);

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to save AI report: " + e.getMessage()
            );
        }
    }

    // ===== submission version input =====
    private String buildInputTextForSubmission(Submission submission, Issue issue, UserProfile profile){
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

Profile context:
- Profile submission ID: %s
- Profile name: %s
- Selected tags: %s

Instructions:
Generate a structured report based only on the submission metadata and the issue context above.
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
                stringify(submission.getSubmittedAt()),
                stringify(submission.getCreatedAt()),
                stringify(submission.getUpdatedAt()),
                issue == null ? "" : safe(issue.getShareId()),
                issue == null || issue.getState() == null ? "" : issue.getState().name(),
                issue == null ? "" : stringify(issue.getPublishedAt()),
                issue == null ? "" : safe(issue.getIssueContent()),
                profile == null ? "" : safe(profile.getSubmissionId()),
                profile == null ? "" : safe(profile.getName()),
                formatTags(profile == null ? null : profile.getSelectedTags())
        );
    }

    // ===== shareId version input =====
    private String buildInputTextForShare(
            Issue issue,
            List<WhyResponse> whyResponses,
            List<HowResponse> howResponses
    ) {
        StringBuilder sb = new StringBuilder();

        sb.append("Issue context:\n");
        sb.append("- Issue ID: ").append(issue.getIssueId()).append("\n");
        sb.append("- Share ID: ").append(safe(issue.getShareId())).append("\n");
        sb.append("- Issue state: ").append(issue.getState() == null ? "" : issue.getState().name()).append("\n");
        sb.append("- Published at: ").append(stringify(issue.getPublishedAt())).append("\n");
        sb.append("- Issue content:\n").append(safe(issue.getIssueContent())).append("\n\n");

        sb.append("Why responses:\n");
        if (whyResponses == null || whyResponses.isEmpty()) {
            sb.append("- No why responses found.\n");
        } else {
            for (int i = 0; i < whyResponses.size(); i++) {
                WhyResponse r = whyResponses.get(i);
                sb.append("Why response #").append(i + 1).append(":\n");
                sb.append("  - stance: ").append(safe(r.getStance())).append("\n");
                sb.append("  - answer1: ").append(safe(r.getAnswer1())).append("\n");
                sb.append("  - answer2: ").append(safe(r.getAnswer2())).append("\n");
                sb.append("  - answer3: ").append(safe(r.getAnswer3())).append("\n");
                sb.append("  - answer4: ").append(safe(r.getAnswer4())).append("\n");
                sb.append("  - answer5: ").append(safe(r.getAnswer5())).append("\n");
            }
        }

        sb.append("\nHow responses:\n");
        if (howResponses == null || howResponses.isEmpty()) {
            sb.append("- No how responses found.\n");
        } else {
            for (int i = 0; i < howResponses.size(); i++) {
                HowResponse r = howResponses.get(i);
                sb.append("How response #").append(i + 1).append(":\n");
                sb.append("  - answer1: ").append(safe(r.getAnswer1())).append("\n");
                sb.append("  - answer2: ").append(safe(r.getAnswer2())).append("\n");
                sb.append("  - answer3: ").append(safe(r.getAnswer3())).append("\n");
                sb.append("  - answer4: ").append(safe(r.getAnswer4())).append("\n");
                sb.append("  - answer5: ").append(safe(r.getAnswer5())).append("\n");
            }
        }

        sb.append("\nInstructions:\n");
        sb.append("Generate a structured AI report based on the issue context and all why/how user responses above.\n");
        sb.append("Summarise common themes, disagreements, pain points, and actionable opportunities.\n");
        sb.append("Prioritise actual user responses over generic assumptions.\n");
        sb.append("Do not invent facts. If data is limited, state this clearly in risks and limitations.\n");

        return sb.toString();
    }

    private String formatTags(Set<Tag> tags) {
        if (tags == null || tags.isEmpty()) {
            return "";
        }
        return tags.stream()
                .map(Tag::getLabel)
                .filter(label -> label != null && !label.isBlank())
                .collect(Collectors.joining(", "));
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private String stringify(Object value) {
        return value == null ? "" : value.toString();
    }
}
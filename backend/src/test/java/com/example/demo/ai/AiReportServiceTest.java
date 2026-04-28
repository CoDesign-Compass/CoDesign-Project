package com.example.demo.ai;

import com.example.demo.ai.claude.ClaudeMessageResponse;
import com.example.demo.ai.dto.AiReportResponse;
import com.example.demo.ai.gemini.GeminiResponse;
import com.example.demo.ai.ollama.OllamaChatResponse;
import com.example.demo.ai.openai.OpenAiChatResponse;
import com.example.demo.entity.IssueState;
import com.example.demo.entity.Issue;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.WhyResponseRepository;
import com.example.demo.submission.Submission;
import com.example.demo.submission.SubmissionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.time.OffsetDateTime;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiReportServiceTest {

    @Mock private OllamaClient ollamaClient;
    @Mock private ClaudeClient claudeClient;
    @Mock private GeminiClient geminiClient;
    @Mock private OpenAiClient openAiClient;
    @Mock private AiReportRepository aiReportRepository;
    @Mock private SubmissionRepository submissionRepository;
    @Mock private IssueRepository issueRepository;
    @Mock private WhyResponseRepository whyResponseRepository;
    @Mock private HowResponseRepository howResponseRepository;
    @Mock private UserProfileRepository userProfileRepository;

    private AiReportService service;

    @BeforeEach
    void setUp() {
        service = new AiReportService(
                ollamaClient,
                claudeClient,
                geminiClient,
                openAiClient,
                new ObjectMapper(),
                aiReportRepository,
                submissionRepository,
                issueRepository,
                whyResponseRepository,
                howResponseRepository,
                userProfileRepository
        );
        ReflectionTestUtils.setField(service, "ollamaModel", "llama3");
        ReflectionTestUtils.setField(service, "anthropicModel", "claude-3");
        ReflectionTestUtils.setField(service, "geminiModel", "gemini-2.5");
        ReflectionTestUtils.setField(service, "openAiModel", "gpt-4o");
    }

    @Test
    void generateReportValidatesSubmissionIdAndExistence() {
        assertThatThrownBy(() -> service.generateReport(null))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("submissionId is required");

        when(submissionRepository.findById(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.generateReport(1L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Submission not found");
    }

    @Test
    void generateReportByShareIdValidatesInputAndIssueLookup() {
        assertThatThrownBy(() -> service.generateReportByShareId("  "))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("shareId is required");

        when(issueRepository.findByShareId("s1")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.generateReportByShareId("s1"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Issue not found");
    }

    @Test
    void generateReportUsesClaudeProviderAndStripsCodeFenceJson() {
        ReflectionTestUtils.setField(service, "aiProvider", "claude");

        Submission submission = new Submission();
        submission.setIssueId(null);
        ReflectionTestUtils.setField(submission, "id", 10L);

        when(submissionRepository.findById(10L)).thenReturn(Optional.of(submission));
        when(userProfileRepository.findById("10")).thenReturn(Optional.empty());
        when(aiReportRepository.save(any(AiReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ClaudeMessageResponse.Content content = new ClaudeMessageResponse.Content();
        content.setText("```json\n" + validJson() + "\n```");
        ClaudeMessageResponse response = new ClaudeMessageResponse();
        response.setContent(List.of(content));
        when(claudeClient.chat(any())).thenReturn(response);

        AiReportResponse report = service.generateReport(10L);

        assertThat(report.getMetadata().getModel()).isEqualTo("claude-3");
        ArgumentCaptor<AiReport> captor = ArgumentCaptor.forClass(AiReport.class);
        verify(aiReportRepository).save(captor.capture());
        assertThat(captor.getValue().getSubmissionId()).isEqualTo(10L);
    }

    @Test
    void generateReportByShareIdUsesGeminiProvider() {
        ReflectionTestUtils.setField(service, "aiProvider", "gemini");

        Issue issue = new Issue();
        issue.setIssueId(9L);
        issue.setShareId("share-9");
        issue.setIssueContent("Issue content");

        when(issueRepository.findByShareId("share-9")).thenReturn(Optional.of(issue));
        when(whyResponseRepository.findByShareId("share-9")).thenReturn(List.of());
        when(aiReportRepository.save(any(AiReport.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(howResponseRepository.findByShareId("share-9")).thenReturn(List.of());

        GeminiResponse.Part part = new GeminiResponse.Part();
        part.setText(validJson());
        GeminiResponse.Content content = new GeminiResponse.Content();
        content.setParts(List.of(part));
        GeminiResponse.Candidate candidate = new GeminiResponse.Candidate();
        candidate.setContent(content);
        GeminiResponse response = new GeminiResponse();
        response.setCandidates(List.of(candidate));
        when(geminiClient.generate(any())).thenReturn(response);

        AiReportResponse report = service.generateReportByShareId("share-9");

        assertThat(report.getMetadata().getModel()).isEqualTo("gemini-2.5");
    }

    @Test
    void generateReportThrowsBadGatewayOnEmptyOrInvalidAiOutput() {
        Submission submission = new Submission();
        ReflectionTestUtils.setField(submission, "id", 11L);
        when(submissionRepository.findById(11L)).thenReturn(Optional.of(submission));
        when(userProfileRepository.findById("11")).thenReturn(Optional.empty());

        ReflectionTestUtils.setField(service, "aiProvider", "openai");
        OpenAiChatResponse emptyOpenAi = new OpenAiChatResponse();
        emptyOpenAi.setChoices(List.of());
        when(openAiClient.chat(any())).thenReturn(emptyOpenAi);

        assertThatThrownBy(() -> service.generateReport(11L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_GATEWAY);

        ReflectionTestUtils.setField(service, "aiProvider", "other");
        OllamaChatResponse.Message message = new OllamaChatResponse.Message();
        message.setContent("not-json");
        OllamaChatResponse ollama = new OllamaChatResponse();
        ollama.setMessage(message);
        when(ollamaClient.chat(any())).thenReturn(ollama);

        assertThatThrownBy(() -> service.generateReport(11L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_GATEWAY);
    }

    @Test
    void generateReportWrapsSaveFailuresAsInternalServerError() {
        ReflectionTestUtils.setField(service, "aiProvider", "claude");

        Submission submission = new Submission();
        ReflectionTestUtils.setField(submission, "id", 12L);
        when(submissionRepository.findById(12L)).thenReturn(Optional.of(submission));
        when(userProfileRepository.findById("12")).thenReturn(Optional.empty());

        ClaudeMessageResponse.Content content = new ClaudeMessageResponse.Content();
        content.setText(validJson());
        ClaudeMessageResponse response = new ClaudeMessageResponse();
        response.setContent(List.of(content));
        when(claudeClient.chat(any())).thenReturn(response);
        when(aiReportRepository.save(any(AiReport.class))).thenThrow(new RuntimeException("db down"));

        assertThatThrownBy(() -> service.generateReport(12L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting("statusCode")
                .isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    void getLatestBySubmissionIdThrowsWhenMissing() {
        when(aiReportRepository.findTopBySubmissionIdOrderByCreatedAtDesc(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getLatestBySubmissionId(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("AI report not found");
    }

    @Test
    void getLatestBySubmissionIdReturnsEntityWhenPresent() {
        AiReport entity = new AiReport();
        entity.setSubmissionId(88L);
        entity.setCreatedAt(Instant.parse("2026-04-27T10:15:30Z"));
        when(aiReportRepository.findTopBySubmissionIdOrderByCreatedAtDesc(88L)).thenReturn(Optional.of(entity));

        AiReport result = service.getLatestBySubmissionId(88L);

        assertThat(result).isSameAs(entity);
    }

    @Test
    void generateReportUsesOpenAiProviderAndBuildsMetadataWhenMissing() {
        ReflectionTestUtils.setField(service, "aiProvider", "openai");

        Submission submission = new Submission();
        ReflectionTestUtils.setField(submission, "id", 21L);
        submission.setIssueId(5L);
        when(submissionRepository.findById(21L)).thenReturn(Optional.of(submission));

        Issue issue = new Issue();
        issue.setIssueId(5L);
        issue.setShareId("share-5");
        issue.setIssueContent("Issue text");
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.parse("2026-04-27T10:15:30+00:00"));
        when(issueRepository.findById(5L)).thenReturn(Optional.of(issue));
        when(userProfileRepository.findById("21")).thenReturn(Optional.empty());
        when(aiReportRepository.save(any(AiReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OpenAiChatResponse.Message msg = new OpenAiChatResponse.Message();
        msg.setContent(validJsonWithoutMetadata());
        OpenAiChatResponse.Choice choice = new OpenAiChatResponse.Choice();
        choice.setMessage(msg);
        OpenAiChatResponse response = new OpenAiChatResponse();
        response.setChoices(List.of(choice));
        when(openAiClient.chat(any())).thenReturn(response);

        AiReportResponse report = service.generateReport(21L);

        assertThat(report.getMetadata()).isNotNull();
        assertThat(report.getMetadata().getModel()).isEqualTo("gpt-4o");
    }

    @Test
    void generateReportUsesOllamaProviderSuccessPath() {
        ReflectionTestUtils.setField(service, "aiProvider", "ollama");

        Submission submission = new Submission();
        ReflectionTestUtils.setField(submission, "id", 22L);
        when(submissionRepository.findById(22L)).thenReturn(Optional.of(submission));
        when(userProfileRepository.findById("22")).thenReturn(Optional.empty());
        when(aiReportRepository.save(any(AiReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OllamaChatResponse.Message message = new OllamaChatResponse.Message();
        message.setContent(validJson());
        OllamaChatResponse ollama = new OllamaChatResponse();
        ollama.setMessage(message);
        when(ollamaClient.chat(any())).thenReturn(ollama);

        AiReportResponse report = service.generateReport(22L);

        assertThat(report.getMetadata().getModel()).isEqualTo("llama3");
    }

    @Test
    void generateReportByShareIdWithDataUsesClaudePath() {
        ReflectionTestUtils.setField(service, "aiProvider", "claude");

        Issue issue = new Issue();
        issue.setIssueId(30L);
        issue.setShareId("share-30");
        issue.setIssueContent("Issue 30");
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.parse("2026-04-27T10:15:30+00:00"));
        when(issueRepository.findByShareId("share-30")).thenReturn(Optional.of(issue));

        com.example.demo.entity.WhyResponse why = new com.example.demo.entity.WhyResponse();
        why.setStance("support");
        why.setAnswer1("Because of transport");
        com.example.demo.entity.HowResponse how = new com.example.demo.entity.HowResponse();
        how.setAnswer1("Provide buses");
        when(whyResponseRepository.findByShareId("share-30")).thenReturn(List.of(why));
        when(howResponseRepository.findByShareId("share-30")).thenReturn(List.of(how));
        when(aiReportRepository.save(any(AiReport.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ClaudeMessageResponse.Content content = new ClaudeMessageResponse.Content();
        content.setText(validJson());
        ClaudeMessageResponse response = new ClaudeMessageResponse();
        response.setContent(List.of(content));
        when(claudeClient.chat(any())).thenReturn(response);

        AiReportResponse report = service.generateReportByShareId("share-30");

        assertThat(report.getMetadata().getModel()).isEqualTo("claude-3");
    }

    private static String validJson() {
        return "{"
                + "\"title\":\"t\"," 
                + "\"summary\":\"s\"," 
                + "\"keyInsights\":[],"
                + "\"themes\":[],"
                + "\"recommendations\":[],"
                + "\"risksAndLimitations\":[],"
                + "\"sentimentAnalysis\":{\"overallSentiment\":\"Neutral\",\"participantSentiments\":[],\"summary\":\"\"},"
                + "\"metadata\":{\"model\":\"\",\"generatedAt\":\"\"}"
                + "}";
    }

    private static String validJsonWithoutMetadata() {
        return "{"
                + "\"title\":\"t\"," 
                + "\"summary\":\"s\"," 
                + "\"keyInsights\":[],"
                + "\"themes\":[],"
                + "\"recommendations\":[],"
                + "\"risksAndLimitations\":[],"
                + "\"sentimentAnalysis\":{\"overallSentiment\":\"Neutral\",\"participantSentiments\":[],\"summary\":\"\"}"
                + "}";
    }
}

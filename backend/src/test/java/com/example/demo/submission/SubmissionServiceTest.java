package com.example.demo.submission;

import com.example.demo.entity.Issue;
import com.example.demo.entity.IssueState;
import com.example.demo.entity.WhyResponse;
import com.example.demo.model.Tag;
import com.example.demo.model.UserProfile;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.repository.WhyResponseRepository;
import com.example.demo.submission.dto.CreateSubmissionRequest;
import com.example.demo.submission.dto.SubmissionTrendPointResponse;
import com.example.demo.submission.dto.UpdateThanksRequest;
import com.example.demo.user.GiftEmailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceTest {

    @Mock
    private SubmissionRepository repo;

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private WhyResponseRepository whyResponseRepository;

    @Mock
    private HowResponseRepository howResponseRepository;

    @Mock
    private GiftEmailService giftEmailService;

    @InjectMocks
    private SubmissionService service;

    @Test
    void submitReturnsExistingWhenAlreadySubmitted() {
        Submission submission = new Submission();
        submission.setStatus(Submission.Status.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.parse("2026-04-27T10:15:30"));
        when(repo.findById(1L)).thenReturn(Optional.of(submission));

        var response = service.submit(1L);

        assertThat(response.getStatus()).isEqualTo("SUBMITTED");
    }

    @Test
    void submitThrowsWhenNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.submit(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("SUBMISSION_NOT_FOUND");
    }

    @Test
    void linkAccountValidatesUserId() {
        Submission submission = new Submission();
        when(repo.findById(1L)).thenReturn(Optional.of(submission));

        assertThatThrownBy(() -> service.linkAccount(1L, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("USER_ID_REQUIRED");
    }

    @Test
    void updateThanksInfoRequiresEmailWhenNeeded() {
        Submission submission = new Submission();
        when(repo.findById(1L)).thenReturn(Optional.of(submission));

        UpdateThanksRequest req = new UpdateThanksRequest();
        req.setWantsVoucher(true);
        req.setEmail("  ");

        assertThatThrownBy(() -> service.updateThanksInfo(1L, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("EMAIL_REQUIRED");
    }

    @Test
    void updateThanksInfoStoresTrimmedEmail() {
        Submission submission = new Submission();
        when(repo.findById(1L)).thenReturn(Optional.of(submission));
        when(repo.save(submission)).thenReturn(submission);

        UpdateThanksRequest req = new UpdateThanksRequest();
        req.setWantsUpdates(true);
        req.setEmail("  user@test.com  ");

        Submission saved = service.updateThanksInfo(1L, req);

        assertThat(saved.getEmail()).isEqualTo("user@test.com");
        assertThat(saved.isWantsUpdates()).isTrue();
    }

    @Test
    void getIssueSubmissionTrendValidatesInputAndRoutesByGranularity() {
        assertThatThrownBy(() -> service.getIssueSubmissionTrend(null, "month", 3))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("ISSUE_ID_REQUIRED");

        when(repo.findMonthlySubmittedCountsByIssueId(1L)).thenReturn(List.of());
        when(repo.findDailySubmittedCountsByIssueId(1L)).thenReturn(List.of());

        List<SubmissionTrendPointResponse> monthly = service.getIssueSubmissionTrend(1L, "month", 2);
        List<SubmissionTrendPointResponse> daily = service.getIssueSubmissionTrend(1L, "day", 2);

        assertThat(monthly).hasSize(2);
        assertThat(daily).hasSize(2);

        assertThatThrownBy(() -> service.getIssueSubmissionTrend(1L, "hour", 2))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("INVALID_GRANULARITY");
    }

    @Test
    void getMonthlySubmittedCountsHandlesInvalidRows() {
        YearMonth now = YearMonth.now();
        when(repo.findMonthlySubmittedCounts()).thenReturn(Arrays.asList(
                null,
                new Object[]{null, 4},
                new Object[]{Timestamp.valueOf(now.atDay(1).atStartOfDay()), 5}
        ));

        var result = service.getMonthlySubmittedCounts(2);
        Map<String, Long> byMonth = result.stream().collect(java.util.stream.Collectors.toMap(
                r -> r.getMonth(),
                r -> r.getCount()
        ));

        assertThat(result).hasSize(2);
        assertThat(byMonth).containsEntry(now.format(DateTimeFormatter.ofPattern("yyyy-MM")), 5L);
    }

    @Test
    void getIssueProfileWordCloudFiltersInvalidTerms() {
        Issue issue = new Issue();
        issue.setIssueId(1L);
        issue.setShareId("share-1");
        issue.setIssueContent("content");
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.parse("2026-04-27T10:15:30+00:00"));

        when(issueRepository.findById(1L)).thenReturn(Optional.of(issue));
        when(userProfileRepository.findProfileTagCountsByShareId("share-1")).thenReturn(Arrays.asList(
                null,
                new Object[]{"", 10},
                new Object[]{"Transport", 0},
                new Object[]{"Housing", 3}
        ));

        var result = service.getIssueProfileWordCloud(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).label()).isEqualTo("Housing");
        assertThat(result.get(0).value()).isEqualTo(3);
    }

    @Test
    void generateIssueProfileRawDataCsvIncludesRowsWithoutTagsAndWithTags() {
        Issue issue = new Issue();
        issue.setIssueId(1L);
        issue.setShareId("share-1");
        issue.setIssueContent("content");
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.parse("2026-04-27T10:15:30+00:00"));

        Submission submitted = new Submission();
        submitted.setIssueId(1L);
        submitted.setStatus(Submission.Status.SUBMITTED);
        org.springframework.test.util.ReflectionTestUtils.setField(submitted, "id", 10L);

        Submission draft = new Submission();
        draft.setIssueId(1L);
        draft.setStatus(Submission.Status.DRAFT);
        org.springframework.test.util.ReflectionTestUtils.setField(draft, "id", 11L);

        UserProfile profile = new UserProfile("10", "Alice", Set.of(
                new Tag(1L, "Transport", "theme", "#000", true, "system")
        ));

        when(issueRepository.findById(1L)).thenReturn(Optional.of(issue));
        when(repo.findByIssueIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(submitted, draft));
        when(userProfileRepository.findAllById(List.of("10"))).thenReturn(List.of(profile));
        when(whyResponseRepository.findByShareId("share-1")).thenReturn(List.of());
        when(howResponseRepository.findByShareId("share-1")).thenReturn(List.of());

        String csv = service.generateIssueProfileRawDataCsv(1L);

        assertThat(csv).contains("issueId,submissionId,tagLabel");
        assertThat(csv).contains("\"1\",\"10\",\"Transport\"");
        assertThat(csv).doesNotContain("\"11\"");
    }

    @Test
    void createDraftUsesIssueIdFromRequest() {
        CreateSubmissionRequest req = new CreateSubmissionRequest();
        req.setIssueId(123L);
        when(repo.save(org.mockito.ArgumentMatchers.any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Submission draft = service.createDraft(req);

        assertThat(draft.getIssueId()).isEqualTo(123L);
        assertThat(draft.getStatus()).isEqualTo(Submission.Status.DRAFT);
        verify(repo).save(org.mockito.ArgumentMatchers.any(Submission.class));
    }

        @Test
        void sendGiftEmailToSubmissionValidatesMissingSubmissionAndEmail() {
        when(repo.findById(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.sendGiftEmailToSubmission(1L, "V1", "tpl"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("SUBMISSION_NOT_FOUND");

        Submission submission = new Submission();
        submission.setEmail(" ");
        when(repo.findById(2L)).thenReturn(Optional.of(submission));
        assertThatThrownBy(() -> service.sendGiftEmailToSubmission(2L, "V2", "tpl"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("EMAIL_REQUIRED");
        }

        @Test
        void sendGiftEmailToSubmissionPassesTrimmedEmail() {
        Submission submission = new Submission();
        submission.setEmail("  a@test.com  ");
        when(repo.findById(3L)).thenReturn(Optional.of(submission));

        service.sendGiftEmailToSubmission(3L, "VC-3", "tpl");

        verify(giftEmailService).sendGiftEmail("a@test.com", "a@test.com", "VC-3", "tpl");
        }

        @Test
        void sendUpdateEmailToSubmissionValidatesMissingIssueAndEmail() {
        Submission submission = new Submission();
        submission.setEmail("u@test.com");
        when(repo.findById(4L)).thenReturn(Optional.of(submission));
        when(issueRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.sendUpdateEmailToSubmission(4L, 9L, "tpl"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_NOT_FOUND");

        Submission noEmail = new Submission();
        noEmail.setEmail(null);
        when(repo.findById(5L)).thenReturn(Optional.of(noEmail));

        assertThatThrownBy(() -> service.sendUpdateEmailToSubmission(5L, 9L, "tpl"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("EMAIL_REQUIRED");
        }

        @Test
        void sendUpdateEmailToSubmissionPassesTrimmedEmailAndIssue() {
        Submission submission = new Submission();
        submission.setEmail("  u@test.com ");
        when(repo.findById(6L)).thenReturn(Optional.of(submission));

        Issue issue = new Issue();
        issue.setIssueId(10L);
        issue.setShareId("s-10");
        when(issueRepository.findById(10L)).thenReturn(Optional.of(issue));

        service.sendUpdateEmailToSubmission(6L, 10L, "tpl");

        verify(giftEmailService).sendUpdateEmail("u@test.com", "u@test.com", issue, "tpl");
        }

        @Test
        void totalsAndAverageHandleNullAndDefaultBranches() {
        when(repo.countSubmittedForExistingIssues()).thenReturn(12L);
        when(repo.countByIssueIdAndStatus(7L, Submission.Status.SUBMITTED)).thenReturn(5L);
        when(repo.findAverageResponseSecondsByIssueId(7L)).thenReturn(null);

        assertThat(service.getTotalSubmissions()).isEqualTo(12L);
        assertThat(service.getTotalSubmissionsByIssue(7L)).isEqualTo(5L);
        assertThat(service.getAverageResponseSecondsByIssue(7L)).isEqualTo(0D);

        assertThatThrownBy(() -> service.getTotalSubmissionsByIssue(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_ID_REQUIRED");
        assertThatThrownBy(() -> service.getAverageResponseSecondsByIssue(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_ID_REQUIRED");
        }

        @Test
        void generateWhyAndHowRawCsvValidateIssueIdAndEscapeFields() {
        assertThatThrownBy(() -> service.generateIssueWhyRawDataCsv(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_ID_REQUIRED");
        assertThatThrownBy(() -> service.generateIssueHowRawDataCsv(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_ID_REQUIRED");

        Issue issue = new Issue();
        issue.setIssueId(8L);
        issue.setShareId("share-8");
        when(issueRepository.findById(8L)).thenReturn(Optional.of(issue));
        when(repo.findByIssueIdOrderByCreatedAtDesc(8L)).thenReturn(List.of());
        when(userProfileRepository.findAllById(List.of())).thenReturn(List.of());

        WhyResponse why = new WhyResponse();
        org.springframework.test.util.ReflectionTestUtils.setField(why, "id", 1L);
        why.setStance("pro");
        why.setAnswer1("a\"b");
        why.setAnswer2("x");
        why.setAnswer3(null);
        why.setAnswer4("");
        why.setAnswer5("z");

        com.example.demo.entity.HowResponse how = new com.example.demo.entity.HowResponse();
        org.springframework.test.util.ReflectionTestUtils.setField(how, "id", 2L);
        how.setAnswer1("h1");
        how.setAnswer2("h2");
        how.setAnswer3("h3");
        how.setAnswer4("h4");
        how.setAnswer5("h5");

        when(whyResponseRepository.findByShareId("share-8")).thenReturn(List.of(why));
        when(howResponseRepository.findByShareId("share-8")).thenReturn(List.of(how));

        String whyCsv = service.generateIssueWhyRawDataCsv(8L);
        String howCsv = service.generateIssueHowRawDataCsv(8L);

        assertThat(whyCsv).contains("\"a\"\"b\"");
        assertThat(howCsv).contains("issueId,howResponseId");
        }

        @Test
        void whyAndHowWordCloudHandleNullIssueAndTokenFiltering() {
        assertThatThrownBy(() -> service.getIssueWhyWordCloud(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_ID_REQUIRED");
        assertThatThrownBy(() -> service.getIssueHowWordCloud(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_ID_REQUIRED");

        Issue issue = new Issue();
        issue.setIssueId(9L);
        issue.setShareId("share-9");
        when(issueRepository.findById(9L)).thenReturn(Optional.of(issue));
        when(repo.findByIssueIdOrderByCreatedAtDesc(9L)).thenReturn(List.of());
        when(userProfileRepository.findAllById(List.of())).thenReturn(List.of());

        WhyResponse why = new WhyResponse();
        why.setAnswer1("The transport transport and access");
        why.setAnswer2("a i of");

        com.example.demo.entity.HowResponse how = new com.example.demo.entity.HowResponse();
        how.setAnswer1("Improve service quality quality");

        when(whyResponseRepository.findByShareId("share-9")).thenReturn(List.of(why));
        when(howResponseRepository.findByShareId("share-9")).thenReturn(List.of(how));

        var whyTerms = service.getIssueWhyWordCloud(9L);
        var howTerms = service.getIssueHowWordCloud(9L);

        assertThat(whyTerms).isNotEmpty();
        assertThat(whyTerms.get(0).label()).isEqualTo("transport");
        assertThat(howTerms).extracting(t -> t.label()).contains("quality");
        }

        @Test
        void rawDataAndProfileWordCloudThrowWhenIssueNotFound() {
        when(issueRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.generateIssueProfileRawDataCsv(404L))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_NOT_FOUND");
        assertThatThrownBy(() -> service.getIssueProfileWordCloud(404L))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("ISSUE_NOT_FOUND");
        }
}
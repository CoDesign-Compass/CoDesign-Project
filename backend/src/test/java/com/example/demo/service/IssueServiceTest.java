package com.example.demo.service;

import com.example.demo.dto.CreateIssueRequest;
import com.example.demo.dto.IssueResponse;
import com.example.demo.entity.Issue;
import com.example.demo.entity.IssueState;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.WhyResponseRepository;
import com.example.demo.submission.SubmissionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IssueServiceTest {

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private WhyResponseRepository whyResponseRepository;

    @Mock
    private HowResponseRepository howResponseRepository;

    @InjectMocks
    private IssueService issueService;

    @Test
    void createIssueTrimsContentAndBuildsActiveResponse() {
        CreateIssueRequest request = new CreateIssueRequest();
        request.setIssueContent("  Improve bus access  ");

        when(issueRepository.existsByShareId(anyString())).thenReturn(false);
        when(issueRepository.save(any(Issue.class))).thenAnswer(invocation -> {
            Issue issue = invocation.getArgument(0);
            issue.setIssueId(99L);
            return issue;
        });

        IssueResponse response = issueService.createIssue(request);

        assertThat(response.getIssueId()).isEqualTo(99L);
        assertThat(response.getIssueContent()).isEqualTo("Improve bus access");
        assertThat(response.getState()).isEqualTo(IssueState.ACTIVE);
        assertThat(response.getShareId()).hasSize(10);
        assertThat(response.getPublishedAt()).isNotNull();
    }

    @Test
    void createIssueRejectsBlankContent() {
        CreateIssueRequest request = new CreateIssueRequest();
        request.setIssueContent("   ");

        assertThatThrownBy(() -> issueService.createIssue(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Issue content must not be empty.");

        verifyNoInteractions(issueRepository);
    }

    @Test
    void updateIssuePersistsTrimmedContent() {
        Issue existing = new Issue();
        existing.setIssueId(7L);
        existing.setShareId("share123");
        existing.setIssueContent("Old");
        existing.setState(IssueState.ACTIVE);
        existing.setPublishedAt(OffsetDateTime.parse("2026-04-06T10:15:30+00:00"));

        CreateIssueRequest request = new CreateIssueRequest();
        request.setIssueContent("  Updated issue text  ");

        when(issueRepository.findById(7L)).thenReturn(Optional.of(existing));
        when(issueRepository.save(any(Issue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        IssueResponse response = issueService.updateIssue(7L, request);

        ArgumentCaptor<Issue> captor = ArgumentCaptor.forClass(Issue.class);
        verify(issueRepository).save(captor.capture());
        assertThat(captor.getValue().getIssueContent()).isEqualTo("Updated issue text");
        assertThat(response.getIssueId()).isEqualTo(7L);
        assertThat(response.getIssueContent()).isEqualTo("Updated issue text");
    }

    @Test
    void getIssueByShareIdReturnsMappedResponse() {
        Issue issue = new Issue();
        issue.setIssueId(12L);
        issue.setShareId("share123");
        issue.setIssueContent("Content");
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.parse("2026-04-06T10:15:30+00:00"));

        when(issueRepository.findByShareId("share123")).thenReturn(Optional.of(issue));

        IssueResponse response = issueService.getIssueByShareId("share123");

        assertThat(response.getIssueId()).isEqualTo(12L);
        assertThat(response.getShareId()).isEqualTo("share123");
        assertThat(response.getIssueContent()).isEqualTo("Content");
    }

    @Test
    void deleteIssueRemovesAssociatedData() {
        Issue issue = new Issue();
        issue.setIssueId(7L);
        issue.setShareId("share123");
        issue.setIssueContent("Content");
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.parse("2026-04-06T10:15:30+00:00"));

        when(issueRepository.findById(7L)).thenReturn(Optional.of(issue));

        issueService.deleteIssue(7L);

        verify(whyResponseRepository).deleteByShareId("share123");
        verify(howResponseRepository).deleteByShareId("share123");
        verify(submissionRepository).deleteByIssueId(7L);
        verify(issueRepository).delete(issue);
    }
}
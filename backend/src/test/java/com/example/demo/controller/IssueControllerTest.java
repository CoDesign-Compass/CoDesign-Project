package com.example.demo.controller;

import com.example.demo.dto.CreateIssueRequest;
import com.example.demo.dto.IssueResponse;
import com.example.demo.entity.IssueState;
import com.example.demo.service.IssueService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.OffsetDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IssueControllerTest {

    @Mock
    private IssueService issueService;

    @InjectMocks
    private IssueController issueController;

    @Test
    void createIssueDelegatesToService() {
        CreateIssueRequest request = new CreateIssueRequest();
        request.setIssueContent("Improve lighting");
        IssueResponse response = new IssueResponse(
                1L,
                "share123",
                "Improve lighting",
            "",
                IssueState.ACTIVE,
                OffsetDateTime.parse("2026-04-23T10:15:30+00:00")
        );

        when(issueService.createIssue(request)).thenReturn(response);

        IssueResponse result = issueController.createIssue(request);

        assertThat(result).isEqualTo(response);
        verify(issueService).createIssue(request);
    }

    @Test
    void getAllIssuesReturnsServiceData() {
        List<IssueResponse> responses = List.of(
            new IssueResponse(1L, "s1", "A", "", IssueState.ACTIVE, OffsetDateTime.parse("2026-04-23T10:15:30+00:00")),
            new IssueResponse(2L, "s2", "B", "", IssueState.DISABLED, OffsetDateTime.parse("2026-04-23T10:16:30+00:00"))
        );
        when(issueService.getAllIssues()).thenReturn(responses);

        List<IssueResponse> result = issueController.getAllIssues();

        assertThat(result).containsExactlyElementsOf(responses);
        verify(issueService).getAllIssues();
    }

    @Test
    void getIssueByIdDelegatesToService() {
        IssueResponse response = new IssueResponse(
                9L,
                "share9",
                "Issue 9",
            "",
                IssueState.ACTIVE,
                OffsetDateTime.parse("2026-04-23T10:15:30+00:00")
        );
        when(issueService.getIssueById(9L)).thenReturn(response);

        IssueResponse result = issueController.getIssueById(9L);

        assertThat(result.getIssueId()).isEqualTo(9L);
        verify(issueService).getIssueById(9L);
    }

    @Test
    void getIssueByShareIdDelegatesToService() {
        IssueResponse response = new IssueResponse(
                5L,
                "share-5",
                "Issue 5",
            "",
                IssueState.ACTIVE,
                OffsetDateTime.parse("2026-04-23T10:15:30+00:00")
        );
        when(issueService.getIssueByShareId("share-5")).thenReturn(response);

        IssueResponse result = issueController.getIssueByShareId("share-5");

        assertThat(result.getShareId()).isEqualTo("share-5");
        verify(issueService).getIssueByShareId("share-5");
    }

    @Test
    void editIssueDelegatesToService() {
        CreateIssueRequest request = new CreateIssueRequest();
        request.setIssueContent("Updated issue");
        IssueResponse response = new IssueResponse(
                7L,
                "share-7",
                "Updated issue",
            "",
                IssueState.ACTIVE,
                OffsetDateTime.parse("2026-04-23T10:15:30+00:00")
        );
        when(issueService.updateIssue(7L, request)).thenReturn(response);

        IssueResponse result = issueController.editIssue(7L, request);

        assertThat(result.getIssueContent()).isEqualTo("Updated issue");
        verify(issueService).updateIssue(7L, request);
    }

    @Test
    void deleteIssueReturnsNoContent() {
        ResponseEntity<Void> result = issueController.deleteIssue(13L);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(result.getBody()).isNull();
        verify(issueService).deleteIssue(13L);
    }
}
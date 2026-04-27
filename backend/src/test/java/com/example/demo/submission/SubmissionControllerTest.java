package com.example.demo.submission;

import com.example.demo.submission.dto.SubmissionTrendPointResponse;
import com.example.demo.user.dto.SendGiftEmailRequest;
import com.example.demo.user.dto.SendUpdateEmailRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubmissionControllerTest {

    @Mock
    private SubmissionService service;

    @InjectMocks
    private SubmissionController controller;

    @Test
    void getIssueSubmissionTrendUsesDefaultPointsByGranularity() {
        when(service.getIssueSubmissionTrend(1L, "day", 30)).thenReturn(List.of(new SubmissionTrendPointResponse("2026-04-27", 1L)));
        when(service.getIssueSubmissionTrend(1L, "month", 12)).thenReturn(List.of(new SubmissionTrendPointResponse("2026-04", 2L)));
                when(service.getIssueSubmissionTrend(1L, "month", 6)).thenReturn(List.of(new SubmissionTrendPointResponse("2026-01", 3L)));

        var day = controller.getIssueSubmissionTrend(1L, "day", null);
        var month = controller.getIssueSubmissionTrend(1L, "month", null);
        var explicit = controller.getIssueSubmissionTrend(1L, "month", 6);

        assertThat(day.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(month.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(explicit.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(service).getIssueSubmissionTrend(1L, "day", 30);
        verify(service).getIssueSubmissionTrend(1L, "month", 12);
                verify(service).getIssueSubmissionTrend(1L, "month", 6);
    }

    @Test
    void sendGiftEmailTranslatesServiceErrorsToHttpStatus() {
        SendGiftEmailRequest req = new SendGiftEmailRequest();
        req.setVoucherCode("VC");
        req.setTemplate("T");

        org.mockito.Mockito.doThrow(new IllegalStateException("mail off"))
                .when(service).sendGiftEmailToSubmission(1L, "VC", "T");

        assertThatThrownBy(() -> controller.sendGiftEmailToSubmission(1L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("503 SERVICE_UNAVAILABLE");

        org.mockito.Mockito.doThrow(new IllegalArgumentException("bad"))
                .when(service).sendGiftEmailToSubmission(2L, "VC", "T");

        assertThatThrownBy(() -> controller.sendGiftEmailToSubmission(2L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");

        org.mockito.Mockito.doNothing().when(service).sendGiftEmailToSubmission(3L, "VC", "T");
        var ok = controller.sendGiftEmailToSubmission(3L, req);
        assertThat(ok.getBody()).isEqualTo(Map.of("sent", true));
    }

    @Test
    void sendUpdateEmailTranslatesServiceErrorsToHttpStatus() {
        SendUpdateEmailRequest req = new SendUpdateEmailRequest();
        req.setIssueId(9L);
        req.setTemplate("tpl");

        org.mockito.Mockito.doThrow(new IllegalStateException("mail off"))
                .when(service).sendUpdateEmailToSubmission(1L, 9L, "tpl");

        assertThatThrownBy(() -> controller.sendUpdateEmailToSubmission(1L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("503 SERVICE_UNAVAILABLE");

        org.mockito.Mockito.doThrow(new IllegalArgumentException("bad"))
                .when(service).sendUpdateEmailToSubmission(2L, 9L, "tpl");

        assertThatThrownBy(() -> controller.sendUpdateEmailToSubmission(2L, req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");

        org.mockito.Mockito.doNothing().when(service).sendUpdateEmailToSubmission(3L, 9L, "tpl");
        var ok = controller.sendUpdateEmailToSubmission(3L, req);
        assertThat(ok.getBody()).isEqualTo(Map.of("sent", true));
    }

    @Test
    void getTotalSubmissionsRoutesByIssueIdPresence() {
        when(service.getTotalSubmissions()).thenReturn(7L);
        when(service.getTotalSubmissionsByIssue(5L)).thenReturn(3L);

        var all = controller.getTotalSubmissions(null);
        var oneIssue = controller.getTotalSubmissions(5L);

        assertThat(all.getBody()).isEqualTo(Map.of("count", 7L));
        assertThat(oneIssue.getBody()).isEqualTo(Map.of("count", 3L));
    }

    @Test
    void exportRawDataCsvAddsFilenameHeaders() {
        when(service.generateIssueProfileRawDataCsv(8L)).thenReturn("a,b\n1,2\n");

        var response = controller.exportIssueProfileRawDataCsv(8L);

        assertThat(response.getHeaders().getFirst("Content-Disposition"))
                .isEqualTo("attachment; filename=\"issue-8-profile-raw-data.csv\"");
        assertThat(new String(response.getBody(), StandardCharsets.UTF_8)).contains("a,b");
    }
}

package com.example.demo.dashboard.controller;

import com.example.demo.dashboard.dto.FunnelStepDTO;
import com.example.demo.dashboard.dto.QuestionDistributionDTO;
import com.example.demo.dashboard.dto.QuestionSummaryDTO;
import com.example.demo.dashboard.dto.QuestionnaireMetricsDTO;
import com.example.demo.dashboard.dto.RespondentPathDTO;
import com.example.demo.dashboard.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private DashboardController controller;

    @Test
    void getDashboardMetricsReturnsOk() {
        QuestionnaireMetricsDTO dto = new QuestionnaireMetricsDTO();
        dto.setTotalRespondents(100L);
        when(dashboardService.getQuestionnaireMetrics()).thenReturn(dto);

        ResponseEntity<QuestionnaireMetricsDTO> response = controller.getDashboardMetrics();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(dto);
        verify(dashboardService).getQuestionnaireMetrics();
    }

    @Test
    void getQuestionDistributionReturnsOk() {
        QuestionDistributionDTO dto = new QuestionDistributionDTO();
        dto.setQuestionId("q1");
        when(dashboardService.getQuestionDistribution("q1")).thenReturn(dto);

        ResponseEntity<QuestionDistributionDTO> response = controller.getQuestionDistribution("q1");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(dto);
        verify(dashboardService).getQuestionDistribution("q1");
    }

    @Test
    void getRespondentPathsReturnsOk() {
        List<RespondentPathDTO> paths = List.of(new RespondentPathDTO("Question A", Map.of("Path A", 10L)));
        when(dashboardService.getRespondentPaths()).thenReturn(paths);

        ResponseEntity<List<RespondentPathDTO>> response = controller.getRespondentPaths();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsExactlyElementsOf(paths);
        verify(dashboardService).getRespondentPaths();
    }

    @Test
    void getQuestionsMapsPaginationFieldsForFrontend() {
        QuestionSummaryDTO q1 = new QuestionSummaryDTO("q1", "Question 1", "Transport", 10L, 80.0, "today");
        Page<QuestionSummaryDTO> page = new PageImpl<>(List.of(q1), PageRequest.of(0, 5), 11);
        when(dashboardService.getQuestions(eq("Transport"), any())).thenReturn(page);

        ResponseEntity<Map<String, Object>> response = controller.getQuestions("Transport", 1, 5);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("currentPage", 1);
        assertThat(response.getBody()).containsEntry("totalPages", 3);
        assertThat(response.getBody()).containsEntry("totalElements", 11L);
        assertThat(response.getBody()).containsEntry("pageSize", 5);
        assertThat(response.getBody()).containsKey("content");
        verify(dashboardService).getQuestions(eq("Transport"), any());
    }

    @Test
    void getFunnelAnalysisReturnsOk() {
        List<FunnelStepDTO> funnel = List.of(new FunnelStepDTO("Q1", 100L, 90L, 10.0, 90.0));
        when(dashboardService.getFunnelAnalysis()).thenReturn(funnel);

        ResponseEntity<List<FunnelStepDTO>> response = controller.getFunnelAnalysis();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsExactlyElementsOf(funnel);
        verify(dashboardService).getFunnelAnalysis();
    }

    @Test
    void getThemesReturnsOk() {
        List<String> themes = List.of("Transport", "Housing");
        when(dashboardService.getThemes()).thenReturn(themes);

        ResponseEntity<List<String>> response = controller.getThemes();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsExactly("Transport", "Housing");
        verify(dashboardService).getThemes();
    }

    @Test
    void healthReturnsUpStatus() {
        ResponseEntity<Map<String, String>> response = controller.health();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("status", "UP");
        assertThat(response.getBody()).containsEntry("service", "Dashboard Analytics API");
    }
}
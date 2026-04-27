package com.example.demo.dashboard.service;

import com.example.demo.dashboard.dto.FunnelStepDTO;
import com.example.demo.dashboard.dto.QuestionDistributionDTO;
import com.example.demo.dashboard.dto.QuestionnaireMetricsDTO;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

class DashboardServiceTest {

    private final DashboardService dashboardService = new DashboardService();

    @Test
    void getQuestionnaireMetricsReturnsExpectedSummary() {
        QuestionnaireMetricsDTO result = dashboardService.getQuestionnaireMetrics();

        assertThat(result.getTotalRespondents()).isEqualTo(1248L);
        assertThat(result.getCompletionRate()).isEqualTo(87.3);
        assertThat(result.getAverageQuestions()).isEqualTo(4.2);
        assertThat(result.getTrend()).isEqualTo("+12.5%");
        assertThat(result.getTrendUp()).isTrue();
        assertThat(result.getQuestionCoverage()).containsEntry("q1", 1248L);
    }

    @Test
    void getQuestionDistributionCalculatesTotalCount() {
        QuestionDistributionDTO result = dashboardService.getQuestionDistribution("question1");

        assertThat(result.getQuestionId()).isEqualTo("question1");
        assertThat(result.getQuestionText()).isEqualTo("Q: QUESTION1");
        assertThat(result.getOptions()).hasSize(4);
        assertThat(result.getTotalCount()).isEqualTo(1248L);
    }

    @Test
    void getQuestionDistributionSupportsQuestion2Branch() {
        QuestionDistributionDTO result = dashboardService.getQuestionDistribution("question2");

        assertThat(result.getOptions()).hasSize(2);
        assertThat(result.getTotalCount()).isEqualTo(1089L);
    }

    @Test
    void getQuestionDistributionSupportsQuestion3Branch() {
        QuestionDistributionDTO result = dashboardService.getQuestionDistribution("question3");

        assertThat(result.getOptions()).hasSize(4);
        assertThat(result.getTotalCount()).isEqualTo(967L);
    }

    @Test
    void getQuestionDistributionReturnsFallbackForUnknownQuestion() {
        QuestionDistributionDTO result = dashboardService.getQuestionDistribution("unknown");

        assertThat(result.getOptions()).hasSize(1);
        assertThat(result.getOptions().get(0).getOption()).isEqualTo("No data");
        assertThat(result.getTotalCount()).isZero();
    }

    @Test
    void getQuestionsFiltersByThemeAndPagesResults() {
        var page = dashboardService.getQuestions("Transportation", PageRequest.of(0, 10));

        assertThat(page.getTotalElements()).isEqualTo(1);
        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().get(0).getTheme()).isEqualTo("Transportation");
    }

    @Test
    void getQuestionsReturnsAllWhenThemeIsAll() {
        var page = dashboardService.getQuestions("All", PageRequest.of(0, 10));

        assertThat(page.getTotalElements()).isEqualTo(5);
        assertThat(page.getContent()).hasSize(5);
    }

    @Test
    void getFunnelAnalysisReturnsFiveSteps() {
        FunnelStepDTO firstStep = dashboardService.getFunnelAnalysis().get(0);

        assertThat(firstStep.getStep()).isEqualTo("Q1");
        assertThat(firstStep.getPercentage()).isEqualTo(100.0);
        assertThat(dashboardService.getFunnelAnalysis()).hasSize(5);
    }
}
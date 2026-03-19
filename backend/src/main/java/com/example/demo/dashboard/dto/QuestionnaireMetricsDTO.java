package com.example.demo.dashboard.dto;

import java.util.Map;

/**
 * 问卷仪表板概览指标 DTO
 */
public class QuestionnaireMetricsDTO {
    
    // 总答题人数
    private Long totalRespondents;
    
    // 完成率（百分比）
    private Double completionRate;
    
    // 平均答题数量
    private Double averageQuestions;
    
    // 趋势信息
    private String trend;
    private Boolean trendUp;
    
    // 各个问题的到达人数
    private Map<String, Long> questionCoverage;

    public QuestionnaireMetricsDTO() {}

    public QuestionnaireMetricsDTO(Long totalRespondents, Double completionRate, 
                                  Double averageQuestions, Map<String, Long> questionCoverage) {
        this.totalRespondents = totalRespondents;
        this.completionRate = completionRate;
        this.averageQuestions = averageQuestions;
        this.questionCoverage = questionCoverage;
    }

    // Getters and Setters
    public Long getTotalRespondents() {
        return totalRespondents;
    }

    public void setTotalRespondents(Long totalRespondents) {
        this.totalRespondents = totalRespondents;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Double getAverageQuestions() {
        return averageQuestions;
    }

    public void setAverageQuestions(Double averageQuestions) {
        this.averageQuestions = averageQuestions;
    }

    public String getTrend() {
        return trend;
    }

    public void setTrend(String trend) {
        this.trend = trend;
    }

    public Boolean getTrendUp() {
        return trendUp;
    }

    public void setTrendUp(Boolean trendUp) {
        this.trendUp = trendUp;
    }

    public Map<String, Long> getQuestionCoverage() {
        return questionCoverage;
    }

    public void setQuestionCoverage(Map<String, Long> questionCoverage) {
        this.questionCoverage = questionCoverage;
    }
}

package com.example.demo.dashboard.dto;

/**
 * 问题概览 DTO (用于列表展示)
 */
public class QuestionSummaryDTO {
    
    private String questionId;
    private String questionText;
    private String theme;
    private Long totalReached;
    private Double reachRate;
    private String lastUpdated;

    public QuestionSummaryDTO() {}

    public QuestionSummaryDTO(String questionId, String questionText, String theme,
                             Long totalReached, Double reachRate, String lastUpdated) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.theme = theme;
        this.totalReached = totalReached;
        this.reachRate = reachRate;
        this.lastUpdated = lastUpdated;
    }

    // Getters and Setters
    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Long getTotalReached() {
        return totalReached;
    }

    public void setTotalReached(Long totalReached) {
        this.totalReached = totalReached;
    }

    public Double getReachRate() {
        return reachRate;
    }

    public void setReachRate(Double reachRate) {
        this.reachRate = reachRate;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}

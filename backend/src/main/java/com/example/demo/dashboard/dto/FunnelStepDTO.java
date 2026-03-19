package com.example.demo.dashboard.dto;

/**
 * 问卷漏斗分析步骤 DTO
 */
public class FunnelStepDTO {
    
    private String step;
    private Long respondents;
    private Long completed;
    private Double dropRate;
    private Double percentage;

    public FunnelStepDTO() {}

    public FunnelStepDTO(String step, Long respondents, Long completed, 
                        Double dropRate, Double percentage) {
        this.step = step;
        this.respondents = respondents;
        this.completed = completed;
        this.dropRate = dropRate;
        this.percentage = percentage;
    }

    // Getters and Setters
    public String getStep() {
        return step;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public Long getRespondents() {
        return respondents;
    }

    public void setRespondents(Long respondents) {
        this.respondents = respondents;
    }

    public Long getCompleted() {
        return completed;
    }

    public void setCompleted(Long completed) {
        this.completed = completed;
    }

    public Double getDropRate() {
        return dropRate;
    }

    public void setDropRate(Double dropRate) {
        this.dropRate = dropRate;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}

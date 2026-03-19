package com.example.demo.dashboard.dto;

/**
 * 问题选项分布 DTO
 */
public class QuestionOptionDTO {
    
    private String option;
    private Long count;
    private Integer percentage;

    public QuestionOptionDTO() {}

    public QuestionOptionDTO(String option, Long count, Integer percentage) {
        this.option = option;
        this.count = count;
        this.percentage = percentage;
    }

    // Getters and Setters
    public String getOption() {
        return option;
    }

    public void setOption(String option) {
        this.option = option;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public Integer getPercentage() {
        return percentage;
    }

    public void setPercentage(Integer percentage) {
        this.percentage = percentage;
    }
}

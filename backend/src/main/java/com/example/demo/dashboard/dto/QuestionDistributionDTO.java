package com.example.demo.dashboard.dto;

import java.util.List;

/**
 * 单个问题的选项分布 DTO
 */
public class QuestionDistributionDTO {
    
    private String questionId;
    private String questionText;
    private List<QuestionOptionDTO> options;
    private Long totalCount;

    public QuestionDistributionDTO() {}

    public QuestionDistributionDTO(String questionId, String questionText, 
                                   List<QuestionOptionDTO> options, Long totalCount) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.options = options;
        this.totalCount = totalCount;
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

    public List<QuestionOptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<QuestionOptionDTO> options) {
        this.options = options;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }
}

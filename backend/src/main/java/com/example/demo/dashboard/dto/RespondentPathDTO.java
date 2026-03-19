package com.example.demo.dashboard.dto;

import java.util.Map;

/**
 * 答题路径分布 DTO
 */
public class RespondentPathDTO {
    
    private String question;
    private Map<String, Long> pathDistribution;  // e.g., {"Path A": 320, "Path B": 280, ...}

    public RespondentPathDTO() {}

    public RespondentPathDTO(String question, Map<String, Long> pathDistribution) {
        this.question = question;
        this.pathDistribution = pathDistribution;
    }

    // Getters and Setters
    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Map<String, Long> getPathDistribution() {
        return pathDistribution;
    }

    public void setPathDistribution(Map<String, Long> pathDistribution) {
        this.pathDistribution = pathDistribution;
    }
}

package com.example.demo.ai.dto;

import java.util.List;

public class AiReportResponse {
    private String title;
    private String summary;
    private List<KeyInsight> keyInsights;
    private List<ThemeBlock> themes;
    private List<Recommendation> recommendations;
    private List<String> risksAndLimitations;
    private Metadata metadata;

    public static class KeyInsight {
        private String insight;
        private List<String> evidence;
        private double confidence;

        public String getInsight() { return insight; }
        public void setInsight(String insight) { this.insight = insight; }

        public List<String> getEvidence() { return evidence; }
        public void setEvidence(List<String> evidence) { this.evidence = evidence; }

        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
    }

    public static class ThemeBlock {
        private String theme;
        private List<String> why;
        private List<String> how;
        private List<String> painPoints;
        private List<String> opportunities;

        public String getTheme() { return theme; }
        public void setTheme(String theme) { this.theme = theme; }

        public List<String> getWhy() { return why; }
        public void setWhy(List<String> why) { this.why = why; }

        public List<String> getHow() { return how; }
        public void setHow(List<String> how) { this.how = how; }

        public List<String> getPainPoints() { return painPoints; }
        public void setPainPoints(List<String> painPoints) { this.painPoints = painPoints; }

        public List<String> getOpportunities() { return opportunities; }
        public void setOpportunities(List<String> opportunities) { this.opportunities = opportunities; }
    }

    public static class Recommendation {
        private String recommendation;
        private String rationale;
        private String priority;

        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

        public String getRationale() { return rationale; }
        public void setRationale(String rationale) { this.rationale = rationale; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }

    public static class Metadata {
        private String model;
        private String generatedAt;

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }

        public String getGeneratedAt() { return generatedAt; }
        public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<KeyInsight> getKeyInsights() { return keyInsights; }
    public void setKeyInsights(List<KeyInsight> keyInsights) { this.keyInsights = keyInsights; }

    public List<ThemeBlock> getThemes() { return themes; }
    public void setThemes(List<ThemeBlock> themes) { this.themes = themes; }

    public List<Recommendation> getRecommendations() { return recommendations; }
    public void setRecommendations(List<Recommendation> recommendations) { this.recommendations = recommendations; }

    public List<String> getRisksAndLimitations() { return risksAndLimitations; }
    public void setRisksAndLimitations(List<String> risksAndLimitations) { this.risksAndLimitations = risksAndLimitations; }

    public Metadata getMetadata() { return metadata; }
    public void setMetadata(Metadata metadata) { this.metadata = metadata; }
}

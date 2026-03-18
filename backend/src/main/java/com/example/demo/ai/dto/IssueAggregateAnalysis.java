package com.example.demo.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO for aggregated AI analysis of an issue.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueAggregateAnalysis {

    private SentimentInfo sentiment;
    private List<KeywordFreq> keywords;
    private List<ThemeCluster> themes;

    /**
     * Data for heatmap or charts, identifying most active user tags.
     * Key: Tag name (e.g., "Youth", "Professional").
     */
    private Map<String, TagActivity> activeUserTags;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TagActivity {
        private int count;
        private String sentiment; // e.g., "Positive", "Neutral", "Negative"
    }

    /**
     * A structured summary formatted for a policy report.
     */
    private String policyReportContent;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SentimentInfo {
        private double positivePercentage;
        private double neutralPercentage;
        private double negativePercentage;
        private String overallSentiment;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KeywordFreq {
        private String word;
        private int frequency;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThemeCluster {
        private String themeName;
        private String description;
        private List<String> evidenceQuotes;
    }
}

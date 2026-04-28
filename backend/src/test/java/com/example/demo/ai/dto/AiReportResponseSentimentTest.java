package com.example.demo.ai.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AiReportResponseSentimentTest {

    @Test
    void fromStringHandlesNullCaseInsensitiveAndUnknownValues() {
        assertThat(AiReportResponse.Sentiment.fromString(null)).isEqualTo(AiReportResponse.Sentiment.Neutral);
        assertThat(AiReportResponse.Sentiment.fromString("positive")).isEqualTo(AiReportResponse.Sentiment.Positive);
        assertThat(AiReportResponse.Sentiment.fromString("  anxIoUs  ")).isEqualTo(AiReportResponse.Sentiment.Anxious);
        assertThat(AiReportResponse.Sentiment.fromString("something-else")).isEqualTo(AiReportResponse.Sentiment.Neutral);
    }

    @Test
    void toValueReturnsEnumName() {
        assertThat(AiReportResponse.Sentiment.Expectant.toValue()).isEqualTo("Expectant");
    }
}

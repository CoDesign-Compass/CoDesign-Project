package com.example.demo.submission.dto;

public class SubmissionTrendPointResponse {
    private String period;
    private long count;

    public SubmissionTrendPointResponse(String period, long count) {
        this.period = period;
        this.count = count;
    }

    public String getPeriod() {
        return period;
    }

    public long getCount() {
        return count;
    }
}

package com.example.demo.submission.dto;

public class MonthlySubmissionCountResponse {
    private String month;
    private long count;

    public MonthlySubmissionCountResponse(String month, long count) {
        this.month = month;
        this.count = count;
    }

    public String getMonth() {
        return month;
    }

    public long getCount() {
        return count;
    }
}

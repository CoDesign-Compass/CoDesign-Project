package com.example.demo.dto;

import java.util.List;

public class AIProcessedDataDto {
    private String shareId;
    private String issueContent;
    private String stance;
    private List<QAItemDto> why;
    private List<QAItemDto> how;
    private String mergedWhyText;
    private String mergedHowText;

    public AIProcessedDataDto() {
    }

    public AIProcessedDataDto(
            String shareId,
            String issueContent,
            String stance,
            List<QAItemDto> why,
            List<QAItemDto> how,
            String mergedWhyText,
            String mergedHowText
    ) {
        this.shareId = shareId;
        this.issueContent = issueContent;
        this.stance = stance;
        this.why = why;
        this.how = how;
        this.mergedWhyText = mergedWhyText;
        this.mergedHowText = mergedHowText;
    }

    public String getShareId() {
        return shareId;
    }

    public void setShareId(String shareId) {
        this.shareId = shareId;
    }

    public String getIssueContent() {
        return issueContent;
    }

    public void setIssueContent(String issueContent) {
        this.issueContent = issueContent;
    }

    public String getStance() {
        return stance;
    }

    public void setStance(String stance) {
        this.stance = stance;
    }

    public List<QAItemDto> getWhy() {
        return why;
    }

    public void setWhy(List<QAItemDto> why) {
        this.why = why;
    }

    public List<QAItemDto> getHow() {
        return how;
    }

    public void setHow(List<QAItemDto> how) {
        this.how = how;
    }

    public String getMergedWhyText() {
        return mergedWhyText;
    }

    public void setMergedWhyText(String mergedWhyText) {
        this.mergedWhyText = mergedWhyText;
    }

    public String getMergedHowText() {
        return mergedHowText;
    }

    public void setMergedHowText(String mergedHowText) {
        this.mergedHowText = mergedHowText;
    }
}
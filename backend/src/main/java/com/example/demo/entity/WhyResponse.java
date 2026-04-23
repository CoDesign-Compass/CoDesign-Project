package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "why_responses")
public class WhyResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shareId;

    private String stance;

    @Column(length = 2000)
    private String answer1;

    @Column(length = 2000)
    private String answer2;

    @Column(length = 2000)
    private String answer3;

    @Column(length = 2000)
    private String answer4;

    @Column(length = 2000)
    private String answer5;

    private Long submissionId;

    private LocalDateTime createdAt = LocalDateTime.now();

    public WhyResponse() {}

    public Long getId() { return id; }

    public String getShareId() { return shareId; }
    public void setShareId(String shareId) { this.shareId = shareId; }

    public String getStance() { return stance; }
    public void setStance(String stance) { this.stance = stance; }

    public String getAnswer1() { return answer1; }
    public void setAnswer1(String answer1) { this.answer1 = answer1; }

    public String getAnswer2() { return answer2; }
    public void setAnswer2(String answer2) { this.answer2 = answer2; }

    public String getAnswer3() { return answer3; }
    public void setAnswer3(String answer3) { this.answer3 = answer3; }

    public String getAnswer4() { return answer4; }
    public void setAnswer4(String answer4) { this.answer4 = answer4; }

    public String getAnswer5() { return answer5; }
    public void setAnswer5(String answer5) { this.answer5 = answer5; }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
}
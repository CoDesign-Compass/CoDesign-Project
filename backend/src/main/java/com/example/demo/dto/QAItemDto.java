package com.example.demo.dto;

public class QAItemDto {
    private int questionIndex;
    private String answer;

    public QAItemDto() {
    }

    public QAItemDto(int questionIndex, String answer) {
        this.questionIndex = questionIndex;
        this.answer = answer;
    }

    public int getQuestionIndex() {
        return questionIndex;
    }

    public void setQuestionIndex(int questionIndex) {
        this.questionIndex = questionIndex;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
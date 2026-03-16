package com.example.demo.service;

import com.example.demo.dto.AIProcessedDataDto;
import com.example.demo.dto.QAItemDto;
import com.example.demo.entity.HowResponse;
import com.example.demo.entity.Issue;
import com.example.demo.entity.WhyResponse;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.WhyResponseRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIDataProcessingService {

    private final IssueRepository issueRepository;
    private final WhyResponseRepository whyResponseRepository;
    private final HowResponseRepository howResponseRepository;

    public AIDataProcessingService(
            IssueRepository issueRepository,
            WhyResponseRepository whyResponseRepository,
            HowResponseRepository howResponseRepository
    ) {
        this.issueRepository = issueRepository;
        this.whyResponseRepository = whyResponseRepository;
        this.howResponseRepository = howResponseRepository;
    }

    public AIProcessedDataDto prepareSubmissionForAI(String shareId) {
        Issue issue = issueRepository.findByShareId(shareId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found for shareId: " + shareId));

        WhyResponse whyResponse = whyResponseRepository
                .findTopByShareIdOrderByCreatedAtDesc(shareId)
                .orElse(null);

        HowResponse howResponse = howResponseRepository
                .findTopByShareIdOrderByCreatedAtDesc(shareId)
                .orElse(null);

        List<QAItemDto> whyItems = buildWhyItems(whyResponse);
        List<QAItemDto> howItems = buildHowItems(howResponse);

        String cleanedIssueContent = cleanText(issue.getIssueContent());
        String cleanedStance = whyResponse != null ? cleanText(whyResponse.getStance()) : null;

        String mergedWhyText = mergeAnswers(whyItems);
        String mergedHowText = mergeAnswers(howItems);

        return new AIProcessedDataDto(
                shareId,
                cleanedIssueContent,
                cleanedStance,
                whyItems,
                howItems,
                mergedWhyText,
                mergedHowText
        );
    }

    private List<QAItemDto> buildWhyItems(WhyResponse whyResponse) {
        List<QAItemDto> result = new ArrayList<>();
        if (whyResponse == null) {
            return result;
        }

        addIfValid(result, 1, whyResponse.getAnswer1());
        addIfValid(result, 2, whyResponse.getAnswer2());
        addIfValid(result, 3, whyResponse.getAnswer3());
        addIfValid(result, 4, whyResponse.getAnswer4());
        addIfValid(result, 5, whyResponse.getAnswer5());

        return result;
    }

    private List<QAItemDto> buildHowItems(HowResponse howResponse) {
        List<QAItemDto> result = new ArrayList<>();
        if (howResponse == null) {
            return result;
        }

        addIfValid(result, 1, howResponse.getAnswer1());
        addIfValid(result, 2, howResponse.getAnswer2());
        addIfValid(result, 3, howResponse.getAnswer3());
        addIfValid(result, 4, howResponse.getAnswer4());
        addIfValid(result, 5, howResponse.getAnswer5());

        return result;
    }

    private void addIfValid(List<QAItemDto> list, int questionIndex, String rawAnswer) {
        String cleaned = cleanText(rawAnswer);
        if (cleaned != null) {
            list.add(new QAItemDto(questionIndex, cleaned));
        }
    }

    private String cleanText(String text) {
        if (text == null) {
            return null;
        }

        String cleaned = text.trim().replaceAll("\\s+", " ");

        if (cleaned.isEmpty()) {
            return null;
        }

        return cleaned;
    }

    private String mergeAnswers(List<QAItemDto> items) {
        return items.stream()
                .map(QAItemDto::getAnswer)
                .collect(Collectors.joining(" "));
    }
}
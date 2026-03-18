package com.example.demo.ai;

import com.example.demo.ai.dto.IssueAggregateAnalysis;
import com.example.demo.entity.HowResponse;
import com.example.demo.entity.Issue;
import com.example.demo.entity.WhyResponse;
import com.example.demo.model.Tag;
import com.example.demo.model.UserProfile;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.WhyResponseRepository;
import com.example.demo.repository.UserProfileRepository;
import com.example.demo.submission.Submission;
import com.example.demo.submission.SubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for aggregated AI analysis of all feedback within a specific issue.
 */
@Service
@Slf4j
public class IssueAiService {

    private final ChatClient chatClient;
    private final IssueRepository issueRepository;
    private final WhyResponseRepository whyResponseRepository;
    private final HowResponseRepository howResponseRepository;
    private final SubmissionRepository submissionRepository;
    private final UserProfileRepository userProfileRepository;

    public IssueAiService(ChatClient.Builder builder,
                          IssueRepository issueRepository,
                          WhyResponseRepository whyResponseRepository,
                          HowResponseRepository howResponseRepository,
                          SubmissionRepository submissionRepository,
                          UserProfileRepository userProfileRepository) {
        this.chatClient = builder
                .defaultSystem("You are a Senior Policy Advisor and Data Analyst. " +
                        "Your goal is to analyze collective user feedback on public policy issues. " +
                        "You must identify sentiment patterns, extract key themes, and analyze how different demographic groups (user tags) interact with the issue.")
                .build();
        this.issueRepository = issueRepository;
        this.whyResponseRepository = whyResponseRepository;
        this.howResponseRepository = howResponseRepository;
        this.submissionRepository = submissionRepository;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Performs a comprehensive analysis of all submissions for a given issue.
     *
     * @param shareId The unique share identifier for the issue.
     * @return Aggregated analysis results including sentiment, keywords, themes, and demographic heatmaps.
     */
    public IssueAggregateAnalysis analyzeIssueFeedback(String shareId) {
        Issue issue = issueRepository.findByShareId(shareId)
                .orElseThrow(() -> new RuntimeException("Issue not found for shareId: " + shareId));

        List<Submission> submissions = submissionRepository.findByIssueId(issue.getIssueId());
        List<WhyResponse> whyResponses = whyResponseRepository.findByShareId(shareId);
        List<HowResponse> howResponses = howResponseRepository.findByShareId(shareId);

        // Map users to their profiles to get tags
        Set<String> userIds = submissions.stream()
                .map(s -> s.getUserId() != null ? String.valueOf(s.getUserId()) : null)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        Map<String, UserProfile> profileMap = userProfileRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, p -> p));

        // Build the data context for the AI
        String dataContext = buildDataContext(issue, whyResponses, howResponses, submissions, profileMap);

        log.info("Starting AI aggregation for issue: {}", shareId);

        // Call AI using Structured Output
        return chatClient.prompt()
                .user(u -> u.text("Analyze the following aggregated feedback data and generate a comprehensive report.\n\n" +
                                "### DATA CONTEXT ###\n" +
                                "{context}\n\n" +
                                "### INSTRUCTIONS ###\n" +
                                "1. Calculate sentiment distribution (Positive, Neutral, Negative).\n" +
                                "2. Identify the top 10 most frequent keywords.\n" +
                                "3. Group responses into 3-5 major themes with evidence quotes.\n" +
                                "4. Analyze activity counts and sentiment patterns for each user tag (e.g., demographics). " +
                                "The 'activeUserTags' must be a JSON object where keys are tag labels and values are objects containing 'count' (int) and 'sentiment' (string).\n" +
                                "5. Generate a professional summary suitable for a policy report.")
                        .param("context", dataContext))
                .call()
                .entity(IssueAggregateAnalysis.class);
    }

    private String buildDataContext(Issue issue, 
                                    List<WhyResponse> why, 
                                    List<HowResponse> how, 
                                    List<Submission> submissions,
                                    Map<String, UserProfile> profiles) {
        StringBuilder sb = new StringBuilder();
        sb.append("ISSUE TITLE: ").append(issue.getIssueContent()).append("\n\n");

        sb.append("--- USER FEEDBACK SNAPSHOT ---\n");
        // Combine feedback and profile tags for contextual analysis
        for (int i = 0; i < why.size(); i++) {
            WhyResponse wr = why.get(i);
            sb.append("Entry #").append(i + 1).append(":\n");
            sb.append("  - Stance: ").append(wr.getStance()).append("\n");
            sb.append("  - Why Content: ").append(wr.getAnswer1()).append(" ").append(wr.getAnswer2()).append("\n");
            
            // Try to match with profile tags if possible (simplified logic)
            // In a real scenario, you'd match via submission ID or user ID
            sb.append("\n");
        }

        sb.append("\n--- DEMOGRAPHIC TAGS DISTRIBUTION ---\n");
        Map<String, Integer> tagCounts = new HashMap<>();
        profiles.values().forEach(p -> {
            if (p.getSelectedTags() != null) {
                p.getSelectedTags().forEach(t -> tagCounts.merge(t.getLabel(), 1, Integer::sum));
            }
        });
        
        tagCounts.forEach((label, count) -> sb.append("- ").append(label).append(": ").append(count).append(" users\n"));

        return sb.toString();
    }
}

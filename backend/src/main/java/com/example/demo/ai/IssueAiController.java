package com.example.demo.ai;

import com.example.demo.ai.dto.IssueAggregateAnalysis;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for issue-wide AI analysis.
 */
@RestController
@RequestMapping("/api/ai/analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IssueAiController {

    private final IssueAiService issueAiService;

    /**
     * Get aggregated AI analysis for an issue, including sentiment, themes, 
     * and demographic tag activity.
     * 
     * @param shareId The shareId of the issue to analyze.
     * @return Aggregated analysis report.
     */
    @GetMapping("/{shareId}")
    public IssueAggregateAnalysis getAnalysis(@PathVariable String shareId) {
        return issueAiService.analyzeIssueFeedback(shareId);
    }
}

package com.example.demo.ai;

import com.example.demo.ai.dto.AiReportResponse;
import com.example.demo.ai.dto.GenerateAiReportRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-report")
public class AiReportController {

    private final AiReportService aiReportService;

    public AiReportController(AiReportService aiReportService) {
        this.aiReportService = aiReportService;
    }

    @PostMapping("/generate")
    public AiReportResponse generate(@RequestBody GenerateAiReportRequest request) {
        return aiReportService.generateReport(request.getSubmissionId());
    }

    @GetMapping("/submission/{submissionId}")
    public AiReport getLatestBySubmission(@PathVariable Long submissionId) {
        return aiReportService.getLatestBySubmissionId(submissionId);
    }
}
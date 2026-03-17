package com.example.demo.ai.analysis;

import com.example.demo.ai.analysis.dto.AnalysisResult;
import com.example.demo.ai.analysis.dto.AnalyzeByShareRequest;
import com.example.demo.ai.analysis.dto.AnalyzeRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-analysis")
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;

    public AiAnalysisController(AiAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    @PostMapping("/analyze")
    public AnalysisResult analyze(@RequestBody AnalyzeRequest request) {
        return aiAnalysisService.analyzeResponses(request.getResponses());
    }

    @PostMapping("/analyze-by-share")
    public AnalysisResult analyzeByShare(@RequestBody AnalyzeByShareRequest request) {
        return aiAnalysisService.analyzeByShareId(request.getShareId());
    }
}

package com.example.demo.controller;

import com.example.demo.dto.AIProcessedDataDto;
import com.example.demo.service.AIDataProcessingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-data")
@CrossOrigin
public class AIDataProcessingController {

    private final AIDataProcessingService aiDataProcessingService;

    public AIDataProcessingController(AIDataProcessingService aiDataProcessingService) {
        this.aiDataProcessingService = aiDataProcessingService;
    }

    @GetMapping("/{shareId}")
    public ResponseEntity<?> getProcessedData(@PathVariable String shareId) {
        try {
            AIProcessedDataDto result = aiDataProcessingService.prepareSubmissionForAI(shareId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process AI data: " + e.getMessage());
        }
    }
}
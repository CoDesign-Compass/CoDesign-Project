package com.example.demo.submission;

import com.example.demo.submission.dto.CreateSubmissionRequest;
import com.example.demo.submission.dto.SubmitSubmissionRequest;
import com.example.demo.submission.dto.SubmitSubmissionResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService service;

    public SubmissionController(SubmissionService service) {
        this.service = service;
    }

    // Minimal helper endpoint so you can get an id to test /submit
    @PostMapping
    public ResponseEntity<?> createSubmission(@Valid @RequestBody CreateSubmissionRequest req) {
        Submission created = service.createDraft(req);
        return ResponseEntity.ok(Map.of(
                "id", created.getId(),
                "issueId", created.getIssueId(),
                "status", created.getStatus().name()
        ));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<SubmitSubmissionResponse> submit(
            @PathVariable Long id,
            @Valid @RequestBody SubmitSubmissionRequest req
    ) {
        return ResponseEntity.ok(service.submit(id, req));
    }

    @PostMapping("/{id}/link-account")
    public Submission linkAccount(@PathVariable Long id, @RequestBody LinkAccountRequest req) {
        return service.linkAccount(id, req.getUserId());
    }
}

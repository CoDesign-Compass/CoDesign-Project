package com.example.demo.helper;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelpController {

    private final HelpRequestRepository repo;

    public HelpController(HelpRequestRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/help")
    public ResponseEntity<?> create(@RequestBody HelpRequestDto dto, HttpServletRequest request) {

        // ---- validation ----
        if (dto.email() == null || dto.email().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "email required"));
        }
        if (!dto.email().matches("^\\S+@\\S+\\.\\S+$")) {
            return ResponseEntity.badRequest().body(Map.of("error", "invalid email"));
        }
        if (dto.message() == null || dto.message().trim().length() < 5) {
            return ResponseEntity.badRequest().body(Map.of("error", "message too short"));
        }

        // ---- persist ----
        HelpRequest e = new HelpRequest();
        e.setEmail(dto.email().trim());
        e.setMessage(dto.message().trim());
        e.setShareId(dto.shareId());
        e.setIssueId(dto.issueId());
        e.setSubmissionId(dto.submissionId());
        e.setPagePath(dto.pagePath());

        String ua = request.getHeader("User-Agent");
        e.setUserAgent(ua);

        HelpRequest saved = repo.save(e);

        return ResponseEntity.ok(Map.of("id", saved.getId()));
    }
}

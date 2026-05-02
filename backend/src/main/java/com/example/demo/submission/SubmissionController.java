package com.example.demo.submission;

import com.example.demo.submission.dto.CreateSubmissionRequest;
import com.example.demo.submission.dto.MonthlySubmissionCountResponse;
import com.example.demo.submission.dto.SubmissionTrendPointResponse;
import com.example.demo.submission.dto.SubmitSubmissionRequest;
import com.example.demo.submission.dto.SubmitSubmissionResponse;
import com.example.demo.submission.dto.WordCloudTermResponse;
import com.example.demo.submission.dto.UpdateThanksRequest;
import com.example.demo.user.dto.SendGiftEmailRequest;
import com.example.demo.user.dto.SendUpdateEmailRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    private static final Logger log = LoggerFactory.getLogger(SubmissionController.class);

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
    public ResponseEntity<SubmitSubmissionResponse> submit(@PathVariable Long id) {
    return ResponseEntity.ok(service.submit(id));
    }

    @PostMapping("/{id}/link-account")
    public Submission linkAccount(@PathVariable Long id, @RequestBody LinkAccountRequest req) {
        return service.linkAccount(id, req.getUserId());
    }

    @PatchMapping("/{id}/thanks")
    public ResponseEntity<Submission> updateThanksInfo(
            @PathVariable Long id,
            @Valid @RequestBody UpdateThanksRequest req
    ) {
        return ResponseEntity.ok(service.updateThanksInfo(id, req));
    }

    @GetMapping("/email-subscribers")
    public ResponseEntity<List<Submission>> getEmailSubscribers() {
        return ResponseEntity.ok(service.getEmailSubscribers());
    }

    @PostMapping("/{id}/send-gift-email")
    public ResponseEntity<?> sendGiftEmailToSubmission(
            @PathVariable Long id,
            @Valid @RequestBody SendGiftEmailRequest req
    ) {
        log.info("send-gift-email called. submissionId={}", id);
        try {
            service.sendGiftEmailToSubmission(id, req.getVoucherCode(), req.getTemplate());
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
        return ResponseEntity.ok(Map.of("sent", true));
    }

    @PostMapping("/{id}/send-update-email")
    public ResponseEntity<?> sendUpdateEmailToSubmission(
            @PathVariable Long id,
            @Valid @RequestBody SendUpdateEmailRequest req
    ) {
        try {
            service.sendUpdateEmailToSubmission(id, req.getIssueId(), req.getTemplate());
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
        return ResponseEntity.ok(Map.of("sent", true));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getTotalSubmissions(
            @RequestParam(required = false) Long issueId
    ) {
        long count = (issueId == null)
                ? service.getTotalSubmissions()
                : service.getTotalSubmissionsByIssue(issueId);

        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlySubmissionCountResponse>> getMonthlySubmittedCounts(
            @RequestParam(defaultValue = "12") int months
    ) {
        return ResponseEntity.ok(service.getMonthlySubmittedCounts(months));
    }

    @GetMapping("/trend")
    public ResponseEntity<List<SubmissionTrendPointResponse>> getIssueSubmissionTrend(
            @RequestParam Long issueId,
            @RequestParam(defaultValue = "month") String granularity,
            @RequestParam(required = false) Integer points
    ) {
        int resolvedPoints = points == null
                ? ("day".equalsIgnoreCase(granularity) ? 30 : 12)
                : points;

        return ResponseEntity.ok(service.getIssueSubmissionTrend(issueId, granularity, resolvedPoints));
    }

    @GetMapping("/avg-response-time")
    public ResponseEntity<Map<String, Double>> getAverageResponseTime(
            @RequestParam Long issueId
    ) {
        return ResponseEntity.ok(Map.of(
                "avgResponseSeconds",
                service.getAverageResponseSecondsByIssue(issueId)
        ));
    }

    @GetMapping(value = "/raw-data/profile", produces = "text/csv")
    public ResponseEntity<byte[]> exportIssueProfileRawDataCsv(@RequestParam Long issueId) {
        String csv = service.generateIssueProfileRawDataCsv(issueId);
        String filename = "issue-" + issueId + "-profile-raw-data.csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    @GetMapping(value = "/raw-data/why", produces = "text/csv")
    public ResponseEntity<byte[]> exportIssueWhyRawDataCsv(@RequestParam Long issueId) {
        String csv = service.generateIssueWhyRawDataCsv(issueId);
        String filename = "issue-" + issueId + "-why-raw-data.csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    @GetMapping(value = "/raw-data/how", produces = "text/csv")
    public ResponseEntity<byte[]> exportIssueHowRawDataCsv(@RequestParam Long issueId) {
        String csv = service.generateIssueHowRawDataCsv(issueId);
        String filename = "issue-" + issueId + "-how-raw-data.csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    @GetMapping("/word-cloud/why")
    public ResponseEntity<List<WordCloudTermResponse>> getIssueWhyWordCloud(
            @RequestParam Long issueId
    ) {
        return ResponseEntity.ok(service.getIssueWhyWordCloud(issueId));
    }

    @GetMapping("/word-cloud/how")
    public ResponseEntity<List<WordCloudTermResponse>> getIssueHowWordCloud(
            @RequestParam Long issueId
    ) {
        return ResponseEntity.ok(service.getIssueHowWordCloud(issueId));
    }

    @GetMapping("/word-cloud/profile")
    public ResponseEntity<List<WordCloudTermResponse>> getIssueProfileWordCloud(
            @RequestParam Long issueId
    ) {
        return ResponseEntity.ok(service.getIssueProfileWordCloud(issueId));
    }
}

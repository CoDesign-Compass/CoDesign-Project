package com.example.demo.service;

import com.example.demo.dto.CreateIssueRequest;
import com.example.demo.dto.IssueResponse;
import com.example.demo.entity.Issue;
import com.example.demo.entity.IssueState;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.IssueRepository;
import com.example.demo.repository.WhyResponseRepository;
import com.example.demo.submission.SubmissionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final SubmissionRepository submissionRepository;
    private final WhyResponseRepository whyResponseRepository;
    private final HowResponseRepository howResponseRepository;

    public IssueService(IssueRepository issueRepository,
                        SubmissionRepository submissionRepository,
                        WhyResponseRepository whyResponseRepository,
                        HowResponseRepository howResponseRepository) {
        this.issueRepository = issueRepository;
        this.submissionRepository = submissionRepository;
        this.whyResponseRepository = whyResponseRepository;
        this.howResponseRepository = howResponseRepository;
    }

    public IssueResponse createIssue(CreateIssueRequest request) {
        String content = request.getIssueContent() == null ? "" : request.getIssueContent().trim();

        if (content.isEmpty()) {
            throw new IllegalArgumentException("Issue content must not be empty.");
        }

        String consentText = normalizeConsentText(request.getConsentText());

        Issue issue = new Issue();
        issue.setIssueContent(content);
        issue.setConsentText(consentText);
        issue.setState(IssueState.ACTIVE);
        issue.setPublishedAt(OffsetDateTime.now());
        issue.setShareId(generateUniqueShareId());

        Issue saved = issueRepository.save(issue);
        return toResponse(saved);
    }

    public List<IssueResponse> getAllIssues() {
        return issueRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public IssueResponse getIssueById(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found."));
        return toResponse(issue);
    }

    public IssueResponse getIssueByShareId(String shareId) {
        Issue issue = issueRepository.findByShareId(shareId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found."));
        return toResponse(issue);
    }

    public IssueResponse updateIssue(Long issueId, CreateIssueRequest request) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found."));

        String content = request.getIssueContent() == null ? "" : request.getIssueContent().trim();

        if (content.isEmpty()) {
            throw new IllegalArgumentException("Issue content must not be empty.");
        }

        String consentText = normalizeConsentText(request.getConsentText());

        issue.setIssueContent(content);
        issue.setConsentText(consentText);

        Issue updated = issueRepository.save(issue);
        return toResponse(updated);
    }

    @Transactional
    public void deleteIssue(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found."));

        String shareId = issue.getShareId();

        whyResponseRepository.deleteByShareId(shareId);
        howResponseRepository.deleteByShareId(shareId);
        submissionRepository.deleteByIssueId(issueId);
        issueRepository.delete(issue);
    }

    private String generateUniqueShareId() {
        String shareId;
        do {
            shareId = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        } while (issueRepository.existsByShareId(shareId));
        return shareId;
    }

    private String normalizeConsentText(String consentText) {
        if (consentText == null) {
            throw new IllegalArgumentException("Consent text must not be empty.");
        }

        String trimmed = consentText.trim();

        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("Consent text must not be empty.");
        }

        if (trimmed.length() > 5000) {
            throw new IllegalArgumentException("Consent text must not exceed 5000 characters.");
        }

        return trimmed;
    }

    private IssueResponse toResponse(Issue issue) {
        return new IssueResponse(
                issue.getIssueId(),
                issue.getShareId(),
                issue.getIssueContent(),
                issue.getConsentText(),
                issue.getState(),
                issue.getPublishedAt()
        );
    }
}
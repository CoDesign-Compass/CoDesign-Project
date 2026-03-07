package com.example.demo.submission;

import com.example.demo.submission.dto.CreateSubmissionRequest;
import com.example.demo.submission.dto.SubmitSubmissionRequest;
import com.example.demo.submission.dto.SubmitSubmissionResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class SubmissionService {
    private final SubmissionRepository repo;

    public SubmissionService(SubmissionRepository repo){
        this.repo = repo;
    }

    @Transactional
    public Submission createDraft(CreateSubmissionRequest req) {
        Submission s = new Submission();
        s.setIssueId(req.getIssueId());
        s.setStatus(Submission.Status.DRAFT);
        return repo.save(s);
    }


    @Transactional
    public SubmitSubmissionResponse submit(Long id, SubmitSubmissionRequest req) {
        Submission s = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SUBMISSION_NOT_FOUND"));

        if (s.getStatus() == Submission.Status.SUBMITTED) {
            throw new IllegalStateException("ALREADY_SUBMITTED");
        }

        
        String email = req.getEmail();
        boolean hasEmail = (email != null && !email.trim().isEmpty());

        boolean needsEmail = req.isWantsVoucher() || req.isWantsUpdates();

        if (needsEmail && !hasEmail) {
                throw new IllegalArgumentException("EMAIL_REQUIRED");

        }

        s.setEmail(hasEmail ? email.trim() : null);
        s.setWantsVoucher(req.isWantsVoucher());
        s.setWantsUpdates(req.isWantsUpdates());

        s.setStatus(Submission.Status.SUBMITTED);
        s.setSubmittedAt(LocalDateTime.now());

        repo.save(s);

        return new SubmitSubmissionResponse(s.getId(), s.getStatus().name(), s.getSubmittedAt());
    }

    @Transactional
    public Submission linkAccount(Long submissionId, Long userId) {
        Submission s = repo.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("SUBMISSION_NOT_FOUND"));

        if (userId == null) {
            throw new IllegalArgumentException("USER_ID_REQUIRED");
        }

        s.setUserId(userId);
        return repo.save(s);
    }
    
}

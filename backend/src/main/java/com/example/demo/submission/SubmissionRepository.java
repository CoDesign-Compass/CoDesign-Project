package com.example.demo.submission;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByIssueId(Long issueId);
}

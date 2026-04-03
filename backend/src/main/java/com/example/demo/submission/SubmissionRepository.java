package com.example.demo.submission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    long countByStatus(Submission.Status status);
    long countByIssueIdAndStatus(Long issueId, Submission.Status status);
    List<Submission> findByIssueIdOrderByCreatedAtDesc(Long issueId);

    @Query(value = """
            SELECT COUNT(s.id)
            FROM submissions s
            INNER JOIN issues i ON i.issue_id = s.issue_id
            WHERE s.status = 'SUBMITTED'
            """, nativeQuery = true)
    long countSubmittedForExistingIssues();

    void deleteByIssueId(Long issueId);

    @Query(value = """
            SELECT DATE_TRUNC('month', submitted_at) AS month_start, COUNT(*) AS total
            FROM submissions
            WHERE status = 'SUBMITTED' AND submitted_at IS NOT NULL
            GROUP BY month_start
            ORDER BY month_start
            """, nativeQuery = true)
    List<Object[]> findMonthlySubmittedCounts();

    @Query(value = """
            SELECT DATE_TRUNC('month', submitted_at) AS month_start, COUNT(*) AS total
            FROM submissions
            WHERE issue_id = :issueId AND status = 'SUBMITTED' AND submitted_at IS NOT NULL
            GROUP BY month_start
            ORDER BY month_start
            """, nativeQuery = true)
    List<Object[]> findMonthlySubmittedCountsByIssueId(@Param("issueId") Long issueId);

    @Query(value = """
            SELECT DATE_TRUNC('day', submitted_at) AS day_start, COUNT(*) AS total
            FROM submissions
            WHERE issue_id = :issueId AND status = 'SUBMITTED' AND submitted_at IS NOT NULL
            GROUP BY day_start
            ORDER BY day_start
            """, nativeQuery = true)
    List<Object[]> findDailySubmittedCountsByIssueId(@Param("issueId") Long issueId);

    @Query(value = """
            SELECT AVG(EXTRACT(EPOCH FROM (submitted_at - created_at)))
            FROM submissions
            WHERE issue_id = :issueId
              AND status = 'SUBMITTED'
              AND submitted_at IS NOT NULL
              AND created_at IS NOT NULL
            """, nativeQuery = true)
    Double findAverageResponseSecondsByIssueId(@Param("issueId") Long issueId);

}

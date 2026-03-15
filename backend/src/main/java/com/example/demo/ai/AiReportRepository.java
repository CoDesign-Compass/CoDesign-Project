package com.example.demo.ai;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiReportRepository extends JpaRepository<AiReport, Long> {
    Optional<AiReport> findTopBySubmissionIdOrderByCreatedAtDesc(Long submissionId);
}
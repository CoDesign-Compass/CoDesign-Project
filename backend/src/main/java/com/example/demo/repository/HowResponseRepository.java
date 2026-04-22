package com.example.demo.repository;

import com.example.demo.entity.HowResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HowResponseRepository extends JpaRepository<HowResponse, Long> {
    void deleteByShareId(String shareId);

    List<HowResponse> findByShareId(String shareId);

    Optional<HowResponse> findTopByShareIdOrderByCreatedAtDesc(String shareId);
    
    List<HowResponse> findBySubmissionId(Long submissionId);

    Optional<HowResponse> findTopBySubmissionIdOrderByCreatedAtDesc(Long submissionId);

    List<HowResponse> findBySubmissionIdIn(List<Long> submissionIds);
}
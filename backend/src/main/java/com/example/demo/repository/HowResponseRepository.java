package com.example.demo.repository;

import com.example.demo.entity.HowResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HowResponseRepository extends JpaRepository<HowResponse, Long> {
    List<HowResponse> findByShareId(String shareId);

    Optional<HowResponse> findTopByShareIdOrderByCreatedAtDesc(String shareId);
}
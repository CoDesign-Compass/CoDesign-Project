package com.example.demo.repository;

import com.example.demo.entity.WhyResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WhyResponseRepository extends JpaRepository<WhyResponse, Long> {
    void deleteByShareId(String shareId);

    List<WhyResponse> findByShareId(String shareId);

    Optional<WhyResponse> findTopByShareIdOrderByCreatedAtDesc(String shareId);
}
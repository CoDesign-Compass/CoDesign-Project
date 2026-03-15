package com.example.demo.repository;

import com.example.demo.entity.HowResponse;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HowResponseRepository extends JpaRepository<HowResponse, Long> {
    List<HowResponse> findByShareId(String shareId);
}
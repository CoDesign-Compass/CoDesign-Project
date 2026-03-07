package com.example.demo.repository;

import com.example.demo.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue, Long> {
  Optional<Issue> findByShareId(String shareId);
  boolean existsByShareId(String shareId);
}
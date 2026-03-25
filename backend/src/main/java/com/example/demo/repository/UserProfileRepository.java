package com.example.demo.repository;

import com.example.demo.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findBySubmissionId(String submissionId);
}

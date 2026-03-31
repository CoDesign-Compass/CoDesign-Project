package com.example.demo.repository;

import com.example.demo.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findBySubmissionId(String submissionId);

    @Query(value = """
            SELECT t.label AS label, COUNT(*) AS value
            FROM user_profile_tags upt
            JOIN tags t ON t.id = upt.tag_id
            JOIN submissions s ON CAST(s.id AS TEXT) = upt.submission_id
            JOIN issues i ON i.issue_id = s.issue_id
            WHERE i.share_id = :shareId
            GROUP BY t.label
            ORDER BY value DESC, label ASC
            """, nativeQuery = true)
    List<Object[]> findProfileTagCountsByShareId(@Param("shareId") String shareId);
}

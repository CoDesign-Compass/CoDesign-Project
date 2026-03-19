package com.example.demo.controller;

import com.example.demo.model.Tag;
import com.example.demo.model.UserProfile;
import com.example.demo.service.ProfileService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // allow frontend cross-origin
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/{submissionId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable String submissionId) {
        return ResponseEntity.ok(profileService.getProfile(submissionId)
                .orElse(new UserProfile(submissionId, "", new java.util.HashSet<>())));
    }

    @PostMapping("/{submissionId}")
    public ResponseEntity<UserProfile> saveProfile(
            @PathVariable String submissionId,
            @RequestBody ProfileRequest request) {
        UserProfile profile = profileService.saveProfile(submissionId, request.getName(), request.getTagIds());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/tags")
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(profileService.getAllSystemTags());
    }

    @PostMapping("/tags/custom")
    public ResponseEntity<Tag> createCustomTag(@RequestBody CustomTagRequest request) {
        Tag tag = profileService.createCustomTag(
                request.getLabel(),
                request.getCategory(),
                request.getColor(),
                request.getSubmissionId()
        );
        return ResponseEntity.ok(tag);
    }

    @Data
    public static class ProfileRequest {
        private String name;
        private List<Long> tagIds;
    }

    @Data
    public static class CustomTagRequest {
        private String label;
        private String category;
        private String color;
        private String submissionId;
    }
}

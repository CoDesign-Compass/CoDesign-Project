package com.example.demo.service;

import com.example.demo.model.Tag;
import com.example.demo.model.UserProfile;
import com.example.demo.repository.TagRepository;
import com.example.demo.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final TagRepository tagRepository;
    private final UserProfileRepository userProfileRepository;

    public List<Tag> getAllSystemTags() {
        return tagRepository.findByIsSystemTrue();
    }

    public List<Tag> getTagsByCategory(String category) {
        return tagRepository.findByCategory(category);
    }

    public UserProfile saveProfile(String submissionId, String name, List<Long> tagIds) {
        UserProfile profile = userProfileRepository.findById(submissionId)
                .orElse(new UserProfile());
        profile.setSubmissionId(submissionId);
        profile.setName(name);

        Set<Tag> tags = tagRepository.findAllById(tagIds).stream().collect(Collectors.toSet());
        profile.setSelectedTags(tags);

        return userProfileRepository.save(profile);
    }

    public Optional<UserProfile> getProfile(String submissionId) {
        return userProfileRepository.findById(submissionId);
    }

    @Transactional
    public Tag createCustomTag(String label, String category, String color, String submissionId) {
        Tag tag = new Tag();
        tag.setLabel(label);
        tag.setCategory(category);
        tag.setColor(color);
        tag.setSystem(false);
        tag.setCreatedBy(submissionId);
        return tagRepository.save(tag);
    }
}

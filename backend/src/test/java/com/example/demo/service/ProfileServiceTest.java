package com.example.demo.service;

import com.example.demo.model.Tag;
import com.example.demo.model.UserProfile;
import com.example.demo.repository.TagRepository;
import com.example.demo.repository.UserProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private TagRepository tagRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private ProfileService profileService;

    @Test
    void getAllSystemTagsReturnsRepositoryResult() {
        Tag tag = new Tag(1L, "Accessibility", "theme", "#111111", true, "system");
        when(tagRepository.findByIsSystemTrue()).thenReturn(List.of(tag));

        List<Tag> result = profileService.getAllSystemTags();

        assertThat(result).containsExactly(tag);
    }

    @Test
    void saveProfileCreatesNewProfileWithSelectedTags() {
        Tag tag1 = new Tag(1L, "Accessibility", "theme", "#111111", true, "system");
        Tag tag2 = new Tag(2L, "Transit", "theme", "#222222", true, "system");
        when(userProfileRepository.findBySubmissionId("sub-1")).thenReturn(Optional.empty());
        when(tagRepository.findAllById(anyList())).thenReturn(List.of(tag1, tag2));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfile result = profileService.saveProfile("sub-1", "Alice", List.of(1L, 2L));

        assertThat(result.getSubmissionId()).isEqualTo("sub-1");
        assertThat(result.getName()).isEqualTo("Alice");
        assertThat(result.getSelectedTags()).containsExactlyInAnyOrder(tag1, tag2);
    }

    @Test
    void saveProfileUsesEmptyTagSetWhenTagIdsAreNull() {
        when(userProfileRepository.findBySubmissionId("sub-2")).thenReturn(Optional.of(new UserProfile("sub-2", "Old Name", Set.of())));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfile result = profileService.saveProfile("sub-2", "New Name", null);

        ArgumentCaptor<UserProfile> captor = ArgumentCaptor.forClass(UserProfile.class);
        verify(userProfileRepository).save(captor.capture());

        assertThat(result.getName()).isEqualTo("New Name");
        assertThat(captor.getValue().getSelectedTags()).isEmpty();
    }

    @Test
    void createCustomTagMarksTagAsUserCreated() {
        when(tagRepository.save(any(Tag.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Tag result = profileService.createCustomTag("Green", "theme", "#00FF00", "sub-3");

        assertThat(result.getLabel()).isEqualTo("Green");
        assertThat(result.getCategory()).isEqualTo("theme");
        assertThat(result.getColor()).isEqualTo("#00FF00");
        assertThat(result.isSystem()).isFalse();
        assertThat(result.getCreatedBy()).isEqualTo("sub-3");
    }
}
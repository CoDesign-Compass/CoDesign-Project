package com.example.demo.config;

import com.example.demo.model.Tag;
import com.example.demo.repository.TagRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DataInitializerTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private DataInitializer initializer;

    @Test
    void runSeedsSystemTagsWhenRepositoryIsEmpty() throws Exception {
        when(tagRepository.count()).thenReturn(0L);

        initializer.run();

        ArgumentCaptor<List<Tag>> captor = ArgumentCaptor.forClass(List.class);
        verify(tagRepository).saveAll(captor.capture());
        List<Tag> seeded = captor.getValue();
        assertThat(seeded).hasSize(92);
        assertThat(seeded).allMatch(Tag::isSystem);
    }

    @Test
    void runSkipsSeedingWhenTagsAlreadyExist() throws Exception {
        when(tagRepository.count()).thenReturn(1L);

        initializer.run();

        verify(tagRepository, never()).saveAll(org.mockito.ArgumentMatchers.anyList());
    }
}

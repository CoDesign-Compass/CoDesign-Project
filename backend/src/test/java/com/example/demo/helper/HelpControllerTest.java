package com.example.demo.helper;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HelpControllerTest {

    @Mock
    private HelpRequestRepository repo;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private HelpController controller;

    @Test
    void createRejectsMissingEmail() {
        var dto = new HelpRequestDto(" ", "valid message", null, null, null, null);

        var response = controller.create(dto, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo(Map.of("error", "email required"));
    }

    @Test
    void createRejectsInvalidEmailFormat() {
        var dto = new HelpRequestDto("abc", "valid message", null, null, null, null);

        var response = controller.create(dto, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo(Map.of("error", "invalid email"));
    }

    @Test
    void createRejectsShortMessage() {
        var dto = new HelpRequestDto("a@b.com", "hey", null, null, null, null);

        var response = controller.create(dto, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo(Map.of("error", "message too short"));
    }

    @Test
    void createPersistsValidRequestAndReturnsId() {
        var dto = new HelpRequestDto("a@b.com", "  Need some help now ", "share-1", 1L, 2L, "/help");
        when(request.getHeader("User-Agent")).thenReturn("JUnit");
        when(repo.save(any(HelpRequest.class))).thenAnswer(invocation -> {
            HelpRequest entity = invocation.getArgument(0);
            org.springframework.test.util.ReflectionTestUtils.setField(entity, "id", 10L);
            return entity;
        });

        var response = controller.create(dto, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(Map.of("id", 10L));

        ArgumentCaptor<HelpRequest> captor = ArgumentCaptor.forClass(HelpRequest.class);
        verify(repo).save(captor.capture());
        HelpRequest saved = captor.getValue();
        assertThat(saved.getEmail()).isEqualTo("a@b.com");
        assertThat(saved.getMessage()).isEqualTo("Need some help now");
        assertThat(saved.getUserAgent()).isEqualTo("JUnit");
    }
}

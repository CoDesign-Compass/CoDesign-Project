package com.example.demo.controller;

import com.example.demo.dto.AIProcessedDataDto;
import com.example.demo.service.AIDataProcessingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AIDataProcessingControllerTest {

    @Mock
    private AIDataProcessingService aiDataProcessingService;

    @InjectMocks
    private AIDataProcessingController controller;

    @Test
    void getProcessedDataReturnsOkWhenServiceSucceeds() {
        AIProcessedDataDto dto = new AIProcessedDataDto(
                "share-1",
                "Issue content",
                "support",
                List.of(),
                List.of(),
                "why merged",
                "how merged"
        );
        when(aiDataProcessingService.prepareSubmissionForAI("share-1")).thenReturn(dto);

        ResponseEntity<?> result = controller.getProcessedData("share-1");

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isEqualTo(dto);
        verify(aiDataProcessingService).prepareSubmissionForAI("share-1");
    }

    @Test
    void getProcessedDataReturnsNotFoundWhenInputIsInvalid() {
        when(aiDataProcessingService.prepareSubmissionForAI("missing"))
                .thenThrow(new IllegalArgumentException("Issue not found"));

        ResponseEntity<?> result = controller.getProcessedData("missing");

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(result.getBody()).isEqualTo("Issue not found");
    }

    @Test
    void getProcessedDataReturnsInternalServerErrorForUnexpectedException() {
        when(aiDataProcessingService.prepareSubmissionForAI("share-2"))
                .thenThrow(new RuntimeException("DB timeout"));

        ResponseEntity<?> result = controller.getProcessedData("share-2");

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(result.getBody()).isEqualTo("Failed to process AI data: DB timeout");
    }
}
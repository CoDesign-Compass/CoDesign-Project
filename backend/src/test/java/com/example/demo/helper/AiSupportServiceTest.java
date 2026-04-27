package com.example.demo.helper;

import com.example.demo.ai.ClaudeClient;
import com.example.demo.ai.claude.ClaudeMessageResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiSupportServiceTest {

    @Mock
    private ClaudeClient claudeClient;

    @Mock
    private AiSupportLogRepository aiSupportLogRepository;

    @InjectMocks
    private AiSupportService service;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(service, "anthropicModel", "claude-test");
        ReflectionTestUtils.setField(service, "maxTokens", 128);
    }

    @Test
    void chatRejectsBlankMessage() {
        assertThatThrownBy(() -> service.chat(new AiSupportChatRequest("   ", null, null, null, null)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400 BAD_REQUEST");
    }

    @Test
    void chatReturnsTrimmedReplyAndMarksLogSuccessful() {
        when(aiSupportLogRepository.save(any(AiSupportLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ClaudeMessageResponse.Content c1 = new ClaudeMessageResponse.Content();
        c1.setText("   ");
        ClaudeMessageResponse.Content c2 = new ClaudeMessageResponse.Content();
        c2.setText("  Use the submit button.  ");
        ClaudeMessageResponse response = new ClaudeMessageResponse();
        response.setContent(List.of(c1, c2));
        when(claudeClient.chat(any())).thenReturn(response);

        String reply = service.chat(new AiSupportChatRequest("How to submit?", "s1", 1L, 2L, "/page"));

        assertThat(reply).isEqualTo("Use the submit button.");
        ArgumentCaptor<AiSupportLog> captor = ArgumentCaptor.forClass(AiSupportLog.class);
        verify(aiSupportLogRepository, org.mockito.Mockito.atLeast(2)).save(captor.capture());
        List<AiSupportLog> allSaves = captor.getAllValues();
        assertThat(allSaves.get(allSaves.size() - 1).getSuccess()).isTrue();
    }

    @Test
    void chatThrowsBadGatewayWhenClaudeReturnsNoText() {
        when(aiSupportLogRepository.save(any(AiSupportLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ClaudeMessageResponse response = new ClaudeMessageResponse();
        response.setContent(List.of());
        when(claudeClient.chat(any())).thenReturn(response);

        assertThatThrownBy(() -> service.chat(new AiSupportChatRequest("help", null, null, null, null)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("502 BAD_GATEWAY");
    }

    @Test
    void chatThrowsBadGatewayWhenClaudeTextIsBlank() {
        when(aiSupportLogRepository.save(any(AiSupportLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ClaudeMessageResponse.Content content = new ClaudeMessageResponse.Content();
        content.setText("   ");
        ClaudeMessageResponse response = new ClaudeMessageResponse();
        response.setContent(List.of(content));
        when(claudeClient.chat(any())).thenReturn(response);

        assertThatThrownBy(() -> service.chat(new AiSupportChatRequest("help", null, null, null, null)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("502 BAD_GATEWAY")
                .hasMessageContaining("no text reply");
    }

    @Test
    void chatPersistsErrorLogWhenClaudeThrows() {
        when(aiSupportLogRepository.save(any(AiSupportLog.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(claudeClient.chat(any())).thenThrow(new RuntimeException("upstream failed"));

        assertThatThrownBy(() -> service.chat(new AiSupportChatRequest("help", "s", 1L, 2L, "/p")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("upstream failed");

        ArgumentCaptor<AiSupportLog> captor = ArgumentCaptor.forClass(AiSupportLog.class);
        verify(aiSupportLogRepository, atLeast(2)).save(captor.capture());
        AiSupportLog last = captor.getAllValues().get(captor.getAllValues().size() - 1);
        assertThat(last.getSuccess()).isFalse();
        assertThat(last.getErrorMessage()).contains("upstream failed");
    }

    @Test
    void exportLogsAsCsvFormatsAndEscapesFields() {
        AiSupportLog log = new AiSupportLog();
        log.setMessage("He said \"hello\"");
        log.setResponse("ok");
        log.setShareId("share-1");
        log.setIssueId(1L);
        log.setSubmissionId(2L);
        log.setPagePath("/x");
        log.setSuccess(true);
        log.setErrorMessage(null);
        ReflectionTestUtils.setField(log, "createdAt", LocalDateTime.parse("2026-04-27T10:15:30"));
        ReflectionTestUtils.setField(log, "updatedAt", LocalDateTime.parse("2026-04-27T10:15:30"));

        when(aiSupportLogRepository.findAll(any(Sort.class))).thenReturn(List.of(log));

        String csv = service.exportLogsAsCsv();

        assertThat(csv).contains("id,message,response");
        assertThat(csv).contains("\"He said \"\"hello\"\"\"");
        assertThat(csv).contains("\"2026-04-27 10:15:30\"");
    }
}

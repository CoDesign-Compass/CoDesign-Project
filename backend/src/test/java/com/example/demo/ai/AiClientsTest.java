package com.example.demo.ai;

import com.example.demo.ai.claude.ClaudeMessageRequest;
import com.example.demo.ai.gemini.GeminiRequest;
import com.example.demo.ai.ollama.OllamaChatRequest;
import com.example.demo.ai.openai.OpenAiChatRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class AiClientsTest {

    @Test
    void openAiClientHandlesSuccessAndEmptyBody() {
        OpenAiClient client = new OpenAiClient();
        ReflectionTestUtils.setField(client, "apiKey", "k");
        ReflectionTestUtils.setField(client, "baseUrl", "https://openai.test/v1/chat/completions");

        RestTemplate restTemplate = (RestTemplate) ReflectionTestUtils.getField(client, "restTemplate");
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

        OpenAiChatRequest req = new OpenAiChatRequest();
        req.setModel("gpt");
        req.setMessages(List.of(Map.of("role", "user", "content", "hi")));

        server.expect(once(), requestTo("https://openai.test/v1/chat/completions"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        assertThat(client.chat(req)).isNotNull();
        server.verify();

        MockRestServiceServer server2 = MockRestServiceServer.bindTo(restTemplate).build();
        server2.expect(once(), requestTo("https://openai.test/v1/chat/completions"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("", MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> client.chat(req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Failed to get response from OpenAI");
    }

    @Test
    void claudeClientHandlesSuccessAndEmptyBody() {
        ClaudeClient client = new ClaudeClient();
        ReflectionTestUtils.setField(client, "apiKey", "k");
        ReflectionTestUtils.setField(client, "baseUrl", "https://claude.test/v1/messages");

        RestTemplate restTemplate = (RestTemplate) ReflectionTestUtils.getField(client, "restTemplate");
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

        ClaudeMessageRequest req = new ClaudeMessageRequest();
        req.setModel("claude");
        req.setMessages(List.of(Map.of("role", "user", "content", "hi")));

        server.expect(once(), requestTo("https://claude.test/v1/messages"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        assertThat(client.chat(req)).isNotNull();
        server.verify();

        MockRestServiceServer server2 = MockRestServiceServer.bindTo(restTemplate).build();
        server2.expect(once(), requestTo("https://claude.test/v1/messages"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("", MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> client.chat(req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Failed to get response from Claude");
    }

    @Test
    void geminiClientHandlesSuccessAndEmptyBody() {
        GeminiClient client = new GeminiClient();
        ReflectionTestUtils.setField(client, "apiKey", "k");
        ReflectionTestUtils.setField(client, "baseUrl", "https://gemini.test/v1beta/models/");
        ReflectionTestUtils.setField(client, "model", "gemini-1.5-flash");

        RestTemplate restTemplate = (RestTemplate) ReflectionTestUtils.getField(client, "restTemplate");
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

        GeminiRequest req = new GeminiRequest();
        req.setModel("models/gemini-1.5-flash");

        String url = "https://gemini.test/v1beta/models/gemini-1.5-flash:generateContent?key=k";
        server.expect(once(), requestTo(url))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        assertThat(client.generate(req)).isNotNull();
        server.verify();

        MockRestServiceServer server2 = MockRestServiceServer.bindTo(restTemplate).build();
        server2.expect(once(), requestTo(url))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("", MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> client.generate(req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Failed to get response from Gemini");
    }

    @Test
    void ollamaClientHandlesSuccessAndEmptyBody() {
        OllamaClient client = new OllamaClient();
        ReflectionTestUtils.setField(client, "ollamaBaseUrl", "http://ollama.local");

        RestTemplate restTemplate = (RestTemplate) ReflectionTestUtils.getField(client, "restTemplate");
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

        OllamaChatRequest req = new OllamaChatRequest();
        req.setModel("llama3");
        req.setMessages(List.of(Map.of("role", "user", "content", "hi")));

        server.expect(once(), requestTo("http://ollama.local/api/chat"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        assertThat(client.chat(req)).isNotNull();
        server.verify();

        MockRestServiceServer server2 = MockRestServiceServer.bindTo(restTemplate).build();
        server2.expect(once(), requestTo("http://ollama.local/api/chat"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("", MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> client.chat(req))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Failed to get response from Ollama");
    }

        @Test
        void openAiClientThrowsWhenStatusIsNon2xx() {
                OpenAiClient client = new OpenAiClient();
                ReflectionTestUtils.setField(client, "apiKey", "k");
                ReflectionTestUtils.setField(client, "baseUrl", "https://openai.test/v1/chat/completions");

                RestTemplate restTemplate = (RestTemplate) ReflectionTestUtils.getField(client, "restTemplate");
                restTemplate.setErrorHandler(new DefaultResponseErrorHandler() {
                        @Override
                        public boolean hasError(ClientHttpResponse response) {
                                return false;
                        }
                });

                MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

                OpenAiChatRequest req = new OpenAiChatRequest();
                req.setModel("gpt");
                req.setMessages(List.of(Map.of("role", "user", "content", "hi")));

                server.expect(once(), requestTo("https://openai.test/v1/chat/completions"))
                                .andExpect(method(HttpMethod.POST))
                                .andRespond(withStatus(HttpStatus.BAD_GATEWAY).contentType(MediaType.APPLICATION_JSON).body("{}"));

                assertThatThrownBy(() -> client.chat(req))
                                .isInstanceOf(ResponseStatusException.class)
                                .hasMessageContaining("Failed to get response from OpenAI");
        }
}

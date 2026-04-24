package com.example.demo.ai;

import com.example.demo.ai.openai.OpenAiChatRequest;
import com.example.demo.ai.openai.OpenAiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Component
public class OpenAiClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openai.api-key:}")
    private String apiKey;

    @Value("${openai.base-url:https://api.openai.com/v1/chat/completions}")
    private String baseUrl;

    public OpenAiChatResponse chat(OpenAiChatRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<OpenAiChatRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<OpenAiChatResponse> response =
                restTemplate.exchange(baseUrl, HttpMethod.POST, entity, OpenAiChatResponse.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to get response from OpenAI"
            );
        }

        return response.getBody();
    }
}

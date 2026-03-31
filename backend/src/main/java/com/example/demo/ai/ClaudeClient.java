package com.example.demo.ai;

import com.example.demo.ai.claude.ClaudeMessageRequest;
import com.example.demo.ai.claude.ClaudeMessageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ClaudeClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${anthropic.api-key}")
    private String apiKey;

    @Value("${anthropic.base-url:https://api.anthropic.com/v1/messages}")
    private String baseUrl;

    public ClaudeMessageResponse chat(ClaudeMessageRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");

        HttpEntity<ClaudeMessageRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ClaudeMessageResponse> response =
                restTemplate.exchange(baseUrl, HttpMethod.POST, entity, ClaudeMessageResponse.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to get response from Claude"
            );
        }

        return response.getBody();
    }
}

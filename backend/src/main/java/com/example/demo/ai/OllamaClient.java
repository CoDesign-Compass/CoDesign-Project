package com.example.demo.ai;

import com.example.demo.ai.ollama.OllamaChatRequest;
import com.example.demo.ai.ollama.OllamaChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Component
public class OllamaClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ollama.base-url}")
    private String ollamaBaseUrl;

    public OllamaChatResponse chat(OllamaChatRequest request) {
        String url = ollamaBaseUrl + "/api/chat";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<OllamaChatRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<OllamaChatResponse> response =
                restTemplate.exchange(url, HttpMethod.POST, entity, OllamaChatResponse.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to get response from Ollama"
            );
        }

        return response.getBody();
    }
}

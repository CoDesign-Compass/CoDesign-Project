package com.example.demo.ai;

import com.example.demo.ai.gemini.GeminiRequest;
import com.example.demo.ai.gemini.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Component
public class GeminiClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${google.api-key:}")
    private String apiKey;

    @Value("${google.base-url:https://generativelanguage.googleapis.com/v1beta/models/}")
    private String baseUrl;

    @Value("${google.model:gemini-1.5-flash}")
    private String model;

    public GeminiResponse generate(GeminiRequest request) {
        String url = baseUrl + model + ":generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<GeminiResponse> response =
                restTemplate.exchange(url, HttpMethod.POST, entity, GeminiResponse.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to get response from Gemini"
            );
        }

        return response.getBody();
    }
}

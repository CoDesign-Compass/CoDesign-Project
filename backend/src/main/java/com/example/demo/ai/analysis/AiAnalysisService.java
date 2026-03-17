package com.example.demo.ai.analysis;

import com.example.demo.ai.OllamaClient;
import com.example.demo.ai.analysis.dto.AnalysisResult;
import com.example.demo.ai.analysis.prompt.PromptBuilder;
import com.example.demo.ai.ollama.OllamaChatRequest;
import com.example.demo.ai.ollama.OllamaChatResponse;
import com.example.demo.entity.HowResponse;
import com.example.demo.entity.WhyResponse;
import com.example.demo.repository.HowResponseRepository;
import com.example.demo.repository.WhyResponseRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AiAnalysisService {

    private final OllamaClient ollamaClient;
    private final ObjectMapper objectMapper;
    private final WhyResponseRepository whyResponseRepository;
    private final HowResponseRepository howResponseRepository;

    @Value("${ollama.model}")
    private String ollamaModel;

    public AiAnalysisService(
            OllamaClient ollamaClient,
            ObjectMapper objectMapper,
            WhyResponseRepository whyResponseRepository,
            HowResponseRepository howResponseRepository
    ) {
        this.ollamaClient = ollamaClient;
        this.objectMapper = objectMapper;
        this.whyResponseRepository = whyResponseRepository;
        this.howResponseRepository = howResponseRepository;
    }

    public AnalysisResult analyzeResponses(List<String> responses) {
        if (responses == null || responses.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "responses is required");
        }

        String prompt = PromptBuilder.buildPrompt(responses);
        String raw = callOllama(prompt);

        try {
            return objectMapper.readValue(extractJsonObject(raw), AnalysisResult.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI response parse failed: " + e.getMessage());
        }
    }

    public AnalysisResult analyzeByShareId(String shareId) {
        if (shareId == null || shareId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "shareId is required");
        }

        List<WhyResponse> whyResponses = whyResponseRepository.findByShareId(shareId);
        List<HowResponse> howResponses = howResponseRepository.findByShareId(shareId);

        List<String> normalizedResponses = new ArrayList<>();
        for (WhyResponse why : whyResponses) {
            normalizedResponses.add("WHY stance: " + safe(why.getStance()));
            normalizedResponses.add("WHY answer1: " + safe(why.getAnswer1()));
            normalizedResponses.add("WHY answer2: " + safe(why.getAnswer2()));
            normalizedResponses.add("WHY answer3: " + safe(why.getAnswer3()));
            normalizedResponses.add("WHY answer4: " + safe(why.getAnswer4()));
            normalizedResponses.add("WHY answer5: " + safe(why.getAnswer5()));
        }

        for (HowResponse how : howResponses) {
            normalizedResponses.add("HOW answer1: " + safe(how.getAnswer1()));
            normalizedResponses.add("HOW answer2: " + safe(how.getAnswer2()));
            normalizedResponses.add("HOW answer3: " + safe(how.getAnswer3()));
            normalizedResponses.add("HOW answer4: " + safe(how.getAnswer4()));
            normalizedResponses.add("HOW answer5: " + safe(how.getAnswer5()));
        }

        if (normalizedResponses.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No why/how responses found for shareId: " + shareId);
        }

        return analyzeResponses(normalizedResponses);
    }

    private String callOllama(String prompt) {
        OllamaChatRequest request = new OllamaChatRequest();
        request.setModel(ollamaModel);
        request.setStream(false);
        request.setFormat("json");
        request.setMessages(List.of(
                Map.of("role", "system", "content", "Return only valid JSON."),
                Map.of("role", "user", "content", prompt)
        ));

        OllamaChatResponse response = ollamaClient.chat(request);
        String content = response.getMessage() == null ? null : response.getMessage().getContent();

        if (content == null || content.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Ollama returned empty content");
        }

        return content;
    }

    private String extractJsonObject(String raw) {
        int start = raw.indexOf('{');
        int end = raw.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return raw.substring(start, end + 1);
        }
        return raw;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}

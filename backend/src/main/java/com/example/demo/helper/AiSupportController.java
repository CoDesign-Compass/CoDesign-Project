package com.example.demo.helper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-support")
public class AiSupportController {

    private final AiSupportService aiSupportService;

    public AiSupportController(AiSupportService aiSupportService) {
        this.aiSupportService = aiSupportService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiSupportChatResponse> chat(@RequestBody AiSupportChatRequest dto) {
        String reply = aiSupportService.chat(dto);
        return ResponseEntity.ok(new AiSupportChatResponse(reply));
    }
}
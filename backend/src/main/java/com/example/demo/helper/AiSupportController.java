package com.example.demo.helper;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/ai-support")
@CrossOrigin
public class AiSupportController {

    private final AiSupportService aiSupportService;

    public AiSupportController(AiSupportService aiSupportService) {
        this.aiSupportService = aiSupportService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiSupportChatResponse> chat(@RequestBody AiSupportChatRequest request) {
        String reply = aiSupportService.chat(request);
        return ResponseEntity.ok(new AiSupportChatResponse(reply));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportLogs() {
        String csv = aiSupportService.exportLogsAsCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ai_support_logs.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv.getBytes());
    }
}
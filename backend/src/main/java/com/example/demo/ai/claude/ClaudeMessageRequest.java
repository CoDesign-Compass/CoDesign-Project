package com.example.demo.ai.claude;

import java.util.List;
import java.util.Map;

public class ClaudeMessageRequest {
    private String model;
    private int max_tokens = 4096;
    private String system;
    private List<Map<String, String>> messages;

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public int getMax_tokens() { return max_tokens; }
    public void setMax_tokens(int max_tokens) { this.max_tokens = max_tokens; }

    public String getSystem() { return system; }
    public void setSystem(String system) { this.system = system; }

    public List<Map<String, String>> getMessages() { return messages; }
    public void setMessages(List<Map<String, String>> messages) { this.messages = messages; }
}

package com.example.demo.ai.ollama;

import java.util.List;
import java.util.Map;

public class OllamaChatRequest {
    private String model;
    private List<Map<String, String>> messages;
    private boolean stream;
    private Object format;

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public List<Map<String, String>> getMessages() { return messages; }
    public void setMessages(List<Map<String, String>> messages) { this.messages = messages; }

    public boolean isStream() { return stream; }
    public void setStream(boolean stream) { this.stream = stream; }

    public Object getFormat() { return format; }
    public void setFormat(Object format) { this.format = format; }
}

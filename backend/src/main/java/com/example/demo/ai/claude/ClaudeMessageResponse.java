package com.example.demo.ai.claude;

import java.util.List;

public class ClaudeMessageResponse {
    private String id;
    private String type;
    private String role;
    private List<Content> content;
    private String model;
    private String stop_reason;
    private String stop_sequence;
    private Usage usage;

    public static class Content {
        private String type;
        private String text;

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    public static class Usage {
        private int input_tokens;
        private int output_tokens;

        public int getInput_tokens() { return input_tokens; }
        public void setInput_tokens(int input_tokens) { this.input_tokens = input_tokens; }

        public int getOutput_tokens() { return output_tokens; }
        public void setOutput_tokens(int output_tokens) { this.output_tokens = output_tokens; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Content> getContent() { return content; }
    public void setContent(List<Content> content) { this.content = content; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getStop_reason() { return stop_reason; }
    public void setStop_reason(String stop_reason) { this.stop_reason = stop_reason; }

    public String getStop_sequence() { return stop_sequence; }
    public void setStop_sequence(String stop_sequence) { this.stop_sequence = stop_sequence; }

    public Usage getUsage() { return usage; }
    public void setUsage(Usage usage) { this.usage = usage; }
}

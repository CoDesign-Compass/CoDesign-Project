package com.example.demo.ai.ollama;

public class OllamaChatResponse {
    private String model;
    private String created_at;
    private Message message;
    private boolean done;

    public static class Message {
        private String role;
        private String content;

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getCreated_at() { return created_at; }
    public void setCreated_at(String created_at) { this.created_at = created_at; }

    public Message getMessage() { return message; }
    public void setMessage(Message message) { this.message = message; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
}

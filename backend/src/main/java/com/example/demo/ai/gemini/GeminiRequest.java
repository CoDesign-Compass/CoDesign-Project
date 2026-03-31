package com.example.demo.ai.gemini;

import java.util.List;

public class GeminiRequest {
    private String model;
    private List<Content> contents;
    private SystemInstruction system_instruction;
    private GenerationConfig generationConfig;

    public static class Content {
        private List<Part> parts;
        public List<Part> getParts() { return parts; }
        public void setParts(List<Part> parts) { this.parts = parts; }
    }

    public static class SystemInstruction {
        private List<Part> parts;
        public List<Part> getParts() { return parts; }
        public void setParts(List<Part> parts) { this.parts = parts; }
    }

    public static class Part {
        private String text;
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    public static class GenerationConfig {
        private String response_mime_type = "application/json";
        public String getResponse_mime_type() { return response_mime_type; }
        public void setResponse_mime_type(String response_mime_type) { this.response_mime_type = response_mime_type; }
    }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public List<Content> getContents() { return contents; }
    public void setContents(List<Content> contents) { this.contents = contents; }
    public SystemInstruction getSystem_instruction() { return system_instruction; }
    public void setSystem_instruction(SystemInstruction system_instruction) { this.system_instruction = system_instruction; }
    public GenerationConfig getGenerationConfig() { return generationConfig; }
    public void setGenerationConfig(GenerationConfig generationConfig) { this.generationConfig = generationConfig; }
}

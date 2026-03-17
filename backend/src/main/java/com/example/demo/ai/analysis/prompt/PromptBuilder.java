package com.example.demo.ai.analysis.prompt;

import java.util.List;

public class PromptBuilder {

    private PromptBuilder() {
    }

    public static String buildPrompt(List<String> responses) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are analysing survey responses from users.

Your task is to identify themes, sentiment and insights.

User responses:
""");

        for (String response : responses) {
            prompt.append("- ").append(response == null ? "" : response).append("\\n");
        }

        prompt.append("""

Return the result in JSON format:

{
  "themes": [],
  "sentiment": "",
  "insights": [],
  "recommendations": []
}

Return ONLY JSON.
Do not use markdown.
Do not wrap JSON in code fences.
If information is missing, keep fields empty instead of guessing.
""");

        return prompt.toString();
    }
}

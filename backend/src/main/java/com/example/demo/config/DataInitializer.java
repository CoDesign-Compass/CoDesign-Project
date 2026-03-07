package com.example.demo.config;

import com.example.demo.model.Tag;
import com.example.demo.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TagRepository tagRepository;

    @Override
    public void run(String... args) {
        if (tagRepository.count() == 0) {
            List<Tag> initialTags = new ArrayList<>();
            String[] colors = {"yellow", "blue", "red", "purple", "green", "orange", "pink"};
            int colorIdx = 0;

            // Interests
            String[] interests = {
                "mental health", "wellbeing", "chronic illness", "disability rights", "aged care",
                "elder support", "neurodiversity", "parenting", "family support", "youth empowerment",
                "addiction", "recovery", "housing", "homelessness", "gender equity", "cultural safety",
                "LGBTIQA+ inclusion", "domestic violence prevention", "carer support", "community volunteering",
                "First Nations advocacy", "environmental sustainability", "social justice", "accessible technology",
                "local services", "community events"
            };
            for (String label : interests) {
                initialTags.add(new Tag(null, label, "Interests", colors[colorIdx++ % colors.length], true, null));
            }

            // Behaviours
            String[] behaviours = {
                "seeks routine", "avoids conflict", "engages in peer groups", "reads news daily",
                "values storytelling", "attends workshops", "seeks alternative therapies", "uses NDIS supports",
                "shares in safe spaces", "advocates for others", "hesitant to ask for help", "prefers face-to-face services",
                "seeks clear information", "uses humour to cope", "relies on trusted networks", "uses crisis supports",
                "distrusts systems", "prefers simple info", "interested in co-design", "follows advocacy accounts"
            };
            for (String label : behaviours) {
                initialTags.add(new Tag(null, label, "Behaviours", colors[colorIdx++ % colors.length], true, null));
            }

            // Demographic / Lived Experience Descriptors (Category: Demographics)
            String[] demographics = {
                "carer", "consumer", "First Nations person", "LGBTQIA+", "neurodivergent",
                "person with disability", "CALD", "regional resident", "rural resident", "remote resident",
                "young person", "older person", "veteran", "military family", "financially disadvantaged",
                "single parent", "chronic pain", "chronic illness", "DV survivor", "SA survivor",
                "unhoused", "transitional housing", "mental health service user", "bereaved", "peer worker", "lived experience rep"
            };
            for (String label : demographics) {
                initialTags.add(new Tag(null, label, "Demographics", colors[colorIdx++ % colors.length], true, null));
            }

            // Passions & Personality Traits
            String[] passions = {
                "music lover", "bookworm", "swimmer", "runner", "dog person", "cat person",
                "foodie", "coffee enthusiast", "tea drinker", "traveller", "creative", "gamer",
                "artist", "deep thinker", "funny", "curious", "introvert", "extrovert", "empathetic", "optimistic"
            };
            for (String label : passions) {
                initialTags.add(new Tag(null, label, "Passions & Personality", colors[colorIdx++ % colors.length], true, null));
            }

            tagRepository.saveAll(initialTags);
            System.out.println("Loaded " + initialTags.size() + " initial tags into the database.");
        }
    }
}

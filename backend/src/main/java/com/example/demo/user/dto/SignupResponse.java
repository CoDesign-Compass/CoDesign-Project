package com.example.demo.user.dto;

import java.time.LocalDateTime;

public class SignupResponse {
    private Long id;
    private String username;
    private String email;
    private boolean wantsUpdates;
    private LocalDateTime createdAt;

    public SignupResponse(Long id, String username, String email, boolean wantsUpdates, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.wantsUpdates = wantsUpdates;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public boolean isWantsUpdates() { return wantsUpdates; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

package com.example.demo.user.dto;

import java.time.LocalDateTime;

public class UserListItemResponse {
    private Long id;
    private String username;
    private String email;
    private boolean wantsUpdates;
    private boolean wantsGift;
    private LocalDateTime createdAt;

    public UserListItemResponse(
            Long id,
            String username,
            String email,
            boolean wantsUpdates,
            boolean wantsGift,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.wantsUpdates = wantsUpdates;
        this.wantsGift = wantsGift;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public boolean isWantsUpdates() { return wantsUpdates; }
    public boolean isWantsGift() { return wantsGift; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

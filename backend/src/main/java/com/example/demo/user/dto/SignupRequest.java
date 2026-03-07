package com.example.demo.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {

    @NotBlank(message = "username is required")
    @Size(max = 80, message = "username too long")
    private String username;

    @NotBlank(message = "email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 4, max = 72, message = "password length must be 4-72")
    private String password;

    private boolean wantsUpdates;

    // ---- getters/setters ----
    public String getUsername() { return username; }
    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public String getEmail() { return email; }
    public void setEmail(String email) {
        if (email == null) {
            this.email = null;
        } else {
            String trimmed = email.trim();
            this.email = trimmed.isEmpty() ? null : trimmed;
        }
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isWantsUpdates() { return wantsUpdates; }
    public void setWantsUpdates(boolean wantsUpdates) { this.wantsUpdates = wantsUpdates; }
}

package com.example.demo.submission.dto;

import jakarta.validation.constraints.Email;

public class UpdateThanksRequest {
    private String email;
    private boolean wantsVoucher;
    private boolean wantsUpdates;

    @Email(message = "Invalid email format")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null) {
            this.email = null;
        } else {
            String trimmed = email.trim();
            this.email = trimmed.isEmpty() ? null : trimmed;
        }
    }

    public boolean isWantsVoucher() {
        return wantsVoucher;
    }

    public void setWantsVoucher(boolean wantsVoucher) {
        this.wantsVoucher = wantsVoucher;
    }

    public boolean isWantsUpdates() {
        return wantsUpdates;
    }

    public void setWantsUpdates(boolean wantsUpdates) {
        this.wantsUpdates = wantsUpdates;
    }
}

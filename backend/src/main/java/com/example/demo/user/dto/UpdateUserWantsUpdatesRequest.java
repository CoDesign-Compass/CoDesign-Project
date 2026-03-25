package com.example.demo.user.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateUserWantsUpdatesRequest {
    @NotNull
    private Boolean wantsUpdates;

    public Boolean getWantsUpdates() {
        return wantsUpdates;
    }

    public void setWantsUpdates(Boolean wantsUpdates) {
        this.wantsUpdates = wantsUpdates;
    }
}

package com.example.demo.user.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateUserWantsGiftRequest {
  @NotNull
  private Boolean wantsGift;

  public Boolean getWantsGift() {
    return wantsGift;
  }

  public void setWantsGift(Boolean wantsGift) {
    this.wantsGift = wantsGift;
  }
}

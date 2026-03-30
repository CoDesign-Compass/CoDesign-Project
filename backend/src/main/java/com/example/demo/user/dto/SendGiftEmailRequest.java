package com.example.demo.user.dto;

import jakarta.validation.constraints.NotBlank;

public class SendGiftEmailRequest {
  @NotBlank(message = "voucherCode is required")
  private String voucherCode;

  @NotBlank(message = "template is required")
  private String template;

  public String getVoucherCode() {
    return voucherCode;
  }

  public void setVoucherCode(String voucherCode) {
    this.voucherCode = voucherCode;
  }

  public String getTemplate() {
    return template;
  }

  public void setTemplate(String template) {
    this.template = template;
  }
}

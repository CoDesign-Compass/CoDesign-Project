package com.example.demo.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

  @NotBlank(message = "token is required")
  private String token;

  @NotBlank(message = "password is required")
  @Size(min = 6, message = "password must be at least 6 characters")
  private String password;

  public String getToken() { return token; }
  public void setToken(String token) { this.token = token; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}

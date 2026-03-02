package com.example.demo.config;

public class AdminUnauthorizedException extends RuntimeException {
    public AdminUnauthorizedException(String message) {
        super(message);
    }
}
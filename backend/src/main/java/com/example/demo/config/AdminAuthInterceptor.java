package com.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    // Read the token from environment variables/configuration (default value is set to ‘dev’)
    @Value("${admin.token:dev-admin-token}")
    private String adminToken;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("X-ADMIN-TOKEN");

        if (token == null || !token.equals(adminToken)) {
            throw new AdminUnauthorizedException("Missing or invalid X-ADMIN-TOKEN");
        }
        return true;
    }
}
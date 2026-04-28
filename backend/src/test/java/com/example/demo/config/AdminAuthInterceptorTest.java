package com.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AdminAuthInterceptorTest {

    @Test
    void preHandleRejectsMissingOrInvalidTokenAndAcceptsValidToken() throws Exception {
        AdminAuthInterceptor interceptor = new AdminAuthInterceptor();
        ReflectionTestUtils.setField(interceptor, "adminToken", "expected-token");

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);

        when(request.getHeader("X-ADMIN-TOKEN")).thenReturn(null);
        assertThatThrownBy(() -> interceptor.preHandle(request, response, new Object()))
                .isInstanceOf(AdminUnauthorizedException.class)
                .hasMessageContaining("Missing or invalid");

        when(request.getHeader("X-ADMIN-TOKEN")).thenReturn("wrong-token");
        assertThatThrownBy(() -> interceptor.preHandle(request, response, new Object()))
                .isInstanceOf(AdminUnauthorizedException.class)
                .hasMessageContaining("Missing or invalid");

        when(request.getHeader("X-ADMIN-TOKEN")).thenReturn("expected-token");
        assertThat(interceptor.preHandle(request, response, new Object())).isTrue();
    }
}

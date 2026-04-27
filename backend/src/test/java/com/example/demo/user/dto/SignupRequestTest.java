package com.example.demo.user.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SignupRequestTest {

    @Test
    void usernameAndEmailSettersNormalizeInput() {
        SignupRequest req = new SignupRequest();

        req.setUsername("  Alice  ");
        req.setEmail("   ");
        assertThat(req.getUsername()).isEqualTo("Alice");
        assertThat(req.getEmail()).isNull();

        req.setEmail("  alice@test.com  ");
        assertThat(req.getEmail()).isEqualTo("alice@test.com");

        req.setEmail(null);
        assertThat(req.getEmail()).isNull();

        req.setUsername(null);
        assertThat(req.getUsername()).isNull();
    }

    @Test
    void passwordAndWantsUpdatesRoundTrip() {
        SignupRequest req = new SignupRequest();

        req.setPassword("pass123");
        req.setWantsUpdates(true);

        assertThat(req.getPassword()).isEqualTo("pass123");
        assertThat(req.isWantsUpdates()).isTrue();
    }
}

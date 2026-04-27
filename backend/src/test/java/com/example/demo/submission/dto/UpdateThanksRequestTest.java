package com.example.demo.submission.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UpdateThanksRequestTest {

    @Test
    void emailSetterHandlesNullBlankAndTrimmedValues() {
        UpdateThanksRequest req = new UpdateThanksRequest();

        req.setEmail(null);
        assertThat(req.getEmail()).isNull();

        req.setEmail("   ");
        assertThat(req.getEmail()).isNull();

        req.setEmail("  u@test.com  ");
        assertThat(req.getEmail()).isEqualTo("u@test.com");
    }

    @Test
    void wantsFlagsRoundTrip() {
        UpdateThanksRequest req = new UpdateThanksRequest();

        req.setWantsVoucher(true);
        req.setWantsUpdates(true);

        assertThat(req.isWantsVoucher()).isTrue();
        assertThat(req.isWantsUpdates()).isTrue();
    }
}

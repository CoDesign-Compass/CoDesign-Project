package com.example.demo.submission.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SubmitSubmissionRequestTest {

    @Test
    void setEmailKeepsNullAsNull() {
        SubmitSubmissionRequest req = new SubmitSubmissionRequest();

        req.setEmail(null);

        assertThat(req.getEmail()).isNull();
    }

    @Test
    void setEmailConvertsBlankToNullAndTrimsNonBlank() {
        SubmitSubmissionRequest req = new SubmitSubmissionRequest();

        req.setEmail("   ");
        assertThat(req.getEmail()).isNull();

        req.setEmail("  user@test.com  ");
        assertThat(req.getEmail()).isEqualTo("user@test.com");
    }

    @Test
    void wantsFlagsRoundTrip() {
        SubmitSubmissionRequest req = new SubmitSubmissionRequest();

        req.setWantsVoucher(true);
        req.setWantsUpdates(true);

        assertThat(req.isWantsVoucher()).isTrue();
        assertThat(req.isWantsUpdates()).isTrue();
    }
}

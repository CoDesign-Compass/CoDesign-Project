package com.example.demo.helper;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.OffsetDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class HelpRequestTest {

    @Test
    void prePersistSetsCreatedAtOnlyWhenMissing() {
        HelpRequest request = new HelpRequest();

        request.prePersist();
        OffsetDateTime first = request.getCreatedAt();
        assertThat(first).isNotNull();

        OffsetDateTime fixed = OffsetDateTime.parse("2026-04-27T10:15:30+00:00");
        ReflectionTestUtils.setField(request, "createdAt", fixed);
        request.prePersist();

        assertThat(request.getCreatedAt()).isEqualTo(fixed);
    }
}

package com.example.demo.user;

import com.example.demo.entity.Issue;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class GiftEmailServiceTest {

    @Test
    void isConfiguredDependsOnResendApiKey() {
        GiftEmailService configured = new GiftEmailService(
                "re_test_key",
                "from@test.com",
                "gift",
                "update",
                "https://a.com/"
        );
        GiftEmailService notConfigured = new GiftEmailService(
                "",
                "from@test.com",
                "gift",
                "update",
                "https://a.com/"
        );

        assertThat(configured.isConfigured()).isTrue();
        assertThat(notConfigured.isConfigured()).isFalse();
    }

    @Test
    void sendGiftEmailThrowsWhenMailNotConfigured() {
        GiftEmailService service = new GiftEmailService(
                "",
                "from@test.com",
                "gift",
                "update",
                "https://a.com"
        );

        assertThatThrownBy(() -> service.sendGiftEmail("to@test.com", "u", "V1", "Hi"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not configured");
    }

    @Test
    void sendUpdateEmailValidatesIssueAndNotConfigured() {
        GiftEmailService configured = new GiftEmailService(
                "re_test_key",
                "from@test.com",
                "gift",
                "update",
                "https://base.url/"
        );

        assertThatThrownBy(() -> configured.sendUpdateEmail("to@test.com", "u", null, "tpl"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Issue is required");

        GiftEmailService notConfigured = new GiftEmailService(
                "",
                "from@test.com",
                "gift",
                "update",
                "https://base.url/"
        );
        Issue issue = new Issue();
        issue.setIssueId(2L);

        assertThatThrownBy(() -> notConfigured.sendUpdateEmail("to@test.com", "u", issue, "tpl"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not configured");
    }
}

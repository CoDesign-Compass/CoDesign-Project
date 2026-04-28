package com.example.demo.user;

import com.example.demo.entity.Issue;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GiftEmailServiceTest {

    @Mock
    private ObjectProvider<JavaMailSender> mailSenderProvider;

    @Mock
    private JavaMailSender mailSender;

    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
    }

    @Test
    void isConfiguredDependsOnMailSenderAndSmtpHost() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        GiftEmailService configured = new GiftEmailService(mailSenderProvider, "smtp.example", "from@test.com", "gift", "update", "https://a.com/");

        when(mailSenderProvider.getIfAvailable()).thenReturn(null);
        GiftEmailService notConfigured = new GiftEmailService(mailSenderProvider, "", "from@test.com", "gift", "update", "https://a.com/");

        assertThat(configured.isConfigured()).isTrue();
        assertThat(notConfigured.isConfigured()).isFalse();
    }

    @Test
    void sendGiftEmailThrowsWhenMailNotConfigured() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(null);
        GiftEmailService service = new GiftEmailService(mailSenderProvider, "", "from@test.com", "gift", "update", "https://a.com");

        assertThatThrownBy(() -> service.sendGiftEmail("to@test.com", "u", "V1", "Hi"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not configured");
    }

    @Test
    void sendGiftEmailRendersTemplateAndSendsMimeMessage() throws Exception {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        GiftEmailService service = new GiftEmailService(mailSenderProvider, "smtp.example", "from@test.com", "gift-subject", "update-subject", "https://a.com");

        service.sendGiftEmail("to@test.com", null, " VC-1 ", "Hello {{name}}\nCode: {{voucherCode}}");

        assertThat(mimeMessage.getSubject()).isEqualTo("gift-subject");
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendUpdateEmailValidatesIssueAndMapsSendFailures() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        GiftEmailService service = new GiftEmailService(mailSenderProvider, "smtp.example", "from@test.com", "gift", "update", "https://base.url/");

        assertThatThrownBy(() -> service.sendUpdateEmail("to@test.com", "u", null, "tpl"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Issue is required");

        Issue issue = new Issue();
        issue.setIssueId(1L);
        issue.setIssueContent("Road safety");
        issue.setShareId(" ");

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        org.mockito.Mockito.doThrow(new MailSendException("boom"))
                .when(mailSender)
                .send(org.mockito.ArgumentMatchers.any(jakarta.mail.internet.MimeMessage.class));

        assertThatThrownBy(() -> service.sendUpdateEmail("to@test.com", "u", issue, "<b>{{issueContent}}</b>"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Failed to send update email");
    }

    @Test
    void sendUpdateEmailThrowsWhenNotConfigured() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(null);
        GiftEmailService service = new GiftEmailService(mailSenderProvider, "", "from@test.com", "gift", "update", "https://base.url/");

        Issue issue = new Issue();
        issue.setIssueId(2L);

        assertThatThrownBy(() -> service.sendUpdateEmail("to@test.com", "u", issue, "tpl"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not configured");
    }

    @Test
    void sendUpdateEmailBuildsShareLinkWithShareIdAndSends() throws Exception {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        GiftEmailService service = new GiftEmailService(mailSenderProvider, "smtp.example", "from@test.com", "gift", "update-subject", "https://base.url/");

        Issue issue = new Issue();
        issue.setIssueId(3L);
        issue.setIssueContent("Road safety");
        issue.setShareId("share-3");

        service.sendUpdateEmail("to@test.com", "alice", issue, "Hi {{name}} <a href='{{shareLink}}'>link</a> {{issueContent}}");

        assertThat(mimeMessage.getSubject()).isEqualTo("update-subject");
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendGiftEmailMapsMailExceptionsToIllegalState() {
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        GiftEmailService service = new GiftEmailService(mailSenderProvider, "smtp.example", "from@test.com", "gift", "update", "https://a.com");

        org.mockito.Mockito.doThrow(new MailSendException("smtp failed"))
                .when(mailSender)
                .send(any(jakarta.mail.internet.MimeMessage.class));

        assertThatThrownBy(() -> service.sendGiftEmail("to@test.com", "u", "V1", "Hello {{name}}"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Failed to send gift email");
    }
}

package com.example.demo.user;

import com.example.demo.entity.Issue;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class GiftEmailService {
  private final JavaMailSender mailSender;
  private final boolean mailConfigured;
  private final String fromAddress;
  private final String giftSubject;
  private final String updateSubject;
  private final String publicBaseUrl;

  public GiftEmailService(
      ObjectProvider<JavaMailSender> mailSenderProvider,
      @Value("${spring.mail.host:}") String smtpHost,
      @Value("${app.mail.from:no-reply@codesign.local}") String fromAddress,
      @Value("${app.mail.subject:Thank you for your response - Your voucher code}") String giftSubject,
      @Value("${app.mail.update-subject:CoDesign Compass issue update}") String updateSubject,
      @Value("${app.public.base-url:https://co-design-project.vercel.app}") String publicBaseUrl
  ) {
    this.mailSender = mailSenderProvider.getIfAvailable();
    this.mailConfigured = this.mailSender != null && smtpHost != null && !smtpHost.isBlank();
    this.fromAddress = fromAddress;
    this.giftSubject = giftSubject;
    this.updateSubject = updateSubject;
    this.publicBaseUrl = publicBaseUrl == null ? "" : publicBaseUrl.replaceAll("/+$", "");
  }

  public boolean isConfigured() {
    return mailConfigured;
  }

  public void sendGiftEmail(String toEmail, String userName, String voucherCode, String template) {
    if (!mailConfigured) {
      throw new IllegalStateException("Gift email is not configured on the server.");
    }

    String safeName = (userName == null || userName.isBlank()) ? "there" : userName.trim();
    String safeTemplate = template == null ? "" : template;
    String emailBody = safeTemplate
        .replace("{{name}}", safeName)
        .replace("{{voucherCode}}", voucherCode);

    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(toEmail);
    message.setSubject(giftSubject);
    message.setText(emailBody);

    try {
      mailSender.send(message);
    } catch (MailException ex) {
      throw new IllegalStateException("Failed to send gift email.", ex);
    }
  }

  public void sendUpdateEmail(String toEmail, String userName, Issue issue, String template) {
    if (!mailConfigured) {
      throw new IllegalStateException("Update email is not configured on the server.");
    }
    if (issue == null || issue.getIssueId() == null) {
      throw new IllegalArgumentException("Issue is required.");
    }

    String safeName = (userName == null || userName.isBlank()) ? "there" : userName.trim();
    String safeTemplate = template == null ? "" : template;
    String safeIssueContent = issue.getIssueContent() == null ? "" : issue.getIssueContent().trim();
    String shareId = issue.getShareId() == null ? "" : issue.getShareId().trim();
    String shareLink = shareId.isBlank() ? publicBaseUrl : publicBaseUrl + "/share/" + shareId;
    String emailBody = safeTemplate
        .replace("{{name}}", safeName)
        .replace("{{shareLink}}", shareLink)
        .replace("{{issueContent}}", safeIssueContent);

    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromAddress);
    message.setTo(toEmail);
    message.setSubject(updateSubject);
    message.setText(emailBody);

    try {
      mailSender.send(message);
    } catch (MailException ex) {
      throw new IllegalStateException("Failed to send update email.", ex);
    }
  }
}

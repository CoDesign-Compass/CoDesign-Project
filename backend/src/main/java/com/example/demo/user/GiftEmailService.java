package com.example.demo.user;

import com.example.demo.entity.Issue;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
public class GiftEmailService {
  private static final Logger log = LoggerFactory.getLogger(GiftEmailService.class);
  private final JavaMailSender mailSender;
  private final boolean mailConfigured;
  private final String fromAddress;
  private final String giftSubject;
  private final String updateSubject;
  private final String publicBaseUrl;

  @Autowired
  public GiftEmailService(
      ObjectProvider<JavaMailSender> mailSenderProvider,
      @Value("${spring.mail.host:${SMTP_HOST:${SPRING_MAIL_HOST:}}}") String smtpHost,
      @Value("${app.mail.from:no-reply@codesign.local}") String fromAddress,
      @Value("${app.mail.subject:Thank you for your response - Your voucher code}") String giftSubject,
      @Value("${app.mail.update-subject:CoDesign Compass issue update}") String updateSubject,
      @Value("${app.public.base-url:https://codesigncompass.au}") String publicBaseUrl
  ) {
    this.mailSender = mailSenderProvider.getIfAvailable();
    String safeSmtpHost = smtpHost == null ? "" : smtpHost.trim();
    this.mailConfigured = this.mailSender != null && !safeSmtpHost.isBlank();
    this.fromAddress = fromAddress;
    this.giftSubject = giftSubject;
    this.updateSubject = updateSubject;
    this.publicBaseUrl = publicBaseUrl == null ? "" : publicBaseUrl.replaceAll("/+$", "");
  }

  GiftEmailService(
      JavaMailSender mailSender,
      String smtpHost,
      String fromAddress,
      String giftSubject,
      String updateSubject,
      String publicBaseUrl
  ) {
    this.mailSender = mailSender;
    String safeSmtpHost = smtpHost == null ? "" : smtpHost.trim();
    this.mailConfigured = this.mailSender != null && !safeSmtpHost.isBlank();
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

    String safeName = (userName == null || userName.isBlank()) ? "client" : userName.trim();
    String safeVoucherCode = voucherCode == null ? "" : voucherCode.trim();
    String safeTemplate = template == null ? "" : template.trim();

    try {
      sendTemplatedEmail(
          toEmail,
          giftSubject,
          safeTemplate,
          Map.of(
              "{{name}}", HtmlUtils.htmlEscape(safeName),
              "{{voucherCode}}", HtmlUtils.htmlEscape(safeVoucherCode)
          )
      );
    } catch (RuntimeException ex) {
      log.error("Gift email failed", ex);
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

    String safeName = (userName == null || userName.isBlank()) ? "client" : userName.trim();
    String safeTemplate = template == null ? "" : template.trim();
    String safeIssueContent = issue.getIssueContent() == null ? "" : issue.getIssueContent().trim();
    String shareId = issue.getShareId() == null ? "" : issue.getShareId().trim();
    String shareLink = shareId.isBlank() ? publicBaseUrl : publicBaseUrl + "/share/" + shareId;

    try {
      sendTemplatedEmail(
          toEmail,
          updateSubject,
          safeTemplate,
          Map.of(
              "{{name}}", HtmlUtils.htmlEscape(safeName),
              "{{shareLink}}", HtmlUtils.htmlEscape(shareLink),
              "{{issueContent}}", HtmlUtils.htmlEscape(safeIssueContent)
          )
      );
    } catch (RuntimeException ex) {
      throw new IllegalStateException("Failed to send update email.", ex);
    }
  }

  private void sendTemplatedEmail(
      String toEmail,
      String subject,
      String template,
      Map<String, String> placeholders
  ) {
    String rendered = applyPlaceholders(template, placeholders);
    String htmlBody = looksLikeHtml(rendered) ? rendered : wrapAsHtml(rendered);

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
      helper.setFrom(fromAddress);
      helper.setTo(toEmail);
      helper.setSubject(subject);
      helper.setText(htmlBody, true);

      log.info("About to send SMTP email. to={}, from={}", toEmail, fromAddress);
      mailSender.send(message);
    } catch (MessagingException | MailException ex) {
      throw new IllegalStateException("SMTP email request failed.", ex);
    }
  }

  private String applyPlaceholders(String template, Map<String, String> placeholders) {
    String rendered = template == null ? "" : template;
    for (Map.Entry<String, String> entry : placeholders.entrySet()) {
      rendered = rendered.replace(entry.getKey(), entry.getValue());
    }
    return rendered;
  }

  private boolean looksLikeHtml(String content) {
    return content != null && content.matches("(?s).*<[^>]+>.*");
  }

  public void sendPasswordResetEmail(String toEmail, String userName, String resetLink) {
    if (!mailConfigured) {
      throw new IllegalStateException("Email is not configured on the server.");
    }
    String safeName = (userName == null || userName.isBlank()) ? "user" : HtmlUtils.htmlEscape(userName.trim());
    String safeLink = HtmlUtils.htmlEscape(resetLink);
    String html = "<!doctype html><html><body style=\"margin:0;padding:0;background:#f4f7fb;\">"
        + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f7fb;padding:24px 12px;\">"
        + "<tr><td align=\"center\">"
        + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:640px;background:#ffffff;border:1px solid #e6ebf2;border-radius:14px;padding:32px 28px;\">"
        + "<tr><td style=\"font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#1f2937;\">"
        + "<p>Hi " + safeName + ",</p>"
        + "<p>We received a request to reset your CoDesign Compass password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>"
        + "<p style=\"text-align:center;margin:28px 0;\">"
        + "<a href=\"" + safeLink + "\" style=\"background:#f5c518;color:#1a1a1a;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;\">Reset Password</a>"
        + "</p>"
        + "<p style=\"color:#6b7280;font-size:13px;\">If you didn't request this, you can safely ignore this email. Your password won't change.</p>"
        + "</td></tr></table></td></tr></table></body></html>";
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
      helper.setFrom(fromAddress);
      helper.setTo(toEmail);
      helper.setSubject("Reset your CoDesign Compass password");
      helper.setText(html, true);
      log.info("Sending password reset email to={}", toEmail);
      mailSender.send(message);
    } catch (MessagingException | MailException ex) {
      throw new IllegalStateException("Failed to send password reset email.", ex);
    }
  }

  private String wrapAsHtml(String plainTextContent) {
    String safeText = plainTextContent == null ? "" : HtmlUtils.htmlEscape(plainTextContent);
    String body = safeText
        .replace("\r\n", "\n")
        .replace("\r", "\n")
        .replace("\n", "<br>");

    return "<!doctype html><html><body style=\"margin:0;padding:0;background:#f4f7fb;\">"
        + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f7fb;padding:24px 12px;\">"
        + "<tr><td align=\"center\">"
        + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:640px;background:#ffffff;border:1px solid #e6ebf2;border-radius:14px;padding:32px 28px;\">"
        + "<tr><td style=\"font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#1f2937;\">"
        + body
        + "</td></tr></table></td></tr></table></body></html>";
  }

}

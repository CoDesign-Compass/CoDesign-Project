package com.example.demo.user;

import com.example.demo.entity.Issue;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
public class GiftEmailService {
  private static final Logger log = LoggerFactory.getLogger(GiftEmailService.class);
  private final Resend resend;
  private final boolean mailConfigured;
  private final String fromAddress;
  private final String giftSubject;
  private final String updateSubject;
  private final String publicBaseUrl;

  public GiftEmailService(
      @Value("${resend.api-key:${RESEND_API_KEY:}}") String resendApiKey,
      @Value("${app.mail.from:no-reply@codesign.local}") String fromAddress,
      @Value("${app.mail.subject:Thank you for your response - Your voucher code}") String giftSubject,
      @Value("${app.mail.update-subject:CoDesign Compass issue update}") String updateSubject,
      @Value("${app.public.base-url:https://co-design-project.vercel.app}") String publicBaseUrl
  ) {
    String safeApiKey = resendApiKey == null ? "" : resendApiKey.trim();
    this.resend = safeApiKey.isBlank() ? null : new Resend(safeApiKey);
    this.mailConfigured = this.resend != null;
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

    CreateEmailOptions sendEmailRequest = CreateEmailOptions.builder()
        .from(fromAddress)
        .to(toEmail)
        .subject(subject)
        .html(htmlBody)
        .build();
    log.info("About to call Resend API. to={}, from={}", toEmail, fromAddress);
    try {
      CreateEmailResponse ignored = resend.emails().send(sendEmailRequest);
    } catch (ResendException ex) {
      throw new IllegalStateException("Resend API request failed.", ex);
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

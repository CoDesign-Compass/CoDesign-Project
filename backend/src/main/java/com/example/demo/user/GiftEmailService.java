package com.example.demo.user;

import com.example.demo.entity.Issue;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

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
    } catch (MessagingException | MailException ex) {
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
    } catch (MessagingException | MailException ex) {
      throw new IllegalStateException("Failed to send update email.", ex);
    }
  }

  private void sendTemplatedEmail(
      String toEmail,
      String subject,
      String template,
      Map<String, String> placeholders
  ) throws MessagingException {
    String rendered = applyPlaceholders(template, placeholders);
    String htmlBody = looksLikeHtml(rendered) ? rendered : wrapAsHtml(rendered);
    String textBody = htmlToPlainText(htmlBody);

    MimeMessage mimeMessage = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
    helper.setFrom(fromAddress);
    helper.setTo(toEmail);
    helper.setSubject(subject);
    helper.setText(textBody, htmlBody);

    mailSender.send(mimeMessage);
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

  private String htmlToPlainText(String html) {
    if (html == null || html.isBlank()) {
      return "";
    }
    return html
        .replaceAll("(?is)<style[^>]*>.*?</style>", "")
        .replaceAll("(?is)<script[^>]*>.*?</script>", "")
        .replaceAll("(?i)<br\\s*/?>", "\n")
        .replaceAll("(?i)</p>", "\n\n")
        .replaceAll("(?i)</tr>", "\n")
        .replaceAll("(?s)<[^>]+>", "")
        .replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"")
        .replace("&#39;", "'")
        .replaceAll("\\n{3,}", "\n\n")
        .trim();
  }
}

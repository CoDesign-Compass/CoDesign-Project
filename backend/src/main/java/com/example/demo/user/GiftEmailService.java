package com.example.demo.user;

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
  private final String subject;

  public GiftEmailService(
      ObjectProvider<JavaMailSender> mailSenderProvider,
      @Value("${spring.mail.host:}") String smtpHost,
      @Value("${app.mail.from:no-reply@codesign.local}") String fromAddress,
      @Value("${app.mail.subject:Thank you for your response - Your voucher code}") String subject
  ) {
    this.mailSender = mailSenderProvider.getIfAvailable();
    this.mailConfigured = this.mailSender != null && smtpHost != null && !smtpHost.isBlank();
    this.fromAddress = fromAddress;
    this.subject = subject;
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
    message.setSubject(subject);
    message.setText(emailBody);

    try {
      mailSender.send(message);
    } catch (MailException ex) {
      throw new IllegalStateException("Failed to send gift email.", ex);
    }
  }
}

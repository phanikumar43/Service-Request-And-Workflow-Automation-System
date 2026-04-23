package com.servicedesk.service;

import com.servicedesk.entity.EmailAuditLog;
import com.servicedesk.entity.EmailConfig;
import com.servicedesk.entity.ServiceRequest;
import com.servicedesk.repository.EmailAuditLogRepository;
import com.servicedesk.repository.EmailConfigRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Properties;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private EmailConfigRepository emailConfigRepository;

    @Autowired
    private EmailAuditLogRepository emailAuditLogRepository;

    private JavaMailSenderImpl javaMailSender;

    @PostConstruct
    public void init() {
        refreshMailSender();
    }

    public synchronized void refreshMailSender() {
        EmailConfig config = emailConfigRepository.findFirstByOrderByIdAsc().orElse(null);
        if (config == null) {
            logger.warn("No email configuration found in database.");
            return;
        }

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(config.getHost());
        sender.setPort(config.getPort());
        sender.setUsername(config.getUsername());
        sender.setPassword(config.getPassword());
        sender.setProtocol(config.getProtocol());

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", config.getProtocol());
        props.put("mail.smtp.auth", "true");
        // StartTLS logic
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.debug", "true");

        // Trust all certs logic might be needed for dev environments, but trying
        // standard first
        // props.put("mail.smtp.ssl.trust", "*");

        this.javaMailSender = sender;
        logger.info("JavaMailSender initialized with host: {}", config.getHost());
    }

    @Async
    public void sendEmail(String to, String subject, String content, Long requestId, String triggeredBy) {
        if (javaMailSender == null) {
            logger.error("Email sender not initialized. Cannot send email to {}", to);
            logEmail(to, subject, content, "FAILED", "Email sender not initialized", requestId, triggeredBy);
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            EmailConfig config = emailConfigRepository.findFirstByOrderByIdAsc().orElseThrow();
            helper.setFrom(config.getFromEmail());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // true = html

            javaMailSender.send(message);
            logger.info("Email sent to {} with subject: {}", to, subject);

            logEmail(to, subject, content, "SENT", null, requestId, triggeredBy);

        } catch (Exception e) {
            logger.error("Failed to send email to {}", to, e);
            logEmail(to, subject, content, "FAILED", e.getMessage(), requestId, triggeredBy);
        }
    }

    private void logEmail(String to, String subject, String body, String status, String error, Long requestId,
            String triggeredBy) {
        try {
            EmailAuditLog log = new EmailAuditLog();
            log.setRecipient(to);
            log.setSubject(subject);
            log.setBody(body); // Limit body length if needed
            log.setStatus(status);
            log.setErrorMessage(error);
            log.setRequestId(requestId);
            log.setTriggeredBy(triggeredBy);
            log.setSentAt(LocalDateTime.now());
            emailAuditLogRepository.save(log);
        } catch (Exception e) {
            logger.error("Failed to save email audit log", e);
        }
    }

    // Quick test method
    public void sendTestEmail(String to) {
        refreshMailSender(); // Ensure latest config
        sendEmail(to, "Test Email from Service Request System",
                "<h1>Test Email</h1><p>This is a test email to verify SMTP validation.</p>",
                null, "TEST_USER");
    }

    public void sendRequestCreatedEmail(ServiceRequest request) {
        String subject = "Request Created: " + request.getTicketId() + " - " + request.getTitle();
        String body = buildRequestEmailBody(request, "A new service request has been created.");
        sendEmail(request.getRequester().getEmail(), subject, body, request.getId(), "SYSTEM");

        // Notify department if assigned
        if (request.getDepartment() != null && request.getStatus() == ServiceRequest.RequestStatus.ASSIGNED) {
            // For now, we will just log that we would notify department users
            // Integration with User repository to find department users will be added
        }
    }

    public void sendRequestStatusUpdateEmail(ServiceRequest request) {
        String subject = "Status Update: " + request.getTicketId() + " - " + request.getStatus();
        String body = buildRequestEmailBody(request, "Your request status has been updated to " + request.getStatus());
        sendEmail(request.getRequester().getEmail(), subject, body, request.getId(), "SYSTEM");
    }

    public void sendRequestAssignedEmail(ServiceRequest request) {
        String subject = "Request Assigned: " + request.getTicketId();
        String body = buildRequestEmailBody(request, "Your request has been assigned to an agent.");
        sendEmail(request.getRequester().getEmail(), subject, body, request.getId(), "SYSTEM");

        if (request.getAssignedAgent() != null) {
            sendEmail(request.getAssignedAgent().getEmail(),
                    "Assigned New Request: " + request.getTicketId(),
                    buildRequestEmailBody(request, "You have been assigned this request."),
                    request.getId(), "SYSTEM");
        }
    }

    private String buildRequestEmailBody(ServiceRequest request, String message) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append("<h2>Service Request Update</h2>");
        sb.append("<p>").append(message).append("</p>");
        sb.append("<table border='1' cellpadding='5' style='border-collapse: collapse;'>");
        sb.append("<tr><td><b>Ticket ID</b></td><td>").append(request.getTicketId()).append("</td></tr>");
        sb.append("<tr><td><b>Title</b></td><td>").append(request.getTitle()).append("</td></tr>");
        sb.append("<tr><td><b>Status</b></td><td>").append(request.getStatus()).append("</td></tr>");
        sb.append("<tr><td><b>Priority</b></td><td>").append(request.getPriority()).append("</td></tr>");
        sb.append("<tr><td><b>Description</b></td><td>").append(request.getDescription()).append("</td></tr>");
        if (request.getDepartment() != null) {
            sb.append("<tr><td><b>Department</b></td><td>").append(request.getDepartment().getName())
                    .append("</td></tr>");
        }
        sb.append("</table>");
        sb.append("<p>Please login to the portal to view more details.</p>");
        sb.append("</body></html>");
        return sb.toString();
    }
}

package com.servicedesk.controller;

import com.servicedesk.dto.EmailSettingsDTO;
import com.servicedesk.dto.TestEmailRequest;
import com.servicedesk.entity.EmailConfig;
import com.servicedesk.repository.EmailConfigRepository;
import com.servicedesk.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings/email-config")
@CrossOrigin(origins = "*") // Adjust as per security requirements
public class EmailSettingsController {

    @Autowired
    private EmailConfigRepository emailConfigRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmailSettingsDTO> getEmailSettings() {
        return emailConfigRepository.findFirstByOrderByIdAsc()
                .map(config -> {
                    EmailSettingsDTO dto = new EmailSettingsDTO();
                    dto.setHost(config.getHost());
                    dto.setPort(config.getPort());
                    dto.setUsername(config.getUsername());
                    // Mask password
                    dto.setPassword("********");
                    dto.setFromEmail(config.getFromEmail());
                    dto.setProtocol(config.getProtocol());
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> saveEmailSettings(@RequestBody EmailSettingsDTO dto) {
        System.out.println("DEBUG: saveEmailSettings called with host: " + dto.getHost());
        try {
            EmailConfig config = emailConfigRepository.findFirstByOrderByIdAsc().orElse(new EmailConfig());

            config.setHost(dto.getHost() != null ? dto.getHost().trim() : null);
            config.setPort(dto.getPort());
            config.setUsername(dto.getUsername() != null ? dto.getUsername().trim() : null);

            // Only update password if it's not masked
            if (dto.getPassword() != null && !dto.getPassword().equals("********")) {
                config.setPassword(dto.getPassword().trim());
            }

            config.setFromEmail(dto.getFromEmail() != null ? dto.getFromEmail().trim() : null);
            if (dto.getProtocol() != null)
                config.setProtocol(dto.getProtocol());

            emailConfigRepository.save(config);

            emailService.refreshMailSender();

            return ResponseEntity.ok("Email settings saved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error saving settings: " + e.getMessage());
        }
    }

    @PostMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendTestEmail(@RequestBody TestEmailRequest request) {
        System.out.println("DEBUG: sendTestEmail called for: " + request.getTo());
        try {
            emailService.sendTestEmail(request.getTo());
            return ResponseEntity.ok("Test email sent. Check inbox.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }
}

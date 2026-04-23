package com.servicedesk.service;

import com.servicedesk.entity.*;
import com.servicedesk.repository.ServiceRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled Tasks Service
 * Handles automated scheduled operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksService {

    private final ServiceRequestRepository requestRepository;
    private final NotificationService notificationService;

    /**
     * Auto-close resolved requests after 7 days
     * Runs daily at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void autoCloseResolvedRequests() {
        try {
            LocalDateTime cutoff = LocalDateTime.now().minusDays(7);

            List<ServiceRequest> requests = requestRepository
                    .findByStatusAndResolvedAtBefore(ServiceRequest.RequestStatus.RESOLVED, cutoff);

            for (ServiceRequest request : requests) {
                request.setStatus(ServiceRequest.RequestStatus.CLOSED);
                request.setClosedAt(LocalDateTime.now());
                requestRepository.save(request);

                log.info("Auto-closed request #{}", request.getId());
            }

            if (!requests.isEmpty()) {
                log.info("Auto-closed {} resolved requests", requests.size());
            }

        } catch (Exception e) {
            log.error("Error auto-closing resolved requests", e);
        }
    }

    /**
     * Send daily digest to departments
     * Runs weekdays at 9 AM
     */
    @Scheduled(cron = "0 0 9 * * MON-FRI")
    public void sendDailyDigest() {
        try {
            log.info("Sending daily digest to departments");
            // Implementation for daily digest
            // This would send summary emails to each department
        } catch (Exception e) {
            log.error("Error sending daily digest", e);
        }
    }

    /**
     * Clean up old notifications
     * Runs weekly on Sunday at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * SUN")
    @Transactional
    public void cleanupOldNotifications() {
        try {
            log.info("Cleaning up old notifications");
            // Implementation for cleanup
            // Delete read notifications older than 30 days
        } catch (Exception e) {
            log.error("Error cleaning up notifications", e);
        }
    }
}

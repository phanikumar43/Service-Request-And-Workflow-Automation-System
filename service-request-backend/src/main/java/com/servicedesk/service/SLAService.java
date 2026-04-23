package com.servicedesk.service;

import com.servicedesk.entity.*;
import com.servicedesk.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SLA (Service Level Agreement) Service
 * Tracks and monitors SLA compliance for service requests
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SLAService {

    private final SLARepository slaRepository;
    private final SLATrackingRepository slaTrackingRepository;
    private final ServiceRequestRepository requestRepository;
    private final NotificationService notificationService;

    /**
     * Start SLA tracking for a new request
     * 
     * @param request The service request
     */
    @Transactional
    public void startSLATracking(ServiceRequest request) {
        try {
            log.info("Starting SLA tracking for request #{}", request.getId());

            // Find applicable SLA (category-specific or default)
            SLA sla = slaRepository
                    .findByPriority(SLA.Priority.valueOf(request.getPriority().name()))
                    .orElseThrow(() -> new RuntimeException(
                            "No SLA found for priority: " + request.getPriority()));

            // Create tracking record
            SLATracking tracking = new SLATracking();
            tracking.setRequest(request);
            tracking.setSla(sla);
            tracking.setResponseDueAt(
                    LocalDateTime.now().plusHours(sla.getResponseTimeHours()));
            tracking.setResolutionDueAt(
                    LocalDateTime.now().plusHours(sla.getResolutionTimeHours()));
            tracking.setResponseMet(false);
            tracking.setResolutionMet(false);
            tracking.setBreached(false);

            slaTrackingRepository.save(tracking);

            log.info("SLA tracking started for request #{}. Resolution due: {}",
                    request.getId(),
                    tracking.getResolutionDueAt());

        } catch (Exception e) {
            log.error("Failed to start SLA tracking for request #{}", request.getId(), e);
            // Don't fail the request creation
        }
    }

    /**
     * Check for SLA breaches - runs every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    @Transactional
    public void checkSLABreaches() {
        LocalDateTime now = LocalDateTime.now();

        try {
            // Find overdue requests
            List<SLATracking> overdue = slaTrackingRepository
                    .findByResolutionDueAtBeforeAndBreachedFalse(now);

            if (!overdue.isEmpty()) {
                log.info("Found {} requests with SLA breaches", overdue.size());
            }

            for (SLATracking tracking : overdue) {
                // Mark as breached
                tracking.setBreached(true);
                slaTrackingRepository.save(tracking);

                // Escalate request
                escalateRequest(tracking.getRequest());

                // Notify management
                notificationService.notifyManagement(
                        "SLA Breach Alert",
                        String.format("Request #%d has breached SLA. Immediate attention required.",
                                tracking.getRequest().getId()));

                log.warn("SLA breached for request #{}", tracking.getRequest().getId());
            }

            // Check for approaching deadlines (1 hour before)
            List<SLATracking> approaching = slaTrackingRepository
                    .findByResolutionDueAtBetweenAndBreachedFalse(
                            now,
                            now.plusHours(1));

            for (SLATracking tracking : approaching) {
                notificationService.notifyAssignedUser(
                        tracking.getRequest(),
                        "SLA Warning",
                        String.format("Request #%d is approaching SLA deadline in 1 hour.",
                                tracking.getRequest().getId()));
            }

        } catch (Exception e) {
            log.error("Error checking SLA breaches", e);
        }
    }

    /**
     * Update SLA tracking when request status changes
     * 
     * @param request   The service request
     * @param newStatus The new status
     */
    @Transactional
    public void updateTracking(ServiceRequest request, ServiceRequest.RequestStatus newStatus) {
        try {
            SLATracking tracking = slaTrackingRepository
                    .findByRequestId(request.getId())
                    .orElse(null);

            if (tracking == null) {
                return;
            }

            // Mark response as met when first moved to IN_PROGRESS
            if (newStatus == ServiceRequest.RequestStatus.IN_PROGRESS && !tracking.isResponseMet()) {
                tracking.setResponseMet(true);
                slaTrackingRepository.save(tracking);
                log.info("Response SLA met for request #{}", request.getId());
            }

            // Mark resolution as met when RESOLVED
            if (newStatus == ServiceRequest.RequestStatus.RESOLVED && !tracking.isResolutionMet()) {
                tracking.setResolutionMet(true);
                slaTrackingRepository.save(tracking);
                log.info("Resolution SLA met for request #{}", request.getId());
            }

        } catch (Exception e) {
            log.error("Failed to update SLA tracking for request #{}", request.getId(), e);
        }
    }

    /**
     * Escalate request by increasing priority
     */
    private void escalateRequest(ServiceRequest request) {
        try {
            if (request.getPriority() != ServiceRequest.Priority.CRITICAL) {
                ServiceRequest.Priority oldPriority = request.getPriority();
                request.setPriority(ServiceRequest.Priority.HIGH);
                requestRepository.save(request);

                log.info("Request #{} escalated from {} to {}",
                        request.getId(),
                        oldPriority,
                        ServiceRequest.Priority.HIGH);
            }
        } catch (Exception e) {
            log.error("Failed to escalate request #{}", request.getId(), e);
        }
    }

    /**
     * Convert ServiceRequest Priority to SLA Priority
     */
    private String convertPriority(ServiceRequest.Priority priority) {
        return priority.name();
    }
}

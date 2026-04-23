package com.servicedesk.service;

import com.servicedesk.entity.SLATracking;
import com.servicedesk.entity.ServiceRequest;
import com.servicedesk.repository.SLATrackingRepository;
import com.servicedesk.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SLA Monitoring Service
 * Monitors and tracks SLA compliance
 */
@Service
@Transactional
public class SLAMonitoringService {

    @Autowired
    private SLATrackingRepository slaTrackingRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Check for SLA breaches
     * Runs every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void checkSLABreaches() {
        LocalDateTime now = LocalDateTime.now();

        // Check response SLA breaches
        List<SLATracking> responseBreaches = slaTrackingRepository.findResponseSLABreaches(now);
        responseBreaches.forEach(tracking -> {
            if (tracking.getResponseDueAt().isBefore(now) && !tracking.isResponseMet()) {
                tracking.setBreached(true);
                slaTrackingRepository.save(tracking);

                // Send notification
                ServiceRequest request = tracking.getRequest();
                notificationService.sendSLABreachNotification(request, "Response");
            }
        });

        // Check resolution SLA breaches
        List<SLATracking> resolutionBreaches = slaTrackingRepository.findResolutionSLABreaches(now);
        resolutionBreaches.forEach(tracking -> {
            if (tracking.getResolutionDueAt().isBefore(now) && !tracking.isResolutionMet()) {
                tracking.setBreached(true);
                slaTrackingRepository.save(tracking);

                // Send notification
                ServiceRequest request = tracking.getRequest();
                notificationService.sendSLABreachNotification(request, "Resolution");
            }
        });
    }

    /**
     * Get SLA tracking for request
     */
    public SLATracking getSLATrackingByRequestId(Long requestId) {
        return slaTrackingRepository.findByRequestId(requestId)
                .orElse(null);
    }

    /**
     * Get SLA compliance statistics
     */
    public SLAStatistics getSLAStatistics() {
        Long responseBreaches = slaTrackingRepository.countResponseBreaches();
        Long resolutionBreaches = slaTrackingRepository.countResolutionBreaches();
        Long totalTracked = slaTrackingRepository.count();

        return new SLAStatistics(responseBreaches, resolutionBreaches, totalTracked);
    }

    /**
     * SLA Statistics inner class
     */
    public static class SLAStatistics {
        public Long responseBreaches;
        public Long resolutionBreaches;
        public Long totalTracked;

        public SLAStatistics(Long responseBreaches, Long resolutionBreaches, Long totalTracked) {
            this.responseBreaches = responseBreaches;
            this.resolutionBreaches = resolutionBreaches;
            this.totalTracked = totalTracked;
        }
    }
}

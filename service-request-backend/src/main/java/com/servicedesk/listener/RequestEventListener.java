package com.servicedesk.listener;

import com.servicedesk.entity.ServiceRequest;
import com.servicedesk.event.RequestStatusChangeEvent;
import com.servicedesk.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Event Listener for Request Events
 * Handles automated actions when request events occur
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RequestEventListener {

    private final NotificationService notificationService;
    private final SLAService slaService;

    /**
     * Handle status change events
     * Triggers notifications, logging, and SLA updates
     */
    @EventListener
    @Async
    public void handleStatusChange(RequestStatusChangeEvent event) {
        try {
            log.info("Processing status change event for request #{}: {} -> {}",
                    event.getRequest().getId(),
                    event.getOldStatus(),
                    event.getNewStatus());

            // Send notifications
            sendStatusChangeNotifications(event);

            // Update SLA tracking
            updateSLATracking(event);

        } catch (Exception e) {
            log.error("Error processing status change event for request #{}",
                    event.getRequest().getId(), e);
        }
    }

    /**
     * Send notifications for status change
     */
    private void sendStatusChangeNotifications(RequestStatusChangeEvent event) {
        try {
            // Notify request creator
            notificationService.notifyUser(
                    event.getRequest().getRequester(),
                    "Request Status Updated",
                    String.format("Your request #%d is now %s",
                            event.getRequest().getId(),
                            event.getNewStatus()));

            // Notify assigned user if exists
            if (event.getRequest().getAssignedAgent() != null) {
                notificationService.notifyUser(
                        event.getRequest().getAssignedAgent(),
                        "Assigned Request Updated",
                        String.format("Request #%d status changed to %s",
                                event.getRequest().getId(),
                                event.getNewStatus()));
            }

        } catch (Exception e) {
            log.error("Failed to send status change notifications", e);
        }
    }

    /**
     * Update SLA tracking
     */
    private void updateSLATracking(RequestStatusChangeEvent event) {
        try {
            slaService.updateTracking(
                    event.getRequest(),
                    event.getNewStatus());
        } catch (Exception e) {
            log.error("Failed to update SLA tracking", e);
        }
    }
}

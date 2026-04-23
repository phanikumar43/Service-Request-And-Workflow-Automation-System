package com.servicedesk.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * WebSocket Service
 * Handles real-time message sending to connected clients
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send notification to a specific user
     * 
     * @param userId       User ID
     * @param notification Notification object
     */
    public void sendToUser(Long userId, Object notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    notification);

            log.debug("Sent notification to user {}", userId);

        } catch (Exception e) {
            log.error("Failed to send WebSocket message to user {}", userId, e);
        }
    }

    /**
     * Broadcast message to all connected users
     * 
     * @param destination Topic destination (e.g., "/topic/updates")
     * @param message     Message object
     */
    public void broadcast(String destination, Object message) {
        try {
            messagingTemplate.convertAndSend(destination, message);

            log.debug("Broadcast message to {}", destination);

        } catch (Exception e) {
            log.error("Failed to broadcast WebSocket message to {}", destination, e);
        }
    }

    /**
     * Send update to all users about a request change
     * 
     * @param requestId  Request ID
     * @param updateType Type of update (e.g., "STATUS_CHANGE", "NEW_COMMENT")
     * @param data       Update data
     */
    public void broadcastRequestUpdate(Long requestId, String updateType, Object data) {
        try {
            RequestUpdateMessage message = new RequestUpdateMessage(
                    requestId,
                    updateType,
                    data,
                    System.currentTimeMillis());

            broadcast("/topic/requests", message);

        } catch (Exception e) {
            log.error("Failed to broadcast request update for request #{}", requestId, e);
        }
    }

    /**
     * Send notification to department members
     * 
     * @param departmentId Department ID
     * @param notification Notification object
     */
    public void sendToDepartment(Long departmentId, Object notification) {
        try {
            messagingTemplate.convertAndSend(
                    "/topic/department/" + departmentId,
                    notification);

            log.debug("Sent notification to department {}", departmentId);

        } catch (Exception e) {
            log.error("Failed to send WebSocket message to department {}", departmentId, e);
        }
    }

    /**
     * Request Update Message DTO
     */
    public record RequestUpdateMessage(
            Long requestId,
            String updateType,
            Object data,
            Long timestamp) {
    }
}

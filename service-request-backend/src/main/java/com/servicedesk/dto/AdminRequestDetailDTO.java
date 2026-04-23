package com.servicedesk.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for detailed admin request view
 */
@Data
public class AdminRequestDetailDTO {
    private Long id;
    private String ticketId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;

    // Requester info
    private String requesterName;
    private String requesterEmail;

    // Category info
    private String categoryName;
    private String requestTypeName;

    // Assignment info
    private String departmentName;
    private String assignedAgentName;

    // Activity log
    private List<ActivityLogDTO> activityLog;
}

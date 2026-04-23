package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Comprehensive DTO for request details view
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestDetailsDTO {

    // Request Info
    private Long id;
    private String ticketId;
    private String title;
    private String description;
    private String priority;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Requester Info
    private Long requesterId;
    private String requesterName;
    private String requesterEmail;
    private String requesterPhone;
    private String requesterDepartment;

    // Category & Type
    private String categoryName;
    private String typeName;

    // Assignment Info
    private Long departmentId;
    private String departmentName;
    private Long assignedAgentId;
    private String assignedAgentName;
    private String assignedAgentEmail;

    // SLA Info
    private Long slaId;
    private String slaName;
    private Integer slaHours;
    private LocalDateTime dueDate;
    private Boolean isOverdue;

    // Activity Timeline
    private List<ActivityLogDTO> activityLog;

    // Attachments (if applicable)
    private List<String> attachments;
}

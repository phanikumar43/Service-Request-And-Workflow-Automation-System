package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for displaying service requests in admin panel
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequestDTO {
    private Long id;
    private String ticketId;
    private String userName;
    private String userEmail;
    private String categoryName;
    private String typeName;
    private String title;
    private String description;
    private String priority;
    private String status;
    private Long departmentId;
    private String departmentName;
    private String assignedAgentName;
    private String assignedAgentEmail;
    private String rejectionReason;
    private String lastUpdatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

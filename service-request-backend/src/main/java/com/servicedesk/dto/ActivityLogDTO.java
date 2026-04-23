package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for activity log entries
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDTO {

    private Long id;
    private String actionType;
    private String performedBy;
    private String oldValue;
    private String newValue;
    private String notes;
    private LocalDateTime createdAt;
}

package com.servicedesk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for assigning requests to departments or agents
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignRequestDTO {
    private Long departmentId;
    private Long agentId;
    private String notes;
}

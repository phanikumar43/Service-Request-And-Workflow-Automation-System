package com.servicedesk.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for escalating a service request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EscalateRequestDTO {

    @NotBlank(message = "Escalation reason is required")
    private String reason;

    private Long escalateToDepartmentId;

    private Long escalateToAgentId;

    private String notes;
}

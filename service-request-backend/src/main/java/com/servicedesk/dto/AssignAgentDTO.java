package com.servicedesk.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for assigning agent to a service request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignAgentDTO {

    @NotNull(message = "Agent ID is required")
    private Long agentId;

    private String notes;
}

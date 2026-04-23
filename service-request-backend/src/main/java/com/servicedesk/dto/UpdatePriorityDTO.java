package com.servicedesk.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating request priority
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePriorityDTO {

    @NotNull(message = "Priority is required")
    @Pattern(regexp = "LOW|MEDIUM|HIGH|CRITICAL", message = "Invalid priority value")
    private String priority;

    private String notes;
}

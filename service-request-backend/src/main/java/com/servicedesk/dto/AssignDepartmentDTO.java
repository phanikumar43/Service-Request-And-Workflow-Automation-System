package com.servicedesk.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for assigning department to a service request
 * Enhanced with validation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignDepartmentDTO {

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private String notes;
}

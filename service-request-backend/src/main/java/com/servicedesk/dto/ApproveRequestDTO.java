package com.servicedesk.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for approving a service request
 */
@Data
public class ApproveRequestDTO {

    /**
     * Optional notes to add when approving the request
     */
    private String notes;
}

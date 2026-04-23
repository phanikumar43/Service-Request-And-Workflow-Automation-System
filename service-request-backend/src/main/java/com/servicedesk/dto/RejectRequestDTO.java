package com.servicedesk.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for rejecting a service request
 */
@Data
public class RejectRequestDTO {

    /**
     * Mandatory reason for rejecting the request
     */
    @NotBlank(message = "Rejection reason is required")
    private String rejectionReason;
}

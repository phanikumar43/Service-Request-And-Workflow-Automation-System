package com.servicedesk.dto;

import com.servicedesk.entity.ServiceRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Service Request Creation DTO
 * Supports both service-based and category/request-type-based flows
 */
@Data
public class ServiceRequestDTO {

    // For category-based flow (new)
    private Long requestTypeId;
    private Long categoryId;

    // For service-based flow (legacy)
    private Long serviceId;
    private Long typeId; // Deprecated, use requestTypeId

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private ServiceRequest.Priority priority;
}

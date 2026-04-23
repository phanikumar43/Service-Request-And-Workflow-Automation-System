package com.servicedesk.dto;

import com.servicedesk.entity.ServiceRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

/**
 * DTO for creating a new categorized service request
 */
@Data
public class CreateCategorizedRequestDTO {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Request type ID is required")
    private Long typeId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private ServiceRequest.Priority priority;

    /**
     * Custom fields specific to the request type
     * Example: {"system_name": "Outlook", "error_message": "Invalid credentials"}
     */
    private Map<String, Object> customFields;
}

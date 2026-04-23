package com.servicedesk.dto;

import com.servicedesk.entity.ServiceRequest;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for Service Catalog
 */
@Data
public class ServiceCatalogDTO {

    private Long id;
    private String name;
    private String description;
    private ServiceCategoryDTO category;
    private String iconUrl;
    private Boolean isActive;
    private Boolean requiresApproval;
    private Integer estimatedResolutionHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional fields for ServiceCatalogService compatibility
    private ServiceRequest.Priority defaultPriority;
    private String department;
    private Integer slaHours;
    private Long categoryId;
    private String categoryName;
    private Long slaId;
    private String slaName;
}

package com.servicedesk.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for Service Category
 */
@Data
public class ServiceCategoryDTO {

    private Long id;
    private String name;
    private String description;
    private String iconUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional fields for ServiceCatalogService compatibility
    private String icon;
    private String department;
    private int serviceCount;
}

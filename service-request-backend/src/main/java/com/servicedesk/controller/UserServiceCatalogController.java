package com.servicedesk.controller;

import com.servicedesk.dto.ServiceCatalogDTO;
import com.servicedesk.dto.ServiceCategoryDTO;
import com.servicedesk.service.ServiceCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User Service Catalog Controller
 * Provides read-only access to active services for users
 */
@RestController
@RequestMapping("/user/service-catalog")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_END_USER', 'ROLE_ADMIN')")
public class UserServiceCatalogController {

    @Autowired
    private ServiceCatalogService serviceCatalogService;

    /**
     * Get active categories
     * GET /api/user/service-catalog/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<ServiceCategoryDTO>> getActiveCategories() {
        List<ServiceCategoryDTO> categories = serviceCatalogService.getActiveCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active services by category
     * GET /api/user/service-catalog/categories/{categoryId}/services
     */
    @GetMapping("/categories/{categoryId}/services")
    public ResponseEntity<List<ServiceCatalogDTO>> getServicesByCategory(@PathVariable Long categoryId) {
        List<ServiceCatalogDTO> services = serviceCatalogService.getServicesByCategory(categoryId);
        return ResponseEntity.ok(services);
    }

    /**
     * Get category by ID
     * GET /api/user/service-catalog/categories/{id}
     */
    @GetMapping("/categories/{id}")
    public ResponseEntity<ServiceCategoryDTO> getCategoryById(@PathVariable Long id) {
        ServiceCategoryDTO category = serviceCatalogService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    /**
     * Get all active services
     * GET /api/user/service-catalog/services
     */
    @GetMapping("/services")
    public ResponseEntity<List<ServiceCatalogDTO>> getActiveServices() {
        List<ServiceCatalogDTO> services = serviceCatalogService.getActiveServices();
        return ResponseEntity.ok(services);
    }
}

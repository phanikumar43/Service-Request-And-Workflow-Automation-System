package com.servicedesk.controller;

import com.servicedesk.dto.ApiResponse;
import com.servicedesk.dto.ServiceCatalogDTO;
import com.servicedesk.dto.ServiceCategoryDTO;
import com.servicedesk.entity.ServiceCategory;
import com.servicedesk.service.ServiceCatalogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin Service Catalog Controller
 * Manages service catalog for administrators
 */
@RestController
@RequestMapping("/admin/service-catalog")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminServiceCatalogController {

    @Autowired
    private ServiceCatalogService serviceCatalogService;

    /**
     * Get all services
     * GET /api/admin/service-catalog
     */
    @GetMapping
    public ResponseEntity<List<ServiceCatalogDTO>> getAllServices() {
        List<ServiceCatalogDTO> services = serviceCatalogService.getAllServices();
        return ResponseEntity.ok(services);
    }

    /**
     * Get service by ID
     * GET /api/admin/service-catalog/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {
        try {
            ServiceCatalogDTO service = serviceCatalogService.getServiceById(id);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Create new service
     * POST /api/admin/service-catalog
     */
    @PostMapping
    public ResponseEntity<?> createService(@Valid @RequestBody ServiceCatalogDTO dto) {
        try {
            ServiceCatalogDTO created = serviceCatalogService.createService(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to create service: " + e.getMessage()));
        }
    }

    /**
     * Update service
     * PUT /api/admin/service-catalog/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceCatalogDTO dto) {
        try {
            ServiceCatalogDTO updated = serviceCatalogService.updateService(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update service: " + e.getMessage()));
        }
    }

    /**
     * Delete (soft delete) service
     * DELETE /api/admin/service-catalog/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        try {
            serviceCatalogService.deleteService(id);
            return ResponseEntity.ok(new ApiResponse(true, "Service disabled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to delete service: " + e.getMessage()));
        }
    }

    /**
     * Get all categories
     * GET /api/admin/service-catalog/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<ServiceCategoryDTO>> getAllCategories() {
        List<ServiceCategoryDTO> categories = serviceCatalogService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Create category
     * POST /api/admin/service-catalog/categories
     */
    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@Valid @RequestBody ServiceCategoryDTO dto) {
        try {
            ServiceCategoryDTO created = serviceCatalogService.createCategory(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to create category: " + e.getMessage()));
        }
    }

    /**
     * Update category
     * PUT /api/admin/service-catalog/categories/{id}
     */
    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody ServiceCategoryDTO dto) {
        try {
            ServiceCategoryDTO updated = serviceCatalogService.updateCategory(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update category: " + e.getMessage()));
        }
    }
}

package com.servicedesk.controller;

import com.servicedesk.entity.RequestType;
import com.servicedesk.entity.ServiceCategory;
import com.servicedesk.service.CategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Service Category Controller
 * Unified API for service categories and request types
 * Provides user-friendly endpoints for the Create Request flow
 */
@RestController
@RequestMapping("/service-categories")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_END_USER', 'ROLE_ADMIN')")
public class ServiceCategoryController {

    private static final Logger log = LoggerFactory.getLogger(ServiceCategoryController.class);

    @Autowired
    private CategoryService categoryService;

    /**
     * Get all active service categories
     * GET /api/service-categories
     * 
     * Used by: Create Request page to display category selection
     */
    @GetMapping
    public ResponseEntity<List<ServiceCategory>> getAllCategories() {
        log.info("=== FETCHING ALL ACTIVE SERVICE CATEGORIES ===");

        try {
            List<ServiceCategory> categories = categoryService.getAllActiveCategories();
            log.info("Found {} active categories", categories.size());

            if (categories.isEmpty()) {
                log.warn("No active categories found in database");
            } else {
                categories.forEach(cat -> log.debug("Category: id={}, name={}, isActive={}",
                        cat.getId(), cat.getName(), cat.getIsActive()));
            }

            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error fetching categories: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Get category by ID
     * GET /api/service-categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServiceCategory> getCategoryById(@PathVariable Long id) {
        log.info("Fetching category by ID: {}", id);
        ServiceCategory category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    /**
     * Get request types for a specific category
     * GET /api/service-categories/{categoryId}/types
     * 
     * Used by: Create Request page after category selection
     */
    @GetMapping("/{categoryId}/types")
    public ResponseEntity<List<RequestType>> getTypesByCategory(@PathVariable Long categoryId) {
        log.info("=== FETCHING REQUEST TYPES FOR CATEGORY {} ===", categoryId);

        try {
            List<RequestType> types = categoryService.getTypesByCategory(categoryId);
            log.info("Found {} request types for category {}", types.size(), categoryId);

            if (types.isEmpty()) {
                log.warn("No request types found for category {}", categoryId);
            } else {
                types.forEach(type -> log.debug("Request Type: id={}, name={}, isActive={}",
                        type.getId(), type.getName(), type.getIsActive()));
            }

            return ResponseEntity.ok(types);
        } catch (Exception e) {
            log.error("Error fetching request types for category {}: {}", categoryId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Get all active request types (across all categories)
     * GET /api/service-categories/types/all
     */
    @GetMapping("/types/all")
    public ResponseEntity<List<RequestType>> getAllTypes() {
        log.info("Fetching all active request types");
        List<RequestType> types = categoryService.getAllActiveTypes();
        log.info("Found {} active request types", types.size());
        return ResponseEntity.ok(types);
    }
}

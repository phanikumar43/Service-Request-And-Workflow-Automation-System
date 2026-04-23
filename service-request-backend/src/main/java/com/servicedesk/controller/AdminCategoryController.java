package com.servicedesk.controller;

import com.servicedesk.dto.ApiResponse;
import com.servicedesk.dto.ServiceCategoryDTO;
import com.servicedesk.service.ServiceCatalogService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin Category Controller
 * Provides full CRUD operations for service categories (admin only)
 */
@RestController
@RequestMapping("/admin/categories")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminCategoryController {

    private static final Logger log = LoggerFactory.getLogger(AdminCategoryController.class);

    @Autowired
    private ServiceCatalogService serviceCatalogService;

    /**
     * Get all categories (including inactive)
     * GET /api/admin/categories
     */
    @GetMapping
    public ResponseEntity<List<ServiceCategoryDTO>> getAllCategories() {
        log.info("Admin fetching all categories");
        List<ServiceCategoryDTO> categories = serviceCatalogService.getAllCategories();
        log.info("Found {} categories", categories.size());
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category by ID
     * GET /api/admin/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {
            log.info("Admin fetching category with id: {}", id);
            ServiceCategoryDTO category = serviceCatalogService.getCategoryById(id);
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            log.error("Error fetching category {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Create new category
     * POST /api/admin/categories
     */
    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody ServiceCategoryDTO dto) {
        try {
            log.info("Admin creating new category: {}", dto.getName());

            // Validate unique name
            if (serviceCatalogService.categoryNameExists(dto.getName())) {
                log.warn("Category name already exists: {}", dto.getName());
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Category name already exists"));
            }

            ServiceCategoryDTO created = serviceCatalogService.createCategory(dto);
            log.info("Category created successfully with id: {}", created.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Error creating category: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to create category: " + e.getMessage()));
        }
    }

    /**
     * Update category
     * PUT /api/admin/categories/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody ServiceCategoryDTO dto) {
        try {
            log.info("Admin updating category {}: {}", id, dto.getName());

            // Validate unique name (excluding current category)
            if (serviceCatalogService.categoryNameExistsExcludingId(dto.getName(), id)) {
                log.warn("Category name already exists: {}", dto.getName());
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Category name already exists"));
            }

            ServiceCategoryDTO updated = serviceCatalogService.updateCategory(id, dto);
            log.info("Category {} updated successfully", id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error updating category {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update category: " + e.getMessage()));
        }
    }

    /**
     * Toggle category active status
     * PATCH /api/admin/categories/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleCategoryStatus(@PathVariable Long id) {
        try {
            log.info("Admin toggling status for category {}", id);
            ServiceCategoryDTO category = serviceCatalogService.toggleCategoryStatus(id);
            log.info("Category {} status toggled to: {}", id, category.getIsActive());
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            log.error("Error toggling category {} status: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to toggle category status: " + e.getMessage()));
        }
    }

    /**
     * Delete (soft delete) category
     * DELETE /api/admin/categories/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            log.info("Admin deleting category {}", id);
            serviceCatalogService.deleteCategory(id);
            log.info("Category {} deleted successfully", id);
            return ResponseEntity.ok(new ApiResponse(true, "Category disabled successfully"));
        } catch (Exception e) {
            log.error("Error deleting category {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to delete category: " + e.getMessage()));
        }
    }
}

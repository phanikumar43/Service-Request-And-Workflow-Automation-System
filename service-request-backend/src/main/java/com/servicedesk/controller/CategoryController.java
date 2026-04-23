package com.servicedesk.controller;

import com.servicedesk.entity.RequestType;
import com.servicedesk.entity.ServiceCategory;
import com.servicedesk.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for request categories and types
 * Accessible by authenticated users
 */
@RestController
@RequestMapping("/user/categories")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_END_USER', 'ROLE_ADMIN')")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * Get all active categories
     * GET /api/user/categories
     */
    @GetMapping
    public ResponseEntity<List<ServiceCategory>> getAllCategories() {
        List<ServiceCategory> categories = categoryService.getAllActiveCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category by ID
     * GET /api/user/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServiceCategory> getCategoryById(@PathVariable Long id) {
        ServiceCategory category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    /**
     * Get request types for a category
     * GET /api/user/categories/{categoryId}/types
     */
    @GetMapping("/{categoryId}/types")
    public ResponseEntity<List<RequestType>> getTypesByCategory(@PathVariable Long categoryId) {
        List<RequestType> types = categoryService.getTypesByCategory(categoryId);
        return ResponseEntity.ok(types);
    }

    /**
     * Get all active request types
     * GET /api/user/categories/types/all
     */
    @GetMapping("/types/all")
    public ResponseEntity<List<RequestType>> getAllTypes() {
        List<RequestType> types = categoryService.getAllActiveTypes();
        return ResponseEntity.ok(types);
    }
}

package com.servicedesk.service;

import com.servicedesk.entity.RequestType;
import com.servicedesk.entity.ServiceCategory;
import com.servicedesk.repository.RequestTypeRepository;
import com.servicedesk.repository.ServiceCategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing request categories and types
 */
@Service
@Transactional
public class CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    /**
     * Get all active categories
     */
    public List<ServiceCategory> getAllActiveCategories() {
        log.debug("Fetching all active categories");
        List<ServiceCategory> categories = categoryRepository.findByIsActiveTrueOrderByNameAsc();
        log.info("Found {} active categories", categories.size());
        return categories;
    }

    /**
     * Get category by ID
     */
    public ServiceCategory getCategoryById(Long id) {
        log.debug("Fetching category with id: {}", id);
        return categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Category not found with id: {}", id);
                    return new RuntimeException("Category not found with id: " + id);
                });
    }

    /**
     * Get all request types for a category
     */
    public List<RequestType> getTypesByCategory(Long categoryId) {
        log.info("Fetching request types for category id: {}", categoryId);

        try {
            List<RequestType> types = requestTypeRepository.findByCategoryIdAndIsActiveTrue(categoryId);
            log.info("Found {} active types for category {}", types.size(), categoryId);
            return types;
        } catch (Exception e) {
            log.error("Error fetching types for category {}: {}", categoryId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch request types", e);
        }
    }

    /**
     * Get request type by ID
     */
    public RequestType getTypeById(Long id) {
        log.debug("Fetching request type with id: {}", id);
        return requestTypeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Request type not found with id: {}", id);
                    return new RuntimeException("Request type not found with id: " + id);
                });
    }

    /**
     * Get all active request types
     */
    public List<RequestType> getAllActiveTypes() {
        log.debug("Fetching all active request types");
        List<RequestType> types = requestTypeRepository.findByIsActiveTrue();
        log.info("Found {} active request types", types.size());
        return types;
    }
}

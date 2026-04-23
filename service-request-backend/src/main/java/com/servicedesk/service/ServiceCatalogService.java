package com.servicedesk.service;

import com.servicedesk.dto.ServiceCatalogDTO;
import com.servicedesk.dto.ServiceCategoryDTO;
import com.servicedesk.entity.ServiceCatalog;
import com.servicedesk.entity.ServiceCategory;
import com.servicedesk.entity.SLA;
import com.servicedesk.exception.ResourceNotFoundException;
import com.servicedesk.repository.ServiceCatalogRepository;
import com.servicedesk.repository.ServiceCategoryRepository;
import com.servicedesk.repository.SLARepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Catalog Service
 * Business logic for service catalog management
 */
@Service
public class ServiceCatalogService {

    @Autowired
    private ServiceCatalogRepository serviceCatalogRepository;

    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    @Autowired
    private SLARepository slaRepository;

    /**
     * Get all service categories
     */
    public List<ServiceCategoryDTO> getAllCategories() {
        return serviceCategoryRepository.findByDeletedFalse().stream()
                .map(this::mapCategoryToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get active categories only
     */
    public List<ServiceCategoryDTO> getActiveCategories() {
        return serviceCategoryRepository.findByDeletedFalseAndIsActiveTrueOrderByNameAsc().stream()
                .map(this::mapCategoryToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all services
     */
    @Transactional(readOnly = true)
    public List<ServiceCatalogDTO> getAllServices() {
        System.out.println("Fetching all services...");
        List<ServiceCatalog> services = serviceCatalogRepository.findAll();
        System.out.println("Found " + services.size() + " services in DB.");

        return services.stream()
                .map(this::mapServiceToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get active services only
     */
    public List<ServiceCatalogDTO> getActiveServices() {
        return serviceCatalogRepository.findByIsActive(true).stream()
                .map(this::mapServiceToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get services by category
     */
    public List<ServiceCatalogDTO> getServicesByCategory(Long categoryId) {
        return serviceCatalogRepository.findByCategoryIdAndIsActive(categoryId, true).stream()
                .map(this::mapServiceToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get service by ID
     */
    public ServiceCatalogDTO getServiceById(Long id) {
        ServiceCatalog service = serviceCatalogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
        return mapServiceToDTO(service);
    }

    /**
     * Create new service
     */
    @Transactional
    public ServiceCatalogDTO createService(ServiceCatalogDTO dto) {
        ServiceCatalog service = new ServiceCatalog();
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        service.setRequiresApproval(dto.getRequiresApproval() != null ? dto.getRequiresApproval() : false);
        service.setDefaultPriority(dto.getDefaultPriority());
        service.setDepartment(dto.getDepartment());
        service.setSlaHours(dto.getSlaHours());

        // Set category
        ServiceCategory category = serviceCategoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));
        service.setCategory(category);

        // Set SLA if provided
        if (dto.getSlaId() != null) {
            SLA sla = slaRepository.findById(dto.getSlaId())
                    .orElseThrow(() -> new ResourceNotFoundException("SLA", "id", dto.getSlaId()));
            service.setSla(sla);
        }

        ServiceCatalog saved = serviceCatalogRepository.save(service);
        return mapServiceToDTO(saved);
    }

    /**
     * Update service
     */
    @Transactional
    public ServiceCatalogDTO updateService(Long id, ServiceCatalogDTO dto) {
        ServiceCatalog service = serviceCatalogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));

        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setIsActive(dto.getIsActive());
        service.setRequiresApproval(dto.getRequiresApproval());
        service.setDefaultPriority(dto.getDefaultPriority());
        service.setDepartment(dto.getDepartment());
        service.setSlaHours(dto.getSlaHours());

        // Update category
        if (dto.getCategoryId() != null) {
            ServiceCategory category = serviceCategoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));
            service.setCategory(category);
        }

        // Update SLA
        if (dto.getSlaId() != null) {
            SLA sla = slaRepository.findById(dto.getSlaId())
                    .orElseThrow(() -> new ResourceNotFoundException("SLA", "id", dto.getSlaId()));
            service.setSla(sla);
        } else {
            service.setSla(null);
        }

        ServiceCatalog updated = serviceCatalogRepository.save(service);
        return mapServiceToDTO(updated);
    }

    /**
     * Delete (soft delete) service
     */
    @Transactional
    public void deleteService(Long id) {
        ServiceCatalog service = serviceCatalogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
        service.setIsActive(false);
        serviceCatalogRepository.save(service);
    }

    /**
     * Create category
     */
    @Transactional
    public ServiceCategoryDTO createCategory(ServiceCategoryDTO dto) {
        ServiceCategory category = new ServiceCategory();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());
        category.setDepartment(dto.getDepartment());
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        ServiceCategory saved = serviceCategoryRepository.save(category);
        return mapCategoryToDTO(saved);
    }

    /**
     * Update category
     */
    @Transactional
    public ServiceCategoryDTO updateCategory(Long id, ServiceCategoryDTO dto) {
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());
        category.setDepartment(dto.getDepartment());
        category.setIsActive(dto.getIsActive());

        ServiceCategory updated = serviceCategoryRepository.save(category);
        return mapCategoryToDTO(updated);
    }

    /**
     * Map ServiceCategory to DTO
     */
    private ServiceCategoryDTO mapCategoryToDTO(ServiceCategory category) {
        ServiceCategoryDTO dto = new ServiceCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setIcon(category.getIcon());
        dto.setDepartment(category.getDepartment());
        dto.setIsActive(category.getIsActive());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());

        // Count services in this category
        int serviceCount = serviceCatalogRepository.findByCategoryId(category.getId()).size();
        dto.setServiceCount(serviceCount);

        return dto;
    }

    /**
     * Map ServiceCatalog to DTO
     */
    private ServiceCatalogDTO mapServiceToDTO(ServiceCatalog service) {
        ServiceCatalogDTO dto = new ServiceCatalogDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setIsActive(service.getIsActive());
        dto.setRequiresApproval(service.getRequiresApproval());
        dto.setDefaultPriority(service.getDefaultPriority());
        dto.setDepartment(service.getDepartment());
        dto.setSlaHours(service.getSlaHours());
        dto.setCreatedAt(service.getCreatedAt());
        dto.setUpdatedAt(service.getUpdatedAt());

        // Set category info
        if (service.getCategory() != null) {
            dto.setCategoryId(service.getCategory().getId());
            dto.setCategoryName(service.getCategory().getName());
        }

        // Set SLA info
        if (service.getSla() != null) {
            dto.setSlaId(service.getSla().getId());
            dto.setSlaName(service.getSla().getName());
        }

        return dto;
    }

    /**
     * Get category by ID (for admin)
     */
    public ServiceCategoryDTO getCategoryById(Long id) {
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapCategoryToDTO(category);
    }

    /**
     * Check if category name exists
     */
    public boolean categoryNameExists(String name) {
        return serviceCategoryRepository.existsByNameAndDeletedFalse(name);
    }

    /**
     * Check if category name exists excluding a specific ID
     */
    public boolean categoryNameExistsExcludingId(String name, Long excludeId) {
        return serviceCategoryRepository.findByNameAndDeletedFalse(name)
                .map(category -> !category.getId().equals(excludeId))
                .orElse(false);
    }

    /**
     * Toggle category active status
     */
    @Transactional
    public ServiceCategoryDTO toggleCategoryStatus(Long id) {
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        category.setIsActive(!category.getIsActive());
        ServiceCategory updated = serviceCategoryRepository.save(category);
        return mapCategoryToDTO(updated);
    }

    /**
     * Delete (soft delete) category
     */
    @Transactional
    public void deleteCategory(Long id) {
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        category.setIsActive(false);
        category.setDeleted(true);
        serviceCategoryRepository.save(category);
    }
}

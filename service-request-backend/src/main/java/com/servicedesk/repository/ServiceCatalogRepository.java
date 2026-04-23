package com.servicedesk.repository;

import com.servicedesk.entity.ServiceCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for ServiceCatalog entity
 */
@Repository
public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Long> {

    List<ServiceCatalog> findByCategoryId(Long categoryId);

    List<ServiceCatalog> findByIsActive(Boolean isActive);

    List<ServiceCatalog> findByCategoryIdAndIsActive(Long categoryId, Boolean isActive);
}

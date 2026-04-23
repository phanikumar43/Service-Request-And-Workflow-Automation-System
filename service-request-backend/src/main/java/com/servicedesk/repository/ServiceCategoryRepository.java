package com.servicedesk.repository;

import com.servicedesk.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ServiceCategory entity
 */
@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

    Optional<ServiceCategory> findByName(String name);

    List<ServiceCategory> findByIsActive(Boolean isActive);

    List<ServiceCategory> findByIsActiveTrueOrderByNameAsc();

    boolean existsByName(String name);

    // Soft delete support
    List<ServiceCategory> findByDeletedFalse();

    List<ServiceCategory> findByDeletedFalseAndIsActiveTrueOrderByNameAsc();

    boolean existsByNameAndDeletedFalse(String name);

    Optional<ServiceCategory> findByNameAndDeletedFalse(String name);
}

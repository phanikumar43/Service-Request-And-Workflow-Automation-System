package com.servicedesk.repository;

import com.servicedesk.entity.CategoryDepartmentMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Category-Department Mapping Entity
 */
@Repository
public interface CategoryDepartmentMappingRepository extends JpaRepository<CategoryDepartmentMapping, Long> {

    /**
     * Find all mappings for a category
     */
    List<CategoryDepartmentMapping> findByCategoryId(Long categoryId);

    /**
     * Find all mappings for a department
     */
    List<CategoryDepartmentMapping> findByDepartmentId(Long departmentId);
}

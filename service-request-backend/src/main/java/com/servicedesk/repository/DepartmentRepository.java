package com.servicedesk.repository;

import com.servicedesk.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Department entity
 */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    List<Department> findByIsActiveTrue();

    Optional<Department> findByName(String name);

    Optional<Department> findByNameIgnoreCase(String name);

    boolean existsByName(String name);
}

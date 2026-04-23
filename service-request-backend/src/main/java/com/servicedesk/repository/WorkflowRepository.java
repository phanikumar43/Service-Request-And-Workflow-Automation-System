package com.servicedesk.repository;

import com.servicedesk.entity.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Workflow entity
 */
@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {

    Optional<Workflow> findByServiceIdAndIsActive(Long serviceId, Boolean isActive);

    List<Workflow> findByServiceId(Long serviceId);

    List<Workflow> findByIsActive(Boolean isActive);
}

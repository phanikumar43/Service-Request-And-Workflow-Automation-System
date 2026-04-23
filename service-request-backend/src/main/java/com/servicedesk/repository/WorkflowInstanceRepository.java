package com.servicedesk.repository;

import com.servicedesk.entity.WorkflowInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for WorkflowInstance entity
 */
@Repository
public interface WorkflowInstanceRepository extends JpaRepository<WorkflowInstance, Long> {

    Optional<WorkflowInstance> findByRequestId(Long requestId);

    List<WorkflowInstance> findByStatus(WorkflowInstance.InstanceStatus status);

    List<WorkflowInstance> findByWorkflowId(Long workflowId);
}

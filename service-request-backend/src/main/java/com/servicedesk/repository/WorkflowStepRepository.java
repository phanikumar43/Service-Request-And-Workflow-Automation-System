package com.servicedesk.repository;

import com.servicedesk.entity.WorkflowStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for WorkflowStep entity
 */
@Repository
public interface WorkflowStepRepository extends JpaRepository<WorkflowStep, Long> {

    List<WorkflowStep> findByWorkflowIdOrderByStepOrderAsc(Long workflowId);

    List<WorkflowStep> findByWorkflowId(Long workflowId);
}

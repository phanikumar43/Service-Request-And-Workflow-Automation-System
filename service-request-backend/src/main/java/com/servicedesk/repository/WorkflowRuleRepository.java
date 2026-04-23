package com.servicedesk.repository;

import com.servicedesk.entity.WorkflowRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for WorkflowRule entity
 */
@Repository
public interface WorkflowRuleRepository extends JpaRepository<WorkflowRule, Long> {

    List<WorkflowRule> findByWorkflowStepId(Long workflowStepId);
}

package com.servicedesk.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * WorkflowRule Entity
 * Defines conditional rules for workflow routing
 */
@Entity
@Table(name = "workflow_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_step_id", nullable = false)
    private WorkflowStep workflowStep;

    @Enumerated(EnumType.STRING)
    @Column(name = "rule_type", nullable = false, length = 20)
    private RuleType ruleType;

    @Column(name = "condition_field", nullable = false, length = 50)
    private String conditionField;

    @Column(name = "condition_operator", nullable = false, length = 20)
    private String conditionOperator;

    @Column(name = "condition_value", nullable = false, length = 255)
    private String conditionValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "next_step_id")
    private WorkflowStep nextStep;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Rule Type Enum
     */
    public enum RuleType {
        IF_PRIORITY,
        IF_DEPARTMENT,
        IF_AMOUNT,
        IF_CATEGORY
    }
}

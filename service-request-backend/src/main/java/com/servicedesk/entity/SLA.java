package com.servicedesk.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * SLA (Service Level Agreement) Entity
 * Defines service level agreements for different priorities
 */
@Entity
@Table(name = "sla")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SLA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority;

    @Column(name = "response_time_hours", nullable = false)
    private int responseTimeHours;

    @Column(name = "resolution_time_hours", nullable = false)
    private int resolutionTimeHours;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Priority Enum
     */
    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}

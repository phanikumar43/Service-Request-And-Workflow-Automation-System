package com.servicedesk.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * SLATracking Entity
 * Tracks SLA compliance for service requests
 */
@Entity
@Table(name = "sla_tracking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SLATracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sla_id", nullable = false)
    private SLA sla;

    @Column(name = "response_due_at", nullable = false)
    private LocalDateTime responseDueAt;

    @Column(name = "resolution_due_at", nullable = false)
    private LocalDateTime resolutionDueAt;

    @Column(name = "response_met", nullable = false)
    private boolean responseMet = false;

    @Column(name = "resolution_met", nullable = false)
    private boolean resolutionMet = false;

    @Column(name = "breached", nullable = false)
    private boolean breached = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

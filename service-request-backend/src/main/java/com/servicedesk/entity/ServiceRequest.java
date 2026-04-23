package com.servicedesk.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ServiceRequest Entity
 * Main entity representing service requests raised by users
 */
@Entity
@Table(name = "service_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", nullable = false, unique = true, length = 50)
    private String ticketId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id") // Made nullable to support category-based requests
    private ServiceCatalog service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    // Category-based request fields
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ServiceCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id")
    private RequestType requestType;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    /**
     * Custom fields specific to request type (stored as JSON)
     * Example: {"system_name": "Outlook", "error_message": "Invalid credentials"}
     */
    @Column(name = "custom_fields", columnDefinition = "JSON")
    private String customFields;

    // Admin Request Management fields
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User assignedAgent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RequestStatus status = RequestStatus.NEW;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_updated_by")
    private User lastUpdatedBy;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    // Relationships
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestAttachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestStatusHistory> statusHistory = new ArrayList<>();

    /**
     * Priority Enum
     */
    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    /**
     * Request Status Enum
     * Represents the complete lifecycle of a service request
     */
    public enum RequestStatus {
        NEW,
        PENDING_APPROVAL,
        APPROVED,
        REJECTED,
        ASSIGNED,
        IN_PROGRESS,
        WAITING_FOR_USER,
        RESOLVED,
        CLOSED,
        CANCELLED
    }

    /**
     * Get category name for JSON serialization
     * Returns category name from direct category or service's category
     */
    @com.fasterxml.jackson.annotation.JsonProperty("categoryName")
    public String getCategoryName() {
        if (category != null && category.getName() != null) {
            return category.getName();
        } else if (service != null && service.getCategory() != null) {
            return service.getCategory().getName();
        }
        return "N/A";
    }
}
